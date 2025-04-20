import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router,RouterModule } from '@angular/router';
import { FormsModule, UntypedFormGroup, Validators, ReactiveFormsModule, UntypedFormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule,]
})
export class SignupComponent {
  signupForm!: UntypedFormGroup;
  submitted: boolean = false;
  spcialites: string[] = ['Math', 'Science', 'Programming'];

  constructor(private authService: AuthService, private router: Router, private fb: UntypedFormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
      role: ['STUDENT', Validators.required],
      spcialite: ['']
    }, { validators: this.passwordMatchValidator });

    // Gestion dynamique du champ "spcialite"
    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'TUTOR') {
        this.signupForm.get('spcialite')?.setValidators([Validators.required]);
      } else {
        this.signupForm.get('spcialite')?.clearValidators();
        this.signupForm.get('spcialite')?.setValue('');
      }
      this.signupForm.get('spcialite')?.updateValueAndValidity();
    });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmpassword = control.get('confirmpassword')?.value;

    if (password !== confirmpassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get form() {
    return this.signupForm.controls;
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Si le formulaire est invalide, afficher les erreurs
    if (this.signupForm.invalid) {
      if (this.signupForm.errors?.['passwordMismatch']) {
        alert('Passwords do not match. Please check your input.');
      }
      return;
    }

    // Préparer les données pour l'inscription
    const signupData = {
      username: this.signupForm.get('username')?.value,
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
      role: [this.signupForm.get('role')?.value],
      specialty: this.signupForm.get('spcialite')?.value
    };

    // Appeler le service d'inscription
    this.authService.signUp(signupData).subscribe({
      next: (response) => {
        console.log('User registered successfully!', response);
        alert('User registered successfully!');
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
      },
      error: (error) => {
        console.error('Error during registration', error);
        alert('Error during registration: ' + error.error.message);
      },
    });
  }
}