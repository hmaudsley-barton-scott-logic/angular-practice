package com.hayden.task.users;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    UUID aliceId = UUID.randomUUID();
    User alice = User.builder().id(aliceId).userName("alice").build();
    UUID bobId = UUID.randomUUID();
    User bob = User.builder().id(bobId).userName("bob").build();

    @Test
    void getAllUsers_returnsUserDtos() {
        List<User> users = List.of(alice, bob);
        when(userRepository.findAll()).thenReturn(users);
        List<UserDto> result = userService.getAllUsers();
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(aliceId);
    }

    @Test
    void getUser_returnsUserDto() {
        when(userRepository.findById(aliceId)).thenReturn(java.util.Optional.of(alice));
        UserDto result = userService.getUser(aliceId);
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(aliceId);
        assertThat(result.getUserName()).isEqualTo("alice");
    }

    @Test
    void getUser_throwsExceptionWhenNotFound() {
        when(userRepository.findById(aliceId)).thenReturn(java.util.Optional.empty());
        org.junit.jupiter.api.Assertions.assertThrows(UserNotFoundException.class, () -> {
            userService.getUser(aliceId);
        });
    }

    @Test
    void getAllUsers_returnsEmptyList() {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());
        List<UserDto> result = userService.getAllUsers();
        assertThat(result).isEmpty();
    }

    @Test
    void addUser_createsAndReturnsUserDto() {
        String username = "charlie";
        UUID charlieId = UUID.randomUUID();
        User charlie = User.builder().id(charlieId).userName(username).build();
        
        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class))).thenReturn(charlie);
        
        UserDto result = userService.addUser(username);
        
        assertThat(result).isNotNull();
        assertThat(result.getUserName()).isEqualTo(username);
        org.mockito.Mockito.verify(userRepository).save(org.mockito.ArgumentMatchers.any(User.class));
    }
}