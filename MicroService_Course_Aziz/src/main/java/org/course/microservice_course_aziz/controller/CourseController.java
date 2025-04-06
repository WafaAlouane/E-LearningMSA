package org.course.microservice_course_aziz.controller;
import org.course.microservice_course_aziz.entity.Course;
import org.course.microservice_course_aziz.services.CourseraCourseService;
import org.course.microservice_course_aziz.services.ICourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

//    private CourseraCourseService courseraCourseService;  // Autowire the service

    private final CourseraCourseService courseraCourseService;

    // ✅ Use Constructor Injection instead of field injection
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


    // ✅ Get all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // ✅ Get a single course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.createCourse(course));
    }

    // ✅ Update an existing course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete a course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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
