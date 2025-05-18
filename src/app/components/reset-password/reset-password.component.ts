import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  falseemail = false;
  newPassword = '';
  message = '';
  error = '';
  resetted = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private _location: Location
  ) {}
  resetPasswordForm = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,

        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    ResetPasswordComponent.passwordsMatchValidator
  );
  static passwordsMatchValidator(
    form: AbstractControl
  ): { [key: string]: any } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {}

  resetPassword() {
    this.resetted = true;
    const data = {
      email: this.resetPasswordForm.controls.email.value,
      password: this.resetPasswordForm.controls.password.value,
    };
    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.message = ' Password reset successfully!';
        this.error = '';
        this._location.back();
      },
      error: (err) => {
        this.falseemail = true;
        this.resetted = false;
        this.resetPasswordForm.reset();
        this.message = '';
        this.error = ' Failed to reset password.';
      },
    });
  }
}
