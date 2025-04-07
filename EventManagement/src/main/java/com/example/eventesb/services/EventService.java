package com.example.eventesb.services;


import com.example.eventesb.entities.Event;
import com.example.eventesb.repositories.EventRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;


    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event newEvent) {
        Optional<Event> existingEventOptional = eventRepository.findById(id);
        if (existingEventOptional.isPresent()) {
            Event existingEvent = existingEventOptional.get();
            existingEvent.setName(newEvent.getName());
            existingEvent.setDescription(newEvent.getDescription());
            existingEvent.setDateTime(newEvent.getDateTime());
            existingEvent.setLocation(newEvent.getLocation());

            return eventRepository.save(existingEvent);
        } else {
            return null;
        }
    }

    public String deleteEvent(Long id) {
        if (eventRepository.findById(id).isPresent()) {
            eventRepository.deleteById(id);
            return "Événement supprimé";
        } else {
            return "Événement non trouvé";
        }
    }
    public List<Event> filterEvents(String name, String location, LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsByCriteria(name, location, startDate, endDate);
    }


}
