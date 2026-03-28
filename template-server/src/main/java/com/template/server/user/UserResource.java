package com.template.server.user;

import com.template.api.user.CreateUserRequest;
import com.template.api.user.CreateUserResponse;
import com.template.api.user.UpdateUserRequest;
import com.template.api.user.User;
import com.template.api.user.UserErrors;
import com.template.api.user.UserRoleType;
import com.template.api.user.UserService;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public final class UserResource implements UserService {

    private final UserRepository userRepository;

    public UserResource(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> listUsers() {
        return userRepository.findAll().stream().map(this::toUser).toList();
    }

    @Override
    public User getUser(final UUID userId) {
        return userRepository.findById(userId).map(this::toUser).orElseThrow(() -> UserErrors.userNotFound(userId));
    }

    @Override
    public CreateUserResponse createUser(final CreateUserRequest request) {
        final UserEntity entity = new UserEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(request.getName());
        entity.setRole(UserRoleType.MEMBER.toString());

        return CreateUserResponse.builder()
                .user(toUser(userRepository.save(entity)))
                .build();
    }

    @Override
    public User updateUser(final UUID userId, final UpdateUserRequest request) {
        final UserEntity entity = userRepository.findById(userId).orElseThrow(() -> UserErrors.userNotFound(userId));

        request.getName().ifPresent(entity::setName);
        request.getRole().ifPresent(role -> entity.setRole(role.toString()));

        return toUser(userRepository.save(entity));
    }

    @Override
    public void deleteUser(final UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw UserErrors.userNotFound(userId);
        }
        userRepository.deleteById(userId);
    }

    private User toUser(final UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .name(entity.getName())
                .role(UserRoleType.valueOf(entity.getRole()))
                .build();
    }
}
