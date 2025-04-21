package com.example.feedbackserrvice.Controller;

import com.example.feedbackserrvice.Entity.Feedback;
import com.example.feedbackserrvice.Service.EmailService;
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
    private EmailService emailService;
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private GeminiService geminiService;

    // Get all feedbacks
    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    // Get feedback by ID
    @GetMapping("/showbyid/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Feedback feedback = feedbackService.getFeedbackById(id);
        return (feedback != null) ? ResponseEntity.ok(feedback) : ResponseEntity.notFound().build();
    }

    // Add new feedback and send an email
    @PostMapping("/addfeedback")
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        // Call Gemini service to reformulate the comment
        String professionalComment = geminiService.makeProfessional(feedback.getComment());
        feedback.setComment(professionalComment);

        // Save the feedback and trigger PDF generation
        Feedback savedFeedback = feedbackService.saveFeedback(feedback);

        // Send email notification after feedback is saved
        String subject = "New Feedback Submitted";
        String message = "A new feedback has been submitted:\n\n" +
                "Rating: " + savedFeedback.getRating() + "\n" +
                "Comment: " + savedFeedback.getComment();
        // Replace with the recipient email (e.g., teacher or admin email)
        String recipientEmail = "firaslabidi17@gmail.com";  // Change this to the appropriate recipient email
        emailService.sendVerificationCode(recipientEmail, message);

        return ResponseEntity.ok(savedFeedback);
    }

    // Update feedback by ID
    @PutMapping("/updatefeedback/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback feedbackDetails) {
        Feedback updatedFeedback = feedbackService.updateFeedback(id, feedbackDetails);
        return (updatedFeedback != null) ? ResponseEntity.ok(updatedFeedback) : ResponseEntity.notFound().build();
    }

    // Delete feedback by ID
    @DeleteMapping("/deletefeedback/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        boolean deleted = feedbackService.deleteFeedback(id);
        return deleted ? ResponseEntity.ok("Feedback supprimé") : ResponseEntity.notFound().build();
    }

    // Get feedbacks by course ID
    @GetMapping("/bycourse/{courseId}")
    public ResponseEntity<List<Feedback>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByCourseId(courseId));
    }

    // Get feedbacks by teacher ID
    @GetMapping("/byteacher/{teacherId}")
    public ResponseEntity<List<Feedback>> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByTeacherId(teacherId));
    }

    // Get feedbacks by student ID
    @GetMapping("/bystudent/{studentId}")
    public ResponseEntity<List<Feedback>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByStudentId(studentId));
    }
}