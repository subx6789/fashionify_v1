package com.fashionify.service;

import com.fashionify.dto.request.CartItemRequest;
import com.fashionify.dto.response.CartResponse;

public interface CartService {
    public CartResponse getCart(Long userId);
    public CartResponse addItem(Long userId, CartItemRequest request);
    public CartResponse updateItemQuantity(Long userId, Long productId, CartItemRequest request);
    public CartResponse removeItem(Long userId, Long productId);
    public CartResponse clearCart(Long userId);
}
