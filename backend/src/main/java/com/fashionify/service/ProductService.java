package com.fashionify.service;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.entity.Product;
import com.fashionify.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        // TODO:
        // 1. Fetch all products using productRepository.findAll().
        // 2. Return list of products.
        return null;
    }

    public ProductResponse getProductById(Long id) {
        // TODO:
        // 1. Fetch product by ID using productRepository.findById(id).
        // 2. Return product if found, or handle not found case.
        return null;
    }

    public ProductResponse addProduct(ProductRequest request) {
        // TODO:
        // 1. Create a new Product instance.
        // 2. Map fields from ProductRequest (name, description, price, imageUrl, stock).
        // 3. Save product using productRepository.save(product).
        // 4. Return saved product.
        return null;
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        // TODO:
        // 1. Find existing product by ID.
        // 2. Update its fields with values from ProductRequest.
        // 3. Save updated product using productRepository.save(product).
        // 4. Return updated product.
        return null;
    }

    public void deleteProduct(Long id) {
        // TODO:
        // 1. Check if product exists by ID.
        // 2. Delete product using productRepository.deleteById(id).
    }

    public ProductResponse mapToProductResponse(Product product) {
        if (product == null) return null;
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock()
        );
    }
}
