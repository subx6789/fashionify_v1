package com.fashionify.mapper;

import com.fashionify.dto.response.ProductResponse;
import com.fashionify.entity.Product;

public class ProductMapper {

    // Converts Product entity to ProductResponse DTO
    public static ProductResponse toProductResponse(Product product) {
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
