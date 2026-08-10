package com.fashionify.dto;

import java.util.List;

public class OrderRequest {

    private String address;
    private String phone;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(String address, String phone, List<OrderItemRequest> items) {
        this.address = address;
        this.phone = phone;
        this.items = items;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
