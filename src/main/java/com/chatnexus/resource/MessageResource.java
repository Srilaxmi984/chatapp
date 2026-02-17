package com.chatnexus.resource;

import com.chatnexus.entity.Message;
import com.chatnexus.entity.User;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/messages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageResource {

    @GET
    public List<Message> getAll() {
        return Message.listAll();
    }

    @POST
    @Transactional
    public Response create(CreateMessageRequest request) {
        if (request.senderId == null) {
            return Response.status(400).entity("Sender ID required").build();
        }

        User sender = User.findById(request.senderId);
        if (sender == null) {
            return Response.status(404).entity("Sender not found").build();
        }

        Message message = new Message();
        message.content = request.content;
        message.sender = sender;

        message.persist();
        return Response.ok(message).build();
    }

    public static class CreateMessageRequest {
        public String content;
        public Long senderId;
    }
}
