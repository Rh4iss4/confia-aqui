package br.com.confia_aqui.exception;

public class InsufficientQuestionsException extends RuntimeException {
    public InsufficientQuestionsException(String category, int requested, int available) {
        super(String.format("Categoria '%s' tem apenas %d perguntas disponíveis, mas foram solicitadas %d",
                category, available, requested));
    }
}
