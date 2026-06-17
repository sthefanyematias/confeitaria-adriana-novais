package br.com.confeitaria_spring.model.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String senha;
}
