package com.example.feedbackserrvice.Service;

import com.example.feedbackserrvice.Entity.Feedback;
import com.example.feedbackserrvice.Repository.FeedbackRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Save feedback
    public Feedback saveFeedback(Feedback feedback) {
        try {
            logger.info("Saving feedback for course ID: {}, student ID: {}", feedback.getCourseId(), feedback.getStudentId());

            // Save the feedback
            Feedback savedFeedback = feedbackRepository.save(feedback);
            logger.info("Feedback saved with ID: {}", savedFeedback.getId());

            // Send an email notification
            String subject = "New Feedback Submitted";
            String text = "A new feedback has been submitted:\n\n" +
                    "Rating: " + feedback.getRating() + "\n" +
                    "Comment: " + feedback.getComment();

            // Sending email to the teacher (hardcoded email)
            logger.info("Email sent to teacher: firaslabidi17@gmail.com");

            return savedFeedback;
        } catch (Exception e) {
            logger.error("Error saving feedback or sending email", e);
            throw new RuntimeException("Error saving feedback or sending email", e);  // Re-throwing to be handled by controller
        }
    }

    // Generate QR code for feedback
    public byte[] generateQRCode(Long feedbackId, int width, int height) throws Exception {
        Feedback feedback = getFeedbackById(feedbackId);
        if (feedback == null) {
            throw new IllegalArgumentException("Feedback not found with ID: " + feedbackId);
        }

        // Create a string with feedback details
        String feedbackDetails = String.format(
                "Feedback ID: %d\nCourse ID: %d\nStudent ID: %d\nTeacher ID: %d\nRating: %d\nComment: %s",
                feedback.getId(),
                feedback.getCourseId(),
                feedback.getStudentId(),
                feedback.getTeacherId(),
                feedback.getRating(),
                feedback.getComment()
        );

        // Generate the QR code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(feedbackDetails, BarcodeFormat.QR_CODE, width, height);

        // Convert the QR code to PNG byte array
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
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
