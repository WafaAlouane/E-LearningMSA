package com.example.userbackend.Controller;

import com.example.userbackend.Entity.Role;
import com.example.userbackend.Entity.User;
import com.example.userbackend.Enum.ERole;
import com.example.userbackend.Payload.*;
import com.example.userbackend.Repository.RoleRepository;
import com.example.userbackend.Repository.UserRepository;
import com.example.userbackend.Security.JwtUtils;
import com.example.userbackend.Service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }


        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),signUpRequest.getSpecialty());

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        System.out.println("userfromFront"+user);
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "PARTNER":
                        Role adminRole = roleRepository.findByName(ERole.PARTNER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "TUTOR":
                        Role modRole = roleRepository.findByName(ERole.TUTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String cleanedEmail = request.getEmail().trim();

        if (!EmailValidator.isValid(cleanedEmail)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Adresse email invalide"));
        }

        // Vérifier si l'email existe dans la base de données
        if (!userRepository.existsByEmail(cleanedEmail)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Aucun utilisateur trouvé avec cette adresse email."));
        }

        // Générer un code de vérification
        String verificationCode = VerificationCodeGenerator.generateCode();
        System.out.println("Verification Code: " + verificationCode); // Log the verification code

        // Envoyer le code de vérification par e-mail
        emailService.sendVerificationCode(cleanedEmail, verificationCode);

        // Stocker le code dans VerificationCodeStorage
        VerificationCodeStorage.storeCode(cleanedEmail, verificationCode);

        // Renvoyer le code de vérification dans la réponse
        return ResponseEntity.ok(new VerificationCodeResponse(
                "Un code de vérification a été envoyé à votre adresse email.",
                verificationCode // Inclure le code dans la réponse
        ));
    }
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {

        String cleanedEmail = request.getEmail().trim();
        String userCode = request.getCode().trim();


        String storedCode = VerificationCodeStorage.getCode(cleanedEmail);


        if (storedCode == null || !storedCode.equals(userCode)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Code de vérification invalide"));
        }


        VerificationCodeStorage.removeCode(cleanedEmail);

        return ResponseEntity.ok(new MessageResponse("Code de vérification valide"));
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Nettoyer les entrées
        String cleanedEmail = request.getEmail().trim();
        String newPassword = request.getNewPassword().trim();
        String confirmPassword = request.getConfirmPassword().trim();

        // Valider les entrées
        if (!EmailValidator.isValid(cleanedEmail)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Adresse email invalide."));
        }

        if (newPassword.isEmpty() || confirmPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Le mot de passe ne peut pas être vide."));
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Les mots de passe ne correspondent pas."));
        }

        // Vérifier si l'utilisateur existe
        User user = userRepository.findByEmail(cleanedEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé."));

        // Mettre à jour le mot de passe
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        // Retourner une réponse de succès
        return ResponseEntity.ok(new MessageResponse("Mot de passe réinitialisé avec succès."));
    }}
