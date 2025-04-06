package com.example.feedbackserrvice.Service;


import com.example.feedbackserrvice.Entity.Feedback;
import com.example.feedbackserrvice.Repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbacksByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId);
    }

    public List<Feedback> getFeedbacksByTeacherId(Long teacherId) {
        return feedbackRepository.findByTeacherId(teacherId);
    }

    public List<Feedback> getFeedbacksByStudentId(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {
        return feedbackRepository.findById(id).map(existing -> {
            existing.setCourseId(updatedFeedback.getCourseId());
            existing.setStudentId(updatedFeedback.getStudentId());
            existing.setTeacherId(updatedFeedback.getTeacherId());
            existing.setRating(updatedFeedback.getRating());
            existing.setComment(updatedFeedback.getComment());
            return feedbackRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteFeedback(Long id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
            return true;
        }
        return false;
    }

}

