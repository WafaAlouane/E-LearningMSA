package com.example.feedbackserrvice.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@Builder
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long courseId;
    private Long studentId;
    private Long teacherId;

    private int rating;
    @Column(name = "comment", length = 10000)  // or use TEXT for larger comments
    private String comment;

    private LocalDateTime createdAt;

    protected Feedback() {
    }

    // Constructeur avec paramètres
    public Feedback(Long courseId, Long studentId, Long teacherId, int rating, String comment) {
        this.courseId = courseId;
        this.studentId = studentId;
        this.teacherId = teacherId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

