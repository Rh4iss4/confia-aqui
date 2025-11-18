package br.com.confia_aqui.dao;

import br.com.confia_aqui.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizDao extends JpaRepository<Quiz, Integer> {
}
