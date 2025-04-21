package org.course.microservice_course_aziz.controller;
import org.course.microservice_course_aziz.entity.Course;
import org.course.microservice_course_aziz.services.CourseraCourseService;
import org.course.microservice_course_aziz.services.EmailService;
import org.course.microservice_course_aziz.services.ICourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

//    private CourseraCourseService courseraCourseService;  // Autowire the service
@Autowired
private EmailService emailService;

    private final CourseraCourseService courseraCourseService;

    @Autowired
    public CourseController(CourseraCourseService courseraCourseService) {
        this.courseraCourseService = courseraCourseService;
    }


    @Autowired
    private ICourseService courseService;



    // Get online courses from Coursera
    @GetMapping("/coursera")
    public ResponseEntity<String> getCourseraCourses() {
        String courses = courseraCourseService.fetchCourseraCourses(); // Call the service method
        return ResponseEntity.ok(courses);  // Return the Coursera course data as response
    }


    //  Get all courses
    @GetMapping("/list")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // Get a single course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/joke")
    public ResponseEntity<String> getRandomJoke() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://official-joke-api.appspot.com/random_joke";
        String joke = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(joke);
    }

    @GetMapping("/quote")
    public ResponseEntity<String> getStudyQuote() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://zenquotes.io/api/random";
        String quote = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(quote);
    }

    @GetMapping("/activity")
    public ResponseEntity<String> getRandomActivity() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://www.boredapi.com/api/activity";
            String activity = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Bored API is currently unavailable. Please try again later.");
        }
    }


    //  Create a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseService.createCourse(course);

        // Send email after course is created
        String to = "aziz.zaibi.2ti@gmail.com";
        String subject = "New Course Created: " + savedCourse.getTitle();
        String body = "A new course has been created:\n\n"
                + "Title: " + savedCourse.getTitle() + "\n"
                + "Description: " + savedCourse.getDescription() + "\n"
                + "Instructor: " + savedCourse.getInstructor();

        emailService.sendEmail(to, subject, body);

        return ResponseEntity.ok(savedCourse);
    }


    // Update an existing course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/universities")
    public ResponseEntity<String> getUniversities(@RequestParam String name) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://universities.hipolabs.com/search?name=" + name;
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }


//    @GetMapping("/edx-courses")
//    public ResponseEntity<String> getEdxCourses() {
//        RestTemplate restTemplate = new RestTemplate();
//        String url = "https://api.edx.org/catalog/v1/courses/";
//        String response = restTemplate.getForObject(url, String.class);
//        return ResponseEntity.ok(response);
//    }



    @GetMapping("/courses-statistics")
    public ResponseEntity<Map<String, Object>> getCoursesStatistics() {
        List<Course> allCourses = courseService.getAllCourses();

        // Initialize statistics
        int totalCourses = allCourses.size();
        Map<String, Integer> instructorCount = new HashMap<>();
        double totalPrice = 0;
        double averagePrice = 0;
        int coursesWithPrice = 0;
        int totalDuration = 0;

        // Loop through all courses to gather statistics
        for (Course course : allCourses) {
            // Count how many courses belong to each instructor
            instructorCount.put(course.getInstructor(), instructorCount.getOrDefault(course.getInstructor(), 0) + 1);

            // Calculate total price and count of courses with price
            if (course.getPrice() != null) {
                totalPrice += course.getPrice();
                coursesWithPrice++;
            }

            // Calculate total duration
            totalDuration += course.getDuration();
        }

        // Calculate average price and average duration
        averagePrice = coursesWithPrice > 0 ? totalPrice / coursesWithPrice : 0;
        double averageDuration = totalCourses > 0 ? (double) totalDuration / totalCourses : 0;

        // Prepare the statistics map
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalCourses", totalCourses);
        statistics.put("instructorCount", instructorCount);
        statistics.put("averagePrice", averagePrice);
        statistics.put("averageDuration", averageDuration);
        statistics.put("coursesWithPrice", coursesWithPrice);

        // Prepare the response
        Map<String, Object> response = new HashMap<>();
        response.put("statistics", statistics);
        response.put("courses", allCourses);

        return ResponseEntity.ok(response);
    }






    @GetMapping("/search")
    public List<Course> searchCourses(
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) String instructor,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Double price) {

        return courseService.searchCourses(description, duration, instructor, title, price);
    }


}
