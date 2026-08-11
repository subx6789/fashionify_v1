package com.fashionify.service;

import com.fashionify.dto.request.CartItemRequest;
import com.fashionify.dto.response.CartItemResponse;
import com.fashionify.dto.response.CartResponse;
import com.fashionify.entity.Cart;
import com.fashionify.entity.CartItem;
import com.fashionify.entity.Product;
import com.fashionify.entity.User;
import com.fashionify.repository.CartRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // 1. Get or create Cart entity for user
    public Cart getOrCreateCartEntity(Long userId) {
        try {
            Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
            if (optionalCart.isPresent()) {
                return optionalCart.get();
            }

            Optional<User> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                throw new RuntimeException("User not found with id: " + userId);
            }

            Cart cart = new Cart(optionalUser.get());
            return cartRepository.save(cart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get or create cart: " + e.getMessage(), e);
        }
    }

    // 2. Fetch user's cart
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            return mapToCartResponse(cart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch cart: " + e.getMessage(), e);
        }
    }

    // 3. Add item to cart
    public CartResponse addItem(Long userId, CartItemRequest request) {
        try {
            if (request.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }

            int addQuantity = 1;
            if (request.getQuantity() != null && request.getQuantity() > 0) {
                addQuantity = request.getQuantity();
            }

            Cart cart = getOrCreateCartEntity(userId);

            Optional<Product> optionalProduct = productRepository.findById(request.getProductId());
            if (!optionalProduct.isPresent()) {
                throw new RuntimeException("Product not found with id: " + request.getProductId());
            }
            Product product = optionalProduct.get();

            CartItem existingItem = null;
            for (CartItem item : cart.getItems()) {
                if (item.getProduct().getId().equals(product.getId())) {
                    existingItem = item;
                    break;
                }
            }

            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + addQuantity);
            } else {
                CartItem newItem = new CartItem(cart, product, addQuantity);
                cart.getItems().add(newItem);
            }

            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add item to cart: " + e.getMessage(), e);
        }
    }

    // 4. Update item quantity in cart
    public CartResponse updateItemQuantity(Long userId, Long productId, CartItemRequest request) {
        try {
            Cart cart = getOrCreateCartEntity(userId);

            int newQuantity = 0;
            if (request != null && request.getQuantity() != null) {
                newQuantity = request.getQuantity();
            }

            if (newQuantity <= 0) {
                for (int i = 0; i < cart.getItems().size(); i++) {
                    if (cart.getItems().get(i).getProduct().getId().equals(productId)) {
                        cart.getItems().remove(i);
                        break;
                    }
                }
            } else {
                CartItem existingItem = null;
                for (CartItem item : cart.getItems()) {
                    if (item.getProduct().getId().equals(productId)) {
                        existingItem = item;
                        break;
                    }
                }

                if (existingItem != null) {
                    existingItem.setQuantity(newQuantity);
                } else {
                    Optional<Product> optionalProduct = productRepository.findById(productId);
                    if (!optionalProduct.isPresent()) {
                        throw new RuntimeException("Product not found with id: " + productId);
                    }
                    CartItem newItem = new CartItem(cart, optionalProduct.get(), newQuantity);
                    cart.getItems().add(newItem);
                }
            }

            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update cart item quantity: " + e.getMessage(), e);
        }
    }

    // 5. Remove single item from cart
    public CartResponse removeItem(Long userId, Long productId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);

            for (int i = 0; i < cart.getItems().size(); i++) {
                if (cart.getItems().get(i).getProduct().getId().equals(productId)) {
                    cart.getItems().remove(i);
                    break;
                }
            }

            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove item from cart: " + e.getMessage(), e);
        }
    }

    // 6. Clear all items from cart
    public CartResponse clearCart(Long userId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            cart.getItems().clear();
            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to clear cart: " + e.getMessage(), e);
        }
    }

    // 7. Helper method using try-catch to build DTO response
    private CartResponse mapToCartResponse(Cart cart) {
        try {
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
                        totalAmount += item.getProduct().getPrice() * item.getQuantity();
                    }
                }
            }

            return new CartResponse(cart.getId(), cart.getUser().getId(), itemResponses, totalAmount);
        } catch (Exception e) {
            throw new RuntimeException("Failed to map cart response: " + e.getMessage(), e);
        }
    }
}
