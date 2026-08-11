package com.fashionify.service;

import com.fashionify.dto.request.OrderItemRequest;
import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.response.OrderItemResponse;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.entity.Order;
import com.fashionify.entity.OrderItem;
import com.fashionify.entity.Product;
import com.fashionify.entity.User;
import com.fashionify.entity.enums.OrderStatus;
import com.fashionify.repository.OrderItemRepository;
import com.fashionify.repository.OrderRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // 1. Create a new Order
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        try {
            // Find User
            Optional<User> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                throw new RuntimeException("User not found with ID: " + userId);
            }
            User user = optionalUser.get();

            // Create Order
            Order order = new Order();
            order.setUser(user);
            order.setAddress(request.getAddress());
            order.setPhone(request.getPhone());
            order.setStatus(OrderStatus.PLACED);
            order.setCreatedAt(LocalDateTime.now());

            List<OrderItem> orderItems = new ArrayList<>();
            double totalAmount = 0.0;

            // Loop through requested items
            if (request.getItems() != null) {
                for (OrderItemRequest itemReq : request.getItems()) {
                    Optional<Product> optionalProduct = productRepository.findById(itemReq.getProductId());
                    if (!optionalProduct.isPresent()) {
                        throw new RuntimeException("Product not found with ID: " + itemReq.getProductId());
                    }
                    Product product = optionalProduct.get();

                    OrderItem item = new OrderItem();
                    item.setOrder(order);
                    item.setProduct(product);
                    item.setQuantity(itemReq.getQuantity());
                    item.setPrice(product.getPrice());

                    totalAmount = totalAmount + (product.getPrice() * itemReq.getQuantity());
                    orderItems.add(item);
                }
            }

            order.setTotalAmount(totalAmount);
            order.setItems(orderItems);

            Order savedOrder = orderRepository.save(order);
            return mapToOrderResponse(savedOrder);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // 2. Get User's Orders
    public List<OrderResponse> getMyOrders(Long userId) {
        try {
            List<Order> orders = orderRepository.findByUserId(userId);
            List<OrderResponse> responseList = new ArrayList<>();

            for (Order order : orders) {
                OrderResponse response = mapToOrderResponse(order);
                responseList.add(response);
            }

            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user orders: " + e.getMessage(), e);
        }
    }

    // 3. Get All Orders (Admin)
    public List<OrderResponse> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            List<OrderResponse> responseList = new ArrayList<>();

            for (Order order : orders) {
                OrderResponse response = mapToOrderResponse(order);
                responseList.add(response);
            }

            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all orders: " + e.getMessage(), e);
        }
    }

    // 4. Update Order Status (Admin)
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        try {
            Optional<Order> optionalOrder = orderRepository.findById(orderId);
            if (!optionalOrder.isPresent()) {
                throw new RuntimeException("Order not found with ID: " + orderId);
            }

            Order order = optionalOrder.get();
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return mapToOrderResponse(updatedOrder);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update order status: " + e.getMessage(), e);
        }
    }

    // Helper Method: Convert Order Entity -> OrderResponse DTO (using simple for
    // loop)
    public OrderResponse mapToOrderResponse(Order order) {
        if (order == null) {
            return null;
        }

        // Convert OrderItems
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                OrderItemResponse itemDto = new OrderItemResponse();
                itemDto.setId(item.getId());

                if (item.getProduct() != null) {
                    itemDto.setProductId(item.getProduct().getId());
                    itemDto.setProductName(item.getProduct().getName());
                    itemDto.setProductImageUrl(item.getProduct().getImageUrl());
                }

                itemDto.setQuantity(item.getQuantity());
                itemDto.setPrice(item.getPrice());
                itemResponses.add(itemDto);
            }
        }

        // Build OrderResponse DTO
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());

        if (order.getUser() != null) {
            response.setUserId(order.getUser().getId());
        }

        response.setAddress(order.getAddress());
        response.setPhone(order.getPhone());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());

        if (order.getCreatedAt() != null) {
            response.setCreatedAt(order.getCreatedAt().toString());
        }

        response.setItems(itemResponses);
        return response;
    }
}
