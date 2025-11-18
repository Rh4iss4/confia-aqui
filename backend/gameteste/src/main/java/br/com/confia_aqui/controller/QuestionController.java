package br.com.confia_aqui.controller;

import br.com.confia_aqui.model.Question;
import br.com.confia_aqui.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("question")
@CrossOrigin(origins = "*") //mudar para url real se hospedado
public class QuestionController {

    @Autowired
    QuestionService questionService;

    //para teste e debug -> busca todas as perguntas
    @GetMapping("allQuestions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    //para teste e debug-> busca por categoria
    @GetMapping("category/{category}")
    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable String category) {

        if (category == null || category.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return questionService.getQuestionsByCategory(category.trim());
    }

     //novo endpoint para listar todas as categorias
    @GetMapping("categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return questionService.getAllCategories();
    }
}
