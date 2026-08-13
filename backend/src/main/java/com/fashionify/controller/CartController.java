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

    private Long verifyUserOrThrow(HttpSession session) {
        if (session == null) {
            throw new RuntimeException("Unauthorized: Please log in to manage your cart.");
        }
        Long userId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        if (userId == null || role == null || !"USER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Unauthorized: Customer (USER) access required.");
        }
        return userId;
    }

    // GET /api/cart
    @GetMapping
    public CartResponse getCart(HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return cartService.getCart(userId);
    }

    // POST /api/cart/items
    @PostMapping("/items")
    public CartResponse addItemToCart(@Valid @RequestBody CartItemRequest request, HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return cartService.addItem(userId, request);
    }

    // PUT /api/cart/items/{productId}
    @PutMapping("/items/{productId}")
    public CartResponse updateCartItemQuantity(@PathVariable Long productId,
                                                @Valid @RequestBody CartItemRequest request,
                                                HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return cartService.updateItemQuantity(userId, productId, request);
    }

    // DELETE /api/cart/items/{productId}
    @DeleteMapping("/items/{productId}")
    public CartResponse removeCartItem(@PathVariable Long productId, HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return cartService.removeItem(userId, productId);
    }

    // DELETE /api/cart
    @DeleteMapping
    public CartResponse clearCart(HttpSession session) {
        Long userId = verifyUserOrThrow(session);
        return cartService.clearCart(userId);
    }
}
