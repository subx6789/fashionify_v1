package com.fashionify.mapper;

import com.fashionify.dto.response.OrderItemResponse;
import com.fashionify.dto.response.OrderResponse;
import com.fashionify.entity.Order;
import com.fashionify.entity.OrderItem;

import java.util.ArrayList;
import java.util.List;

public class OrderMapper {

    // Converts Order entity to OrderResponse DTO
    public static OrderResponse toOrderResponse(Order order) {
        if (order == null) {
            return null;
        }

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

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());

        if (order.getUser() != null) {
            response.setUserId(order.getUser().getId());
            response.setUserName(order.getUser().getName());
            response.setUserEmail(order.getUser().getEmail());
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
