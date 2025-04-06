package com.example.eventesb;

import com.example.eventesb.entities.Event;
import com.example.eventesb.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@EnableDiscoveryClient
@SpringBootApplication
public class EventManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventManagementApplication.class, args);
    }
    @Autowired
    private EventRepository eventRepository;

    @Bean
    ApplicationRunner init() {
        return args -> {
            eventRepository.save(new Event( "Concert de Jazz", "Un concert incroyable", LocalDateTime.parse("2025-06-15T20:00:00"), "Paris"));
            eventRepository.save(new Event("Conférence IA", "Discussion sur l'intelligence artificielle", LocalDateTime.parse("2025-07-10T14:00:00"), "Londres"));
            eventRepository.save(new Event( "Hackathon", "Compétition de codage", LocalDateTime.parse("2025-08-20T09:00:00"), "Berlin"));

            // Afficher les événements en console
            eventRepository.findAll().forEach(System.out::println);
        };
    }
}
