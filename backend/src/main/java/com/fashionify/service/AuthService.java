package com.fashionify.service;

import com.fashionify.dto.LoginRequest;
import com.fashionify.dto.RegisterRequest;
import com.fashionify.entity.User;
import com.fashionify.entity.enums.Role;
import com.fashionify.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        try {
            // 1. Check whether email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
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
            // 5. Save user using userRepository.save(user) & 6. Return saved user
            return userRepository.save(user);
        } catch (Exception e) {
            // Re-throw or handle exception appropriately
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    public User login(LoginRequest request) {
       
        // 1. Find user by email using userRepository.findByEmail(request.getEmail()).
        // 2. Verify password using BCrypt (e.g.,
        // passwordEncoder.matches(request.getPassword(), user.getPassword())).
        // 3. Return user if credentials are valid.
        // 4. Handle invalid credentials later (e.g., throw exception or return null).
    	try {
    		
    	
    	 User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() ->new RuntimeException("User not found"));
    	 
    	 if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
    		     
    		    throw new RuntimeException("Invalid password");
    		}
    	 return user;
    	 
    	} catch (Exception e) {
            // 4. Handle invalid credentials or errors
            throw new RuntimeException("Login failed: " + e.getMessage(), e);
        }
    
    	 
    	
    }
}
