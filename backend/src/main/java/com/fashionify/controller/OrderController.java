package com.fashionify.controller;

import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.request.OrderStatusUpdateRequest;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.service.OrderService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create a new Order (Customer Only)
    @PostMapping
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest request, HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return orderService.createOrder(userId, request);
    }

    // Get User's Orders (Customer Only)
    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return orderService.getMyOrders(userId);
    }

    // Get All Orders (Admin)
    @GetMapping
    public List<OrderResponse> getAllOrders(HttpSession session) {
        verifyAdmin(session);
        return orderService.getAllOrders();
    }

    // Update Order Status (Admin)
    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest request,
            HttpSession session) {
        verifyAdmin(session);
        if (request == null || request.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }
        return orderService.updateOrderStatus(id, request.getStatus());
    }

    // Helper method to verify Admin role from session
    private void verifyAdmin(HttpSession session) {
        if (session == null) {
            throw new RuntimeException("Unauthorized: Admin access required.");
        }
        Long userId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        if (userId == null || role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Unauthorized: Admin access required.");
        }
    }

    // Helper method to verify USER (Customer) role from session
    private Long verifyUserOrThrow(HttpSession session) {
        if (session == null) {
            throw new RuntimeException("Unauthorized: Please log in to access customer features.");
        }
        Long userId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        if (userId == null || role == null || !"USER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Unauthorized: Customer (USER) access required.");
        }
        return userId;
    }
}
