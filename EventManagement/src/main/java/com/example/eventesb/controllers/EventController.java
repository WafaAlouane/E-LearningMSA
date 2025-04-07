package com.example.eventesb.controllers;

import com.example.eventesb.entities.Event;
import com.example.eventesb.services.EventService;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/events")
public class EventController {

    private static final Logger logger = Logger.getLogger(EventController.class.getName());

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

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportEventsToCSV() {
        logger.info("Exporting events to CSV...");
        List<Event> events = eventService.getAllEvents();

        if (events.isEmpty()) {
            logger.warning("No events found to export.");
            return ResponseEntity.noContent().build(); // Retourne 204 si aucune donnée
        }

        StringWriter stringWriter = new StringWriter();
        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {
            // En-tête du CSV
            String[] header = {"ID", "Name", "Description", "DateTime", "Location"};
            csvWriter.writeNext(header);

            // Formatteur pour la date
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            // Ajouter chaque événement dans le CSV
            for (Event event : events) {
                String[] row = {
                        String.valueOf(event.getId()),
                        event.getName(),
                        event.getDescription(),
                        event.getDateTime() != null ? event.getDateTime().format(formatter) : "N/A",
                        event.getLocation()
                };
                csvWriter.writeNext(row);
            }

            // Convertir le contenu en bytes avec encodage UTF-8 pour éviter les problèmes de caractères
            byte[] csvBytes = stringWriter.toString().getBytes("UTF-8");

            // Configurer les en-têtes HTTP pour le téléchargement
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "events.csv");
            headers.setContentLength(csvBytes.length);

            logger.info("CSV file generated successfully.");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvBytes);
        } catch (Exception e) {
            logger.severe("Error while generating CSV: " + e.getMessage());
            return ResponseEntity.status(500).body(null); // Erreur serveur en cas de problème
        }
    }
}