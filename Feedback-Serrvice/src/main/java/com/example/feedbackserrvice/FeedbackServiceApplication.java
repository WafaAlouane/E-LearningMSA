package com.example.feedbackserrvice;

import com.example.feedbackserrvice.Entity.Feedback;
import com.example.feedbackserrvice.Repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@EnableDiscoveryClient
@SpringBootApplication
public class FeedbackServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeedbackServiceApplication.class, args);
    }
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Bean
    ApplicationRunner init() {
        return args -> {
            feedbackRepository.save(new Feedback(1L, 101L, 201L, 5, "Excellent cours!"));
            feedbackRepository.save(new Feedback(2L, 102L, 202L, 4, "Très bon contenu."));
            feedbackRepository.save(new Feedback(3L, 103L, 203L, 3, "Contenu moyen."));


        };
    }
}
