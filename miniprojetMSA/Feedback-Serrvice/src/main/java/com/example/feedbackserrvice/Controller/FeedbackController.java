package com.example.feedbackserrvice.Controller;

import com.example.feedbackserrvice.Entity.Feedback;
import com.example.feedbackserrvice.Service.FeedbackService;
import com.example.feedbackserrvice.Service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@CrossOrigin
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/showbyid/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Feedback feedback = feedbackService.getFeedbackById(id);
        return (feedback != null) ? ResponseEntity.ok(feedback) : ResponseEntity.notFound().build();
    }

    @PostMapping("/addfeedback")
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        // Call Gemini to reformulate the comment
        String professionalComment = geminiService.makeProfessional(feedback.getComment());
        feedback.setComment(professionalComment);

        // Save the feedback after reformulation
        Feedback savedFeedback = feedbackService.saveFeedback(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    @PutMapping("/updatefeedback/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback feedbackDetails) {
        Feedback updatedFeedback = feedbackService.updateFeedback(id, feedbackDetails);
        return (updatedFeedback != null) ? ResponseEntity.ok(updatedFeedback) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deletefeedback/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        boolean deleted = feedbackService.deleteFeedback(id);
        return deleted ? ResponseEntity.ok("Feedback supprimé") : ResponseEntity.notFound().build();
    }

    @GetMapping("/bycourse/{courseId}")
    public ResponseEntity<List<Feedback>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByCourseId(courseId));
    }

    @GetMapping("/byteacher/{teacherId}")
    public ResponseEntity<List<Feedback>> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByTeacherId(teacherId));
    }

    @GetMapping("/bystudent/{studentId}")
    public ResponseEntity<List<Feedback>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByStudentId(studentId));
    }
}
