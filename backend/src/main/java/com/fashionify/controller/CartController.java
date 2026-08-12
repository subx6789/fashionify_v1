package com.fashionify.controller;

import com.fashionify.dto.request.CartItemRequest;
import com.fashionify.dto.response.CartResponse;
import com.fashionify.service.CartService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserIdOrThrow(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthorized: Please log in to manage your cart.");
        }
        return userId;
    }

    // 1. GET /api/cart
    @GetMapping
    public CartResponse getCart(HttpSession session) {
        Long userId = getUserIdOrThrow(session);
        return cartService.getCart(userId);
    }

    // 2. POST /api/cart/items
    @PostMapping("/items")
    public CartResponse addItemToCart(@Valid @RequestBody CartItemRequest request, HttpSession session) {
        Long userId = getUserIdOrThrow(session);
        return cartService.addItem(userId, request);
    }

    // 3. PUT /api/cart/items/{productId}
    @PutMapping("/items/{productId}")
    public CartResponse updateCartItemQuantity(@PathVariable Long productId,
                                                @Valid @RequestBody CartItemRequest request,
                                                HttpSession session) {
        Long userId = getUserIdOrThrow(session);
        return cartService.updateItemQuantity(userId, productId, request);
    }

    // 4. DELETE /api/cart/items/{productId}
    @DeleteMapping("/items/{productId}")
    public CartResponse removeCartItem(@PathVariable Long productId, HttpSession session) {
        Long userId = getUserIdOrThrow(session);
        return cartService.removeItem(userId, productId);
    }

    // 5. DELETE /api/cart
    @DeleteMapping
    public CartResponse clearCart(HttpSession session) {
        Long userId = getUserIdOrThrow(session);
        return cartService.clearCart(userId);
    }
}
