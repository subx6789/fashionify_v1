package com.fashionify.service.serviceimpl;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.entity.Product;
import com.fashionify.mapper.ProductMapper;
import com.fashionify.repository.CartItemRepository;
import com.fashionify.repository.OrderItemRepository;
import com.fashionify.repository.ProductRepository;
import com.fashionify.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              CartItemRepository cartItemRepository,
                              OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // 1. Get All Products
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();
            List<ProductResponse> responseList = new ArrayList<>();
            for (Product pro : products) {
                responseList.add(ProductMapper.toProductResponse(pro));
            }
            return responseList;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch products: " + e.getMessage(), e);
        }
    }

    // 2. Get Product By ID
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        try {
            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isPresent()) {
                return ProductMapper.toProductResponse(optionalProduct.get());
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch product with id " + id + ": " + e.getMessage(), e);
        }
    }

    // 3. Add New Product
    @Override
    public ProductResponse addProduct(ProductRequest request) {
        try {
            trimProductRequest(request);

            Product product = new Product();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setImageUrl(request.getImageUrl());
            product.setStock(request.getStock());

            Product savedProduct = productRepository.save(product);
            return ProductMapper.toProductResponse(savedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add product: " + e.getMessage(), e);
        }
    }

    // 4. Update Existing Product
    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        try {
            trimProductRequest(request);

            Product product = findProductByIdOrThrow(id);
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setImageUrl(request.getImageUrl());
            product.setStock(request.getStock());

            Product updatedProduct = productRepository.save(product);
            return ProductMapper.toProductResponse(updatedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product with id " + id + ": " + e.getMessage(), e);
        }
    }

    // 5. Delete Product
    @Override
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

    // Helper: Find Product by ID or throw exception
    private Product findProductByIdOrThrow(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return optionalProduct.get();
    }

    // Helper: Trim ProductRequest string fields
    private void trimProductRequest(ProductRequest request) {
        if (request != null) {
            if (request.getName() != null) request.setName(request.getName().trim());
            if (request.getDescription() != null) request.setDescription(request.getDescription().trim());
            if (request.getImageUrl() != null) request.setImageUrl(request.getImageUrl().trim());
        }
    }
}
