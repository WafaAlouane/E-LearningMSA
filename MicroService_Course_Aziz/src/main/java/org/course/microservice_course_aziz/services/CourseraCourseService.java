package org.course.microservice_course_aziz.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;

@Service
public class CourseraCourseService {

    private final String BASE_URL = "https://api.coursera.org/api/courses.v1";

    public String fetchCourseraCourses() {
        RestTemplate restTemplate = new RestTemplate();

        // Constructing URI with query parameter
        URI uri = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                .queryParam("limit", 10)
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Response Headers: " + response.getHeaders());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                return "Unexpected response from Coursera API.";
            }
        } catch (Exception e) {
            System.err.println("Error fetching Coursera courses: " + e.getMessage());
            return "Error fetching data: " + e.getMessage();
        }
    }
}
