package org.course.microservice_course_aziz.services;

import org.course.microservice_course_aziz.entity.Course;
import org.course.microservice_course_aziz.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements ICourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Override
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Override
        public Course updateCourse(Long id, Course courseDetails) {
            Optional<Course> optionalCourse = courseRepository.findById(id);
            if (optionalCourse.isPresent()) {
                Course course = optionalCourse.get();
                course.setTitle(courseDetails.getTitle());
                course.setDescription(courseDetails.getDescription());
                course.setInstructor(courseDetails.getInstructor());
                course.setPrice(courseDetails.getPrice());
                return courseRepository.save(course);
            } else {
                throw new RuntimeException("Course not found with ID: " + id);
            }
        }

    @Override
    public void deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Course not found with ID: " + id);
        }
    }



    public List<Course> searchCourses(String description, Integer duration, String instructor, String title, Double price) {
        // Get all courses from repository
        List<Course> courses = courseRepository.findAll();

        // Apply filters
        if (description != null) {
            courses = courses.stream().filter(course -> course.getDescription().toLowerCase().contains(description.toLowerCase())).collect(Collectors.toList());
        }
        if (duration != null) {
            courses = courses.stream().filter(course -> course.getDuration() == duration).collect(Collectors.toList());
        }
        if (instructor != null) {
            courses = courses.stream().filter(course -> course.getInstructor().toLowerCase().contains(instructor.toLowerCase())).collect(Collectors.toList());
        }
        if (title != null) {
            courses = courses.stream()
                    .filter(course -> course.getTitle().toLowerCase().contains(title.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (price != null) {
            courses = courses.stream()
                    .filter(course -> course.getPrice() <= price)  //
                    .collect(Collectors.toList());
        }

        return courses;
    }







}
