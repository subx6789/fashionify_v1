package com.fashionify.service;

import com.fashionify.dto.request.OrderRequest;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.entity.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    public OrderResponse createOrder(Long userId, OrderRequest request);
    public List<OrderResponse> getMyOrders(Long userId);
    public List<OrderResponse> getAllOrders();
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status);
}
