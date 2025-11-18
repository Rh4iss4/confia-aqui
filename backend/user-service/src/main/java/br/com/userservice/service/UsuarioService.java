package br.com.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.userservice.entity.Usuario;
import br.com.userservice.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder encoder;


public void salvar(Usuario usuario) {
    if (repository.findByEmail(usuario.getEmail()) != null) {
        throw new IllegalArgumentException("Email já cadastrado: " + usuario.getEmail());
    }

    usuario.setSenha(encoder.encode(usuario.getSenha()));
    if (usuario.getRole() == null || usuario.getRole().isBlank()) {
        usuario.setRole("ROLE_USER");
    }

    repository.save(usuario);
}

    public Usuario atualizarPerfil(String currentEmail, Usuario updated) {
        Usuario existing = repository.findByEmail(currentEmail);
        if (existing == null) throw new IllegalArgumentException("Usuário não encontrado: " + currentEmail);

        String newEmail = updated.getEmail();
        if (newEmail != null && !newEmail.isBlank() && !newEmail.equalsIgnoreCase(existing.getEmail())) {
            if (repository.findByEmail(newEmail) != null) {
                throw new IllegalArgumentException("Email já cadastrado: " + newEmail);
            }
            existing.setEmail(newEmail);
        }

        if (updated.getNome() != null && !updated.getNome().isBlank()) {
            existing.setNome(updated.getNome());
        }

        repository.save(existing);
        return existing;
    }

@Transactional
public Usuario alterarSenha(String email, String senhaAtual, String novaSenha, String confirmarSenha) {
    Usuario existing = repository.findByEmail(email);
    if (existing == null) {
        throw new IllegalArgumentException("Usuário não encontrado");
    }
    if (!encoder.matches(senhaAtual, existing.getSenha())) {
        throw new IllegalArgumentException("Senha atual incorreta");
    }
    if (!novaSenha.equals(confirmarSenha)) {
        throw new IllegalArgumentException("A confirmação de senha não confere");
    }
    if (novaSenha.length() < 6) {
        throw new IllegalArgumentException("A nova senha deve ter ao menos 6 caracteres");
    }
    existing.setSenha(encoder.encode(novaSenha));
    return repository.save(existing);
}

    @Transactional
    public void deletarPorEmailComSenha(String email, String senha) {
        Usuario existing = repository.findByEmail(email);
        if (existing == null) throw new IllegalArgumentException("Usuário não encontrado: " + email);

        if (!encoder.matches(senha, existing.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta");
        }

        repository.deleteByEmail(email);
    }

    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

    public Usuario buscarPorId(@NonNull Long id) {
        return repository.findById(id).orElse(null);
    }

    public void alterarSenhaPorId(@NonNull Long usuarioId, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter ao menos 6 caracteres");
        }
        java.util.Optional<Usuario> opt = repository.findById(usuarioId);
        if (opt.isEmpty()) throw new IllegalArgumentException("Usuário não encontrado: id=" + usuarioId);
        Usuario user = opt.get();
        user.setSenha(encoder.encode(newPassword));
        repository.save(user);
    }
}

