package com.fashionify.repository;

import com.fashionify.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    public Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    public void deleteByCartId(Long cartId);
    public void deleteByProductId(Long productId);
}
