package br.com.confia_aqui.exception;

public class QuizNotFoundException extends RuntimeException {
    public QuizNotFoundException(Integer id) {
        super("Quiz não encontrado com ID: " + id);
    }
}