package br.com.confia_aqui.exception;

public class InvalidQuizDataException extends RuntimeException {
    public InvalidQuizDataException(String message) {
        super(message);
    }
}