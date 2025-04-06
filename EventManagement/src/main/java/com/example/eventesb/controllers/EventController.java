package com.example.eventesb.controllers;


import com.example.eventesb.entities.Event;
import com.example.eventesb.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/showbyid/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return (event != null) ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    @PostMapping("/addevent")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event savedEvent = eventService.addEvent(event);
        return ResponseEntity.ok(savedEvent);
    }

    @PutMapping("/updateevent/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return (updatedEvent != null) ? ResponseEntity.ok(updatedEvent) : ResponseEntity.notFound().build();
    }


    @DeleteMapping("/deleteevent/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        String result = eventService.deleteEvent(id);
        return result.equals("Événement supprimé") ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

}
