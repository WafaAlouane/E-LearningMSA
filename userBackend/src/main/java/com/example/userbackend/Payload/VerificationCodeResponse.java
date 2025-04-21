package com.example.userbackend.Payload;

public class VerificationCodeResponse {
    private String message;
    private String verificationCode;

    public VerificationCodeResponse(String message, String verificationCode) {
        this.message = message;
        this.verificationCode = verificationCode;
    }

    // Getters et setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}