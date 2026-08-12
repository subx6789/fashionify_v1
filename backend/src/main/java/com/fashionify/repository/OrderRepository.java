package com.fashionify.repository;

import com.fashionify.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Fetch orders for a specific user ordered by newest first
    public List<Order> findByUserIdOrderByIdDesc(Long userId);

    // Fetch all orders for admin ordered by newest first
    public List<Order> findAllByOrderByIdDesc();
}
