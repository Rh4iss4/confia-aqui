package br.com.userservice.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.commonlib.dto.AlterarSenhaDTO;
import br.com.commonlib.dto.AuthResponseDTO;
import br.com.commonlib.dto.ConfirmarSenhaDTO;
import br.com.commonlib.dto.EmailDTO;
import br.com.commonlib.dto.UsuarioDTO;
import br.com.userservice.entity.Usuario;
import br.com.userservice.repository.UsuarioRepository;
import br.com.userservice.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UsuarioRestController {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private br.com.commonlib.config.JwtUtils jwtUtils;

	@GetMapping("/usuarioLogado")
	public ResponseEntity<?> usuarioLogado() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuário não autenticado"));
		}
	org.springframework.security.core.userdetails.UserDetails ud = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
		Usuario u = usuarioRepository.findByEmail(ud.getUsername());
		if (u == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Usuário não encontrado"));
		List<String> roles = ud.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toList());
		return ResponseEntity.ok(new AuthResponseDTO(u.getId(), u.getEmail(), u.getNome(), roles));
	}

	@PatchMapping("/alterarEmail")
	public ResponseEntity<?> alterarEmail(@Valid @RequestBody EmailDTO dto, HttpServletRequest request) {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", "Usuário não autenticado"));
    	}
    
	org.springframework.security.core.userdetails.UserDetails ud = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
		Usuario toUpdate = new Usuario();
		 toUpdate.setEmail(dto.getEmail());

		try {
			Usuario updated = usuarioService.atualizarPerfil(ud.getUsername(), toUpdate);
			// Reemitir token com novo email
			List<String> roles = ud.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toList());
			String token = jwtUtils.generateToken(updated.getId(), updated.getEmail());
			AuthResponseDTO resp = new AuthResponseDTO(updated.getId(), updated.getEmail(), updated.getNome(), roles, token);
			return ResponseEntity.ok(resp);
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
							 .body(Map.of("message", "Email já cadastrado, tente outro email."));
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							 .body(Map.of("message", "Erro inesperado ao atualizar perfil"));
	   }
	}


	@PatchMapping("/alterarSenha")
	public ResponseEntity<?> alterarSenha(@Valid @RequestBody AlterarSenhaDTO dto, HttpServletRequest request) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuário não autenticado"));
		}
	org.springframework.security.core.userdetails.UserDetails ud = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
	String current = dto.getSenhaAtual();
	String nova = dto.getNovaSenha();
	String confirm = dto.getConfirmarSenha();
		try {
			Usuario updated = usuarioService.alterarSenha(ud.getUsername(), current, nova, confirm);
			// Reemitir novo token
			String token = jwtUtils.generateToken(updated.getId(), updated.getEmail());
			return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso", "token", token));
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
		}
	}

	@DeleteMapping ("/deletaUsuario")
	public ResponseEntity<?> deletaUsuario(@Valid @RequestBody ConfirmarSenhaDTO dto, HttpServletRequest request) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", "Usuário não autenticado"));
    }
	org.springframework.security.core.userdetails.UserDetails ud = (org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal();
	try {
		usuarioService.deletarPorEmailComSenha(ud.getUsername(), dto.getSenha());
		HttpSession session = request.getSession(false);
		if (session != null) session.invalidate();
		SecurityContextHolder.clearContext();
		return ResponseEntity.ok(Map.of("message", "Usuário deletado com sucesso"));
	} catch (IllegalArgumentException ex) {
		if (ex.getMessage() != null && ex.getMessage().contains("Senha")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Senha incorreta"));
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
	} catch (Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							 .body(Map.of("message", "Erro ao deletar usuário: " + ex.getMessage()));
	}
}

		@PostMapping("/cadastrar")
	public ResponseEntity<?> cadastrar(@Valid @RequestBody UsuarioDTO dto) {
		try {
			Usuario usuario = new Usuario();
			usuario.setEmail(dto.getEmail());
			usuario.setNome(dto.getNome());
			usuario.setSenha(dto.getSenha());
			if (dto.getRole() != null && !dto.getRole().isBlank()) {
				usuario.setRole(dto.getRole());
			}
			usuarioService.salvar(usuario);
			dto.setId(usuario.getId());
			dto.setRole(usuario.getRole()); 
			return ResponseEntity.status(HttpStatus.CREATED).body(dto);
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Erro ao cadastrar usuário: " + ex.getMessage()));
		}
	}

@GetMapping("/email/{email}")
public ResponseEntity<?> buscarPorEmail(@PathVariable String email) {
    try {
        Usuario u = usuarioService.buscarPorEmail(email);
        if (u == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));

        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setNome(u.getNome());
        dto.setSenha(u.getSenha()); 
        dto.setRole(u.getRole()); 

        return ResponseEntity.ok(dto);
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro ao buscar usuário: " + ex.getMessage()));
    }
}

	@PostMapping("/redefinirSenha")
	public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, Object> body) {
		try {
			Object idObj = body.get("usuarioId");
			Object novaSenhaObj = body.get("novaSenha");
			if (idObj == null || novaSenhaObj == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "usuarioId e novaSenha são obrigatórios"));
			}
			Long usuarioId;
			if (idObj instanceof Number n) {
				usuarioId = n.longValue();
			} else {
				usuarioId = Long.valueOf((String) idObj);
			}
			String novaSenha = novaSenhaObj.toString();
			usuarioService.alterarSenhaPorId(java.util.Objects.requireNonNull(usuarioId), novaSenha);
			return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso"));
		} catch (NumberFormatException | ClassCastException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "usuarioId inválido"));
		} catch (IllegalArgumentException ex) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
		} catch (RuntimeException ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Erro ao redefinir senha: " + ex.getMessage()));
		}
	}
}
