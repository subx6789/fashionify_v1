package com.fashionify.service.serviceimpl;

import com.fashionify.dto.request.OrderItemRequest;
import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.entity.Order;
import com.fashionify.entity.OrderItem;
import com.fashionify.entity.Product;
import com.fashionify.entity.User;
import com.fashionify.entity.enums.OrderStatus;
import com.fashionify.mapper.OrderMapper;
import com.fashionify.repository.OrderItemRepository;
import com.fashionify.repository.OrderRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import com.fashionify.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            UserRepository userRepository,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Create a new Order
    @Override
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        try {
            User user = findUserByIdOrThrow(userId);

            if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
                throw new RuntimeException("Invalid order: Order must contain at least one item.");
            }

            String address = request.getAddress() != null ? request.getAddress().trim() : "";
            String phone = request.getPhone() != null ? request.getPhone().trim() : "";

            if (address.isEmpty() || phone.isEmpty()) {
                throw new RuntimeException("Delivery address and phone number are required.");
            }

            Order order = new Order();
            order.setUser(user);
            order.setAddress(address);
            order.setPhone(phone);
            order.setStatus(OrderStatus.PLACED);
            order.setCreatedAt(LocalDateTime.now());

            List<OrderItem> orderItems = new ArrayList<>();
            double totalAmount = 0.0;

            for (OrderItemRequest itemReq : request.getItems()) {
                Product product = findProductByIdOrThrow(itemReq.getProductId());

                if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                    throw new RuntimeException("Invalid quantity for product: " + product.getName());
                }
                int quantityOrdered = itemReq.getQuantity();

                int currentStock = product.getStock() != null ? product.getStock() : 0;
                if (currentStock < quantityOrdered) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName() + " (Available: " + currentStock + ", Requested: " + quantityOrdered + ")");
                }

                product.setStock(currentStock - quantityOrdered);
                productRepository.save(product);

                Double dbPrice = product.getPrice() != null ? product.getPrice() : 0.0;

                totalAmount = totalAmount + (dbPrice * quantityOrdered);

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setQuantity(quantityOrdered);
                item.setPrice(dbPrice);
                orderItems.add(item);
            }

            order.setTotalAmount(totalAmount);
            order.setItems(orderItems);

            Order savedOrder = orderRepository.save(order);
            return OrderMapper.toOrderResponse(savedOrder);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    // Get User's Orders (Newest First)
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(Long userId) {
        try {
            List<Order> orders = orderRepository.findByUserIdOrderByIdDesc(userId);
            List<OrderResponse> responseList = new ArrayList<>();

            for (Order order : orders) {
                responseList.add(OrderMapper.toOrderResponse(order));
            }

            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user orders: " + e.getMessage(), e);
        }
    }

    // Get All Orders (Admin - Newest First)
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAllByOrderByIdDesc();
            List<OrderResponse> responseList = new ArrayList<>();

            for (Order order : orders) {
                responseList.add(OrderMapper.toOrderResponse(order));
            }

            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all orders: " + e.getMessage(), e);
        }
    }

    // Update Order Status (Admin)
    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        try {
            Order order = findOrderByIdOrThrow(orderId);
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return OrderMapper.toOrderResponse(updatedOrder);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update order status: " + e.getMessage(), e);
        }
    }

    // Helper: Find User by ID or throw exception
    private User findUserByIdOrThrow(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return optionalUser.get();
    }

    // Helper: Find Product by ID or throw exception
    private Product findProductByIdOrThrow(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }
        return optionalProduct.get();
    }

    // Helper: Find Order by ID or throw exception
    private Order findOrderByIdOrThrow(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        return optionalOrder.get();
    }
}
