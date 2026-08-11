package com.fashionify.dto.request;

import com.fashionify.entity.enums.OrderStatus;

public class OrderStatusUpdateRequest {

    private OrderStatus status;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatusUpdateRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
