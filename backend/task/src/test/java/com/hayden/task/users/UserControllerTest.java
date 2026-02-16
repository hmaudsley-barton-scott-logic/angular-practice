package com.hayden.task.users;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        UserController userController = new UserController(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

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