package br.com.confeitaria_spring.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private AdminInfo admin;

    @Data
    @AllArgsConstructor
    public static class AdminInfo {
        private Long id;
        private String nome;
        private String email;
        private Boolean ativo;
    }
}