package com.chatnexus.resource;

import com.chatnexus.entity.User;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.CookieParam;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @POST
    @Path("/register")
    @Transactional
    public Response register(User user) {
        System.out.println("DEBUG: Registering user: " + user.username);
        if (user.password == null) {
            System.out.println("DEBUG: Password is NULL");
            return Response.status(400).entity("Password is required").build();
        }
        if (User.findByUsername(user.username) != null) {
            System.out.println("DEBUG: Username already exists: " + user.username);
            return Response.status(400).entity("Username already exists").build();
        }
        try {
            user.persist();
            System.out.println("DEBUG: User persisted with ID: " + user.id);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("Registration failed: " + e.getMessage()).build();
        }
        return Response.ok(user).cookie(new NewCookie.Builder("userId").value(user.id.toString()).path("/").build())
                .build();
    }

    @POST
    @Path("/login")
    public Response login(User user) {
        System.out.println("DEBUG: Login user: " + user.username);
        if (user.password == null) {
            System.out.println("DEBUG: Login password is NULL");
        }
        User existing = User.findByUsername(user.username);
        if (existing == null) {
            System.out.println("DEBUG: User not found: " + user.username);
            return Response.status(401).entity("Invalid credentials").build();
        }
        if (!existing.password.equals(user.password)) {
            System.out.println("DEBUG: Password mismatch for user: " + user.username);
            return Response.status(401).entity("Invalid credentials").build();
        }
        return Response.ok(existing)
                .cookie(new NewCookie.Builder("userId").value(existing.id.toString()).path("/").build()).build();
    }

    @GET
    @Path("/user")
    public Response getCurrentUser(@CookieParam("userId") String userId) {
        if (userId == null) {
            return Response.status(401).build();
        }
        User user = User.findById(Long.parseLong(userId));
        if (user == null) {
            return Response.status(401).build();
        }
        return Response.ok(user).build();
    }

    @GET
    @Path("/users")
    public Response getAllUsers() {
        return Response.ok(User.listAll()).build();
    }

    @POST
    @Path("/logout")
    public Response logout() {
        return Response.ok().cookie(new NewCookie.Builder("userId").value("").path("/").maxAge(0).build()).build();
    }
}
