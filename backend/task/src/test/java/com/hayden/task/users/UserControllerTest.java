package com.hayden.task.users;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    UUID aliceId = UUID.randomUUID();
    UUID bobId = UUID.randomUUID();

    @Test
    void getUsers_returnsUserDtos() throws Exception {
        UserDto aliceDto = UserDto.builder().id(aliceId).userName("alice").build();
        UserDto bobDto = UserDto.builder().id(bobId).userName("bob").build();
        List<UserDto> userDtos = List.of(aliceDto, bobDto);
        when(userService.getAllUsers()).thenReturn(userDtos);

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(aliceId.toString()))
                .andExpect(jsonPath("$[0].userName").value("alice"));
    }

    @Test
    void getUser_returnsUserDto() throws Exception {
        UserDto aliceDto = UserDto.builder().id(aliceId).userName("alice").build();
        when(userService.getUser(aliceId)).thenReturn(aliceDto);

        mockMvc.perform(get("/users/{id}", aliceId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(aliceId.toString()))
                .andExpect(jsonPath("$.userName").value("alice"));
    }

    @Test
    void getUser_returnsNotFoundWhenUserNotFound() throws Exception {
        when(userService.getUser(aliceId)).thenThrow(new UserNotFoundException(aliceId));

        mockMvc.perform(get("/users/{id}", aliceId))
                .andExpect(status().isNotFound());
    }
}