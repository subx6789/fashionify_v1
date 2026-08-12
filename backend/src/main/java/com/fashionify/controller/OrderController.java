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

    // 1. Create a new Order
    @PostMapping
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthorized: Please log in to place an order.");
        }
        return orderService.createOrder(userId, request);
    }

    // 2. Get User's Orders
    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthorized: Please log in to view your orders.");
        }
        return orderService.getMyOrders(userId);
    }

    // 3. Get All Orders (Admin)
    @GetMapping
    public List<OrderResponse> getAllOrders(HttpSession session) {
        return orderService.getAllOrders();
    }

    // 4. Update Order Status (Admin)
    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusUpdateRequest request,
            HttpSession session) {
        if (request == null || request.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }
        return orderService.updateOrderStatus(id, request.getStatus());
    }
}
