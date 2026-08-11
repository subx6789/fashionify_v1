package com.fashionify.controller;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.service.ProductService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" }, allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products
    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get single product by ID
    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Add product
    @PostMapping
    public ProductResponse addProduct(@RequestBody ProductRequest request, HttpSession session) {
        return productService.addProduct(request);
    }

    // Update product
    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @RequestBody ProductRequest request,
            HttpSession session) {
        return productService.updateProduct(id, request);
    }

    // Delete product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id, HttpSession session) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}
