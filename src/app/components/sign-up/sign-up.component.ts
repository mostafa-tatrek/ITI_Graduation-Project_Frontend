import { Component, OnInit, ValueSansProvider } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { IuserEmail } from '../../models/iuser-email';
import { AuthService } from '../../services/auth.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  user: IuserEmail = {} as IuserEmail;
  exist = false;
  Signed = false;
  constructor(
    private _router: Router,
    private _userEmail: EmailService,
    private _auth: AuthService,
    private _viewPortScroller: ViewportScroller
  ) {}
  ngOnInit() {
    this._viewPortScroller.scrollToPosition([0, 0]);
  }
  SignUpForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    SignUpComponent.passwordsMatchValidator
  );

  static passwordsMatchValidator(
    form: AbstractControl
  ): { [key: string]: any } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  SignUp() {
    this.Signed = true;
    this.user.email = this.SignUpForm.get('email')?.value ?? '';
    this.user.userName = this.SignUpForm.get('username')?.value ?? '';
    this.user.password = this.SignUpForm.get('password')?.value ?? '';
    const credentials = {
      userName: this.user.userName,
      password: this.user.password,
      email: this.user.email,
    };

    this._auth.register(credentials).subscribe({
      next: (res) => {
        if (res == 'User created successfully') {
          this._router.navigateByUrl(`Login`);
        } else {
        }
      },
      error: (err) => {
        this.Signed = false;
        this.exist = true;
        this.SignUpForm.reset();
      },
    });
  }
}
