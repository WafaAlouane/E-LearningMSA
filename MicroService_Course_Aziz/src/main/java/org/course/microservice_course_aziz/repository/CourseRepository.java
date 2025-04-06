package org.course.microservice_course_aziz.repository;

import org.course.microservice_course_aziz.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDescriptionContainingIgnoreCase(String description);
    List<Course> findByDuration(Integer duration);
    List<Course> findByInstructorContainingIgnoreCase(String instructor);
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByPrice(Double price);
}
