import { login } from '@/app/store/authentication/authentication.actions'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
  type UntypedFormGroup,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent {
  signinForm!: UntypedFormGroup
  submitted: boolean = false
  passwordType: boolean = true

  public fb = inject(UntypedFormBuilder)
  store = inject(Store)

  constructor() {
    this.signinForm = this.fb.group({
      email: ['user@demo.com', [Validators.required]],
      password: ['123456', [Validators.required]],
    })
  }

  get form() {
    return this.signinForm.controls
  }

  onLogin() {
    this.submitted = true
    if (this.signinForm.valid) {
      const email = this.form['email'].value // Get the username from the form
      const password = this.form['password'].value // Get the password from the form

      console.log("test");
      
      // Login Api
      this.store.dispatch(login({ email: email, password: password }))
    }
  }

  changeType() {
    this.passwordType = !this.passwordType
  }
}
