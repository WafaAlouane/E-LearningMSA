package org.course.microservice_course_aziz.services;

import org.course.microservice_course_aziz.entity.Course;

import java.util.List;
import java.util.Optional;

public interface ICourseService {
    List<Course> getAllCourses();
    Course createCourse(Course course);
    Course updateCourse(Long id, Course courseDetails);

    void deleteCourse(Long id);
    Optional<Course> getCourseById(Long id);

    List<Course> searchCourses(String description, Integer duration, String instructor, String title, Double price);
}
