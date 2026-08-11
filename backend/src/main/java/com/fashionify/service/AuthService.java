package com.fashionify.service;

import com.fashionify.dto.request.LoginRequest;
import com.fashionify.dto.request.RegisterRequest;
import com.fashionify.dto.response.UserResponse;
import com.fashionify.entity.User;
import com.fashionify.entity.enums.Role;
import com.fashionify.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

	private final UserRepository userRepository;

	public AuthService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public UserResponse register(RegisterRequest request) {
		try {
			// 1. Check whether email already exists
			Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
			if (existingUser.isPresent()) {
				throw new RuntimeException("User with email " + request.getEmail() + " already exists.");
			}

			// 2. Hash password using jBCrypt
			String encodedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

			// 3. Create a new User object
			User user = new User();
			user.setName(request.getName());
			user.setEmail(request.getEmail());
			user.setPassword(encodedPassword);

			// 4. Set role to Role.USER
			user.setRole(Role.USER);

			// 5. Save user using userRepository.save(user) & 6. Return saved user as UserResponse
			User savedUser = userRepository.save(user);
			return mapToUserResponse(savedUser);
		} catch (Exception e) {
			throw new RuntimeException("Registration failed: " + e.getMessage(), e);
		}
	}

	public UserResponse login(LoginRequest request) {
		try {
			// 1. Find user by email using simple if-else check
			Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
			if (!optionalUser.isPresent()) {
				throw new RuntimeException("Invalid email or password.");
			}
			User user = optionalUser.get();

			// 2. Verify password using jBCrypt
			if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
				throw new RuntimeException("Invalid email or password.");
			}

			// 3. Return user response if credentials are valid
			return mapToUserResponse(user);
		} catch (Exception e) {
			throw new RuntimeException("Login failed: " + e.getMessage(), e);
		}
	}

	public void logout(HttpSession session) {
		try {
			if (session != null) {
				session.invalidate();
			}
		} catch (Exception e) {
			throw new RuntimeException("Logout failed: " + e.getMessage(), e);
		}
	}

	public UserResponse getUserById(Long id) {
		try {
			Optional<User> optionalUser = userRepository.findById(id);
			if (optionalUser.isPresent()) {
				return mapToUserResponse(optionalUser.get());
			}
			return null;
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch user by id: " + e.getMessage(), e);
		}
	}

	private UserResponse mapToUserResponse(User user) {
		if (user == null) {
			return null;
		}
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
	}
}