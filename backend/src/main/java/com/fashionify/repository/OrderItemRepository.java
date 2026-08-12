package com.fashionify.repository;

import com.fashionify.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    public void deleteByProductId(Long productId);
}
