package com.chatnexus;

import com.chatnexus.entity.Message;
import com.chatnexus.entity.User;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class DbTest {

    @Test
    @Transactional
    public void testCrudOperations() {
        System.out.println("Starting DB CRUD Test...");

        // 1. Create User
        User user = new User();
        user.username = "testuser_junit";
        user.password = "password";
        user.persist();
        assertNotNull(user.id);
        System.out.println("User created: " + user.id);

        // 2. Read User
        User retrievedUser = User.findById(user.id);
        assertNotNull(retrievedUser);
        assertEquals("testuser_junit", retrievedUser.username);
        System.out.println("Read User: SUCCESS");

        // 3. Update User
        retrievedUser.username = "updateduser_junit";
        // managed entity, flush will update
        User updatedUser = User.findById(user.id);
        assertEquals("updateduser_junit", updatedUser.username);
        System.out.println("User updated.");

        // 4. Create Message
        Message msg = new Message();
        msg.content = "Hello JUnit";
        msg.sender = retrievedUser;
        msg.persist();
        assertNotNull(msg.id);
        System.out.println("Message created: " + msg.id);

        // 5. Read Message
        Message retrievedMsg = Message.findById(msg.id);
        assertNotNull(retrievedMsg);
        assertEquals("Hello JUnit", retrievedMsg.content);
        System.out.println("Read Message: SUCCESS");

        // Delete
        msg.delete();
        assertNull(Message.findById(msg.id));
        System.out.println("Delete Message: SUCCESS");

        retrievedUser.delete();
        assertNull(User.findById(user.id));
        System.out.println("Delete User: SUCCESS");
    }
}
