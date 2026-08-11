package com.fashionify.service;

import com.fashionify.dto.request.ProductRequest;
import com.fashionify.dto.response.ProductResponse;
import com.fashionify.entity.Product;
import com.fashionify.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    	 List<Product> products = productRepository.findAll();
         List<ProductResponse> responseList = new ArrayList<>();

         for (Product pro: products) {
             ProductResponse response = mapToProductResponse(pro);
             responseList.add(response);
         }

         return responseList;
     }
    
    public ProductResponse getProductById(Long id) {
        // TODO:
        // 1. Fetch product by ID using productRepository.findById(id).
        // 2. Return product if found, or handle not found case.
    	
            Optional<Product> optionalProduct = productRepository.findById(id);

            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                return mapToProductResponse(product);
            }

            return null;
        }
    	 

    public ProductResponse addProduct(ProductRequest request) {
        
    try {
    		
    	Product product = new Product();
    	 product.setName(request.getName());
         product.setDescription(request.getDescription());
         product.setPrice(request.getPrice());
         product.setImageUrl(request.getImageUrl());
         product.setStock(request.getStock());
         
         Product productsave = productRepository.save(product);
         
         ProductResponse response = new ProductResponse();

         response.setId(productsave.getId());
         response.setName(productsave.getName());
         response.setDescription(productsave.getDescription());
         response.setPrice(productsave.getPrice());
         response.setImageUrl(productsave.getImageUrl());
         response.setStock(productsave.getStock());

    	
        // 1. Create a new Product instance.
        // 2. Map fields from ProductRequest (name, description, price, imageUrl, stock).
        // 3. Save product using productRepository.save(product).
        // 4. Return saved product.
         
        return response;
    }
     catch (Exception e) {

        System.out.println("Error while adding product: " + e.getMessage());
        return null;
      
    }
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        // TODO:
        // 1. Find existing product by ID.
        // 2. Update its fields with values from ProductRequest.
        // 3. Save updated product using productRepository.save(product).
        // 4. Return updated product.
    	 try {

    	        Optional<Product> optionalProduct = productRepository.findById(id);

    	        if (optionalProduct.isPresent()) {

    	            Product product = optionalProduct.get();

    	            product.setName(request.getName());
    	            product.setDescription(request.getDescription());
    	            product.setPrice(request.getPrice());
    	            product.setImageUrl(request.getImageUrl());
    	            product.setStock(request.getStock());

    	            Product productsave = productRepository.save(product);

    	            return mapToProductResponse(productsave);
    	        }

    	        return null;


    	    } catch (Exception e) {

    	        System.out.println("Error while updating product: " + e.getMessage());

    	        return null;
    	    }
    }

    public void deleteProduct(Long id) {
        // TODO:
        // 1. Check if product exists by ID.
        // 2. Delete product using productRepository.deleteById(id).
    	try {

            Optional<Product> optionalProduct = productRepository.findById(id);

            if (optionalProduct.isPresent()) {

                productRepository.deleteById(id);
              

            } 

        } catch (Exception e) {

            System.out.println("Error while deleting product: " + e.getMessage());
        }
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
