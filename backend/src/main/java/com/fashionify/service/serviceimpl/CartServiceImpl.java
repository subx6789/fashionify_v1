package com.fashionify.service.serviceimpl;

import com.fashionify.dto.request.CartItemRequest;
import com.fashionify.dto.response.CartResponse;
import com.fashionify.entity.Cart;
import com.fashionify.entity.CartItem;
import com.fashionify.entity.Product;
import com.fashionify.entity.User;
import com.fashionify.mapper.CartMapper;
import com.fashionify.repository.CartRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.repository.UserRepository;
import com.fashionify.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Helper: Get or create Cart entity for user
    private Cart getOrCreateCartEntity(Long userId) {
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

    // 1. Fetch user's cart
    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            return CartMapper.toCartResponse(cart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch cart: " + e.getMessage(), e);
        }
    }

    // 2. Add item to cart
    @Override
    public CartResponse addItem(Long userId, CartItemRequest request) {
        try {
            int addQuantity = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

            Cart cart = getOrCreateCartEntity(userId);
            Product product = findProductByIdOrThrow(request.getProductId());

            CartItem existingItem = findCartItemByProductId(cart, product.getId());

            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + addQuantity);
            } else {
                CartItem newItem = new CartItem(cart, product, addQuantity);
                cart.getItems().add(newItem);
            }

            Cart savedCart = cartRepository.save(cart);
            return CartMapper.toCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add item to cart: " + e.getMessage(), e);
        }
    }

    // 3. Update item quantity in cart
    @Override
    public CartResponse updateItemQuantity(Long userId, Long productId, CartItemRequest request) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            int newQuantity = (request != null && request.getQuantity() != null) ? request.getQuantity() : 0;

            if (newQuantity <= 0) {
                removeCartItemByProductId(cart, productId);
            } else {
                CartItem existingItem = findCartItemByProductId(cart, productId);
                if (existingItem != null) {
                    existingItem.setQuantity(newQuantity);
                } else {
                    Product product = findProductByIdOrThrow(productId);
                    CartItem newItem = new CartItem(cart, product, newQuantity);
                    cart.getItems().add(newItem);
                }
            }

            Cart savedCart = cartRepository.save(cart);
            return CartMapper.toCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update cart item quantity: " + e.getMessage(), e);
        }
    }

    // 4. Remove single item from cart
    @Override
    public CartResponse removeItem(Long userId, Long productId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            removeCartItemByProductId(cart, productId);

            Cart savedCart = cartRepository.save(cart);
            return CartMapper.toCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove item from cart: " + e.getMessage(), e);
        }
    }

    // 5. Clear all items from cart
    @Override
    public CartResponse clearCart(Long userId) {
        try {
            Cart cart = getOrCreateCartEntity(userId);
            cart.getItems().clear();
            Cart savedCart = cartRepository.save(cart);
            return CartMapper.toCartResponse(savedCart);
        } catch (Exception e) {
            throw new RuntimeException("Failed to clear cart: " + e.getMessage(), e);
        }
    }

    // Helper: Find Product by ID or throw exception
    private Product findProductByIdOrThrow(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        return optionalProduct.get();
    }

    // Helper: Find existing CartItem in Cart by Product ID
    private CartItem findCartItemByProductId(Cart cart, Long productId) {
        if (cart == null || cart.getItems() == null) return null;
        for (CartItem item : cart.getItems()) {
            if (item.getProduct() != null && item.getProduct().getId().equals(productId)) {
                return item;
            }
        }
        return null;
    }

    // Helper: Remove CartItem from Cart by Product ID
    private void removeCartItemByProductId(Cart cart, Long productId) {
        if (cart == null || cart.getItems() == null) return;
        for (int i = 0; i < cart.getItems().size(); i++) {
            if (cart.getItems().get(i).getProduct().getId().equals(productId)) {
                cart.getItems().remove(i);
                break;
            }
        }
    }
}
