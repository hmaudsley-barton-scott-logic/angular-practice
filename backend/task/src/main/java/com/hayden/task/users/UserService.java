package com.hayden.task.users;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(User::toDto)
                .toList();
    }

    public UserDto getUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return user.toDto();
    }

    public UserDto addUser(String userName) {
        User user = User.builder()
                .userName(userName)
                .build();
        userRepository.save(user);
        return user.toDto();
    }
}
