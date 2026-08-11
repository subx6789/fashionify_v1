package com.fashionify.service;

import com.fashionify.dto.request.CartItemRequest;
import com.fashionify.dto.response.CartItemResponse;
import com.fashionify.dto.response.CartResponse;
import com.fashionify.entity.Cart;
import com.fashionify.entity.CartItem;
import com.fashionify.entity.Product;
import com.fashionify.entity.User;
import com.fashionify.repository.CartItemRepository;
import com.fashionify.repository.CartRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCartEntity(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            Cart cart = new Cart(user);
            return cartRepository.save(cart);
        });
    }

    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCartEntity(userId);
        return mapToCartResponse(cart);
    }

    public CartResponse addItem(Long userId, CartItemRequest request) {
        if (request.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }
        int addQuantity = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

        Cart cart = getOrCreateCartEntity(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + addQuantity);
        } else {
            CartItem newItem = new CartItem(cart, product, addQuantity);
            cart.getItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    public CartResponse updateItemQuantity(Long userId, Long productId, CartItemRequest request) {
        Cart cart = getOrCreateCartEntity(userId);
        int newQuantity = (request != null && request.getQuantity() != null) ? request.getQuantity() : 0;

        if (newQuantity <= 0) {
            cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        } else {
            Optional<CartItem> existingItemOpt = cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst();

            if (existingItemOpt.isPresent()) {
                existingItemOpt.get().setQuantity(newQuantity);
            } else {
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
                CartItem newItem = new CartItem(cart, product, newQuantity);
                cart.getItems().add(newItem);
            }
        }

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    public CartResponse removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCartEntity(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    public CartResponse clearCart(Long userId) {
        Cart cart = getOrCreateCartEntity(userId);
        cart.getItems().clear();
        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = (cart.getItems() != null) ? cart.getItems().stream()
                .map(item -> new CartItemResponse(item.getId(), item.getProduct(), item.getQuantity()))
                .collect(Collectors.toList()) : new ArrayList<>();

        double totalAmount = itemResponses.stream()
                .mapToDouble(item -> (item.getProduct() != null && item.getProduct().getPrice() != null
                        ? item.getProduct().getPrice()
                        : 0.0) * item.getQuantity())
                .sum();

        return new CartResponse(cart.getId(), cart.getUser().getId(), itemResponses, totalAmount);
    }
}
