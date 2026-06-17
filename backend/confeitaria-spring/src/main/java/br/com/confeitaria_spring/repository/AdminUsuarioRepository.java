package br.com.confeitaria_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.confeitaria_spring.model.entity.AdminUsuario;
import java.util.Optional;

@Repository
public interface AdminUsuarioRepository extends JpaRepository<AdminUsuario, Long> {

   @Query(
    value = "SELECT * FROM admin_usuario WHERE email = :email AND senha = MD5(:senha) AND ativo = true",
    nativeQuery = true
)
    Optional<AdminUsuario> findByEmailAndSenha(@Param("email") String email, @Param("senha") String senha);
}
