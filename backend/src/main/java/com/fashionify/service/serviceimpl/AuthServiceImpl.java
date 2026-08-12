package com.fashionify.service.serviceimpl;

import com.fashionify.dto.request.LoginRequest;
import com.fashionify.dto.request.RegisterRequest;
import com.fashionify.dto.response.UserResponse;
import com.fashionify.entity.User;
import com.fashionify.entity.enums.Role;
import com.fashionify.mapper.UserMapper;
import com.fashionify.repository.UserRepository;
import com.fashionify.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        try {
            if (request == null) {
                throw new RuntimeException("Registration details are required.");
            }

            String name = trimValue(request.getName());
            String email = trimValue(request.getEmail());
            String password = trimValue(request.getPassword());

            // Check if email already exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                throw new RuntimeException("User with email " + email + " already exists.");
            }

            // Hash password using jBCrypt
            String encodedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

            // Create and save user entity
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(encodedPassword);
            user.setRole(Role.USER);

            User savedUser = userRepository.save(user);
            return UserMapper.toUserResponse(savedUser);
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    @Override
    public UserResponse login(LoginRequest request) {
        try {
            if (request == null) {
                throw new RuntimeException("Login credentials are required.");
            }

            String email = trimValue(request.getEmail());
            String password = trimValue(request.getPassword());

            User user = findUserByEmailOrThrow(email);

            // Verify password using jBCrypt
            if (!BCrypt.checkpw(password, user.getPassword())) {
                throw new RuntimeException("Invalid email or password.");
            }

            return UserMapper.toUserResponse(user);
        } catch (Exception e) {
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    }

    @Override
    public void logout(HttpSession session) {
        try {
            if (session != null) {
                session.invalidate();
            }
        } catch (Exception e) {
            throw new RuntimeException("Logout failed: " + e.getMessage(), e);
        }
    }

    @Override
    public UserResponse getUserById(Long id) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            if (optionalUser.isPresent()) {
                return UserMapper.toUserResponse(optionalUser.get());
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user by id: " + e.getMessage(), e);
        }
    }

    // Helper method for safe string trimming
    private String trimValue(String value) {
        return value != null ? value.trim() : "";
    }

    // Helper method to find user by email
    private User findUserByEmailOrThrow(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("Invalid email or password.");
        }
        return optionalUser.get();
    }
}
