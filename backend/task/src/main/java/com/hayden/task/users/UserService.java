package com.hayden.task.users;

import com.hayden.task.tasks.TaskNotFoundException;
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
                .orElseThrow(() -> new TaskNotFoundException(id));
        return user.toDto();
    }
}
