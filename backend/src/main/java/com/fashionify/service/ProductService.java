package com.fashionify.service;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    public List<ProductResponse> getAllProducts();
    public ProductResponse getProductById(Long id);
    public ProductResponse addProduct(ProductRequest request);
    public ProductResponse updateProduct(Long id, ProductRequest request);
    public void deleteProduct(Long id);
}
