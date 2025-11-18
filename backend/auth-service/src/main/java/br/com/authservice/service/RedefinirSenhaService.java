package br.com.authservice.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.authservice.entity.RedefinirSenha;
import br.com.authservice.repository.RedefinirSenhaRepository;
import br.com.commonlib.dto.UsuarioDTO;


@Service
public class RedefinirSenhaService {

    private static final Logger logger = LoggerFactory.getLogger(RedefinirSenhaService.class);

    @Autowired
    private RedefinirSenhaRepository redefinirSenhaRepository;

    @Autowired
    private UserClientService userClientService;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final int EXPIRATION_MINUTES = 60;

    public void gerarToken(String email, String baseUrl) {
        UsuarioDTO usuario = userClientService.buscarPorEmail(email);
        if (usuario == null) throw new IllegalArgumentException("Email não cadastrado");

        RedefinirSenha tokenEntity = new RedefinirSenha();
        tokenEntity.setUsuarioId(usuario.getId());
        tokenEntity.setToken(UUID.randomUUID().toString());
        tokenEntity.setExpiryDate(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        redefinirSenhaRepository.save(tokenEntity);

        String link = frontendUrl + "/redefinir-senha?token=" + tokenEntity.getToken();
        emailService.sendPasswordReset(usuario.getEmail(), link);
    }

    public void redefinirSenha(String token, String novaSenha) {
        RedefinirSenha entity = redefinirSenhaRepository.findByToken(token);
        if (entity == null) throw new IllegalArgumentException("Token inválido");
        if (entity.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }

        // delega a senha para user-service via client
        Long usuarioId = entity.getUsuarioId();
        try {
            userClientService.redefinirSenhaById(usuarioId, novaSenha);
        } catch (Exception ex) {
            logger.error("Erro ao chamar user-service para redefinir senha do usuarioId={}: {}", usuarioId, ex.getMessage(), ex);
            throw ex;
        }

        redefinirSenhaRepository.delete(entity);
    }
}
