package com.fashionify.service;

import com.fashionify.dto.ProductRequest;
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

    public List<Product> getAllProducts() {
        // TODO:
        // 1. Fetch all products using productRepository.findAll().
        // 2. Return list of products.
        return null;
    }

    public Product getProductById(Long id) {
        // TODO:
        // 1. Fetch product by ID using productRepository.findById(id).
        // 2. Return product if found, or handle not found case.
        return null;
    }

    public Product addProduct(ProductRequest request) {
        // TODO:
        // 1. Create a new Product instance.
        // 2. Map fields from ProductRequest (name, description, price, imageUrl, stock).
        // 3. Save product using productRepository.save(product).
        // 4. Return saved product.
        return null;
    }

    public Product updateProduct(Long id, ProductRequest request) {
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
}
