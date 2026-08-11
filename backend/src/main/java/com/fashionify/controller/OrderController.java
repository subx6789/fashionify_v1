package com.fashionify.controller;

import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.service.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse createOrder(@RequestBody OrderRequest request, HttpSession session) {
        // TODO:
        // 1. Read logged-in user ID from session.
        // 2. Pass user ID and request to OrderService.createOrder().
        // 3. Return created order.
        // 4. Clear cart on frontend after successful response.
        return null;
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(HttpSession session) {
        // TODO:
        // 1. Read logged-in user ID from session.
        // 2. Call OrderService.getMyOrders(userId).
        // 3. Return user's orders.
        return null;
    }

    @GetMapping
    public List<OrderResponse> getAllOrders(HttpSession session) {
        // TODO:
        // 1. Later verify ADMIN role from session.
        // 2. Call OrderService.getAllOrders().
        // 3. Return all orders.
        return null;
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        // TODO:
        // 1. Later verify ADMIN role from session.
        // 2. Read status string from request body.
        // 3. Convert it to OrderStatus enum.
        // 4. Call OrderService.updateOrderStatus(id, status).
        // 5. Return updated order.
        return null;
    }
}
