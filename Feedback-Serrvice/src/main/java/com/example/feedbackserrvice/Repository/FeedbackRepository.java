package com.example.feedbackserrvice.Repository;

import com.example.feedbackserrvice.Entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCourseId(Long courseId);
    List<Feedback> findByTeacherId(Long teacherId);
    List<Feedback> findByStudentId(Long studentId);
}

