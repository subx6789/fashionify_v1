package com.fashionify.mapper;

import com.fashionify.dto.response.UserResponse;
import com.fashionify.entity.User;

public class UserMapper {

    // Converts User entity to UserResponse DTO
    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
