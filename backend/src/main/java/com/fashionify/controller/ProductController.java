package com.fashionify.controller;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.service.ProductService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
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

    // Public: Anyone can view all products
    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // Public: Anyone can view a product by ID
    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Admin Only: Add new product
    @PostMapping
    public ProductResponse addProduct(@Valid @RequestBody ProductRequest request, HttpSession session) {
        verifyAdmin(session);
        return productService.addProduct(request);
    }

    // Admin Only: Update product
    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request,
            HttpSession session) {
        verifyAdmin(session);
        return productService.updateProduct(id, request);
    }

    // Admin Only: Delete product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id, HttpSession session) {
        verifyAdmin(session);
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }

    // Helper method to verify Admin role from session
    private void verifyAdmin(HttpSession session) {
        if (session == null) {
            throw new RuntimeException("Unauthorized: Admin access required.");
        }
        Long userId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        if (userId == null || role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Unauthorized: Admin access required.");
        }
    }
}
