package com.fashionify.controller;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        // TODO:
        // Call ProductService.getAllProducts().
        return null;
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        // TODO:
        // Call ProductService.getProductById(id).
        return null;
    }

    @PostMapping
    public ProductResponse addProduct(@RequestBody ProductRequest request, HttpSession session) {
        // TODO:
        // 1. Later verify that logged-in user has ADMIN role.
        // 2. Call ProductService.addProduct(request).
        // 3. Return created product.
        return null;
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @RequestBody ProductRequest request, HttpSession session) {
        // TODO:
        // 1. Later verify ADMIN role from session.
        // 2. Call ProductService.updateProduct(id, request).
        // 3. Return updated product.
        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id, HttpSession session) {
        // TODO:
        // 1. Later verify ADMIN role from session.
        // 2. Call ProductService.deleteProduct(id).
        // 3. Return appropriate response.
        return null;
    }
}
