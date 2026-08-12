package com.fashionify.mapper;

import com.fashionify.dto.response.CartItemResponse;
import com.fashionify.dto.response.CartResponse;
import com.fashionify.entity.Cart;
import com.fashionify.entity.CartItem;

import java.util.ArrayList;
import java.util.List;

public class CartMapper {

    // Converts Cart entity to CartResponse DTO
    public static CartResponse toCartResponse(Cart cart) {
        if (cart == null) {
            return null;
        }

        List<CartItemResponse> itemResponses = new ArrayList<>();
        double totalAmount = 0.0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                CartItemResponse itemResponse = new CartItemResponse(
                        item.getId(),
                        item.getProduct(),
                        item.getQuantity()
                );
                itemResponses.add(itemResponse);

                if (item.getProduct() != null && item.getProduct().getPrice() != null) {
                    totalAmount = totalAmount + (item.getProduct().getPrice() * item.getQuantity());
                }
            }
        }

        return new CartResponse(
                cart.getId(),
                cart.getUser() != null ? cart.getUser().getId() : null,
                itemResponses,
                totalAmount
        );
    }
}
