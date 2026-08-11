package com.fashionify.service;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.entity.Product;
import com.fashionify.repository.CartItemRepository;
import com.fashionify.repository.OrderItemRepository;
import com.fashionify.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository,
                          CartItemRepository cartItemRepository,
                          OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // 1. Get All Products (using a simple for-each loop)
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();
            List<ProductResponse> responseList = new ArrayList<>();
            for (Product pro : products) {
                ProductResponse response = mapToProductResponse(pro);
                responseList.add(response);
            }
            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch products: " + e.getMessage(), e);
        }
    }

    // 2. Get Product By ID (using simple Optional check)
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        try {
            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                return mapToProductResponse(product);
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch product with id " + id + ": " + e.getMessage(), e);
        }
    }

    // 3. Add New Product
    public ProductResponse addProduct(ProductRequest request) {
        try {
            Product product = new Product();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setImageUrl(request.getImageUrl());
            product.setStock(request.getStock());
            Product savedProduct = productRepository.save(product);
            return mapToProductResponse(savedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add product: " + e.getMessage(), e);
        }
    }

    // 4. Update Existing Product
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        try {
            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                product.setName(request.getName());
                product.setDescription(request.getDescription());
                product.setPrice(request.getPrice());
                product.setImageUrl(request.getImageUrl());
                product.setStock(request.getStock());
                Product updatedProduct = productRepository.save(product);
                return mapToProductResponse(updatedProduct);
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product with id " + id + ": " + e.getMessage(), e);
        }
    }

    // 5. Delete Product (cascades to related cart items and order items to avoid Foreign Key constraint violations)
    public void deleteProduct(Long id) {
        try {
            if (productRepository.existsById(id)) {
                cartItemRepository.deleteByProductId(id);
                orderItemRepository.deleteByProductId(id);
                productRepository.deleteById(id);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product with id " + id + ": " + e.getMessage(), e);
        }
    }

    public ProductResponse mapToProductResponse(Product product) {
        if (product == null) {
            return null;
        }
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        response.setStock(product.getStock());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
}
