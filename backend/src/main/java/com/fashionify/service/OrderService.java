package com.fashionify.service;

import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.response.OrderItemResponse;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.entity.Order;
import com.fashionify.entity.enums.OrderStatus;
import com.fashionify.repository.OrderItemRepository;
import com.fashionify.repository.OrderRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public OrderResponse createOrder(Long userId, OrderRequest request) {
        // TODO:
        // 1. Find the user by userId using userRepository.findById(userId).
        // 2. Create the Order object.
        // 3. Set address and phone on the Order.
        // 4. Set status to OrderStatus.PLACED.
        // 5. Loop through request.getItems() (List of OrderItemRequest).
        // 6. Find each product by productId using productRepository.findById(productId).
        // 7. Check stock availability later.
        // 8. Create OrderItem object for each item.
        // 9. Store the product's current price in OrderItem.price.
        // 10. Calculate total amount for the order on the backend.
        // 11. Save the order and its items.
        // 12. Later reduce product stock accordingly.
        // 13. Return the created order.
        return null;
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        // TODO:
        // 1. Fetch orders for specific user using orderRepository.findByUserId(userId).
        // 2. Return list of orders.
        return null;
    }

    public List<OrderResponse> getAllOrders() {
        // TODO:
        // 1. Fetch all orders using orderRepository.findAll().
        // 2. Return list of orders.
        return null;
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        // TODO:
        // 1. Find order by orderId using orderRepository.findById(orderId).
        // 2. Update order status to new status.
        // 3. Save updated order using orderRepository.save(order).
        // 4. Return updated order.
        return null;
    }

    public OrderResponse mapToOrderResponse(Order order) {
        if (order == null) return null;

        List<OrderItemResponse> itemResponses = null;
        if (order.getItems() != null) {
            itemResponses = order.getItems().stream().map(item -> new OrderItemResponse(
                    item.getId(),
                    item.getProduct() != null ? item.getProduct().getId() : null,
                    item.getProduct() != null ? item.getProduct().getName() : null,
                    item.getProduct() != null ? item.getProduct().getImageUrl() : null,
                    item.getQuantity(),
                    item.getPrice()
            )).collect(Collectors.toList());
        }

        return new OrderResponse(
                order.getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getAddress(),
                order.getPhone(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt() != null ? order.getCreatedAt().toString() : null,
                itemResponses
        );
    }
}
