import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { concatWith } from 'rxjs';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-log-in',
  standalone: false,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',
})
export class LogInComponent implements OnInit {
  islogged = false;
  notfound = false;
  email = '';
  userName = '';
  role = '';
  userId: string | null = null;
  image: string = '';
  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _activatedRouter: ActivatedRoute,
    private _location: Location,
    private _viewPort: ViewportScroller
  ) {}
  ngOnInit() {
    this.notfound = false;
    this._viewPort.scrollToPosition([0, 0]);
  }
  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  clicked() {
    this.islogged = true;
    const credentials = {
      userName: this.LoginForm.controls.email.value,
      password: this.LoginForm.controls.password.value,
    };

    this._auth.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this._auth.setLoggedIn(true);
        const decoded = this._auth.decodeToken(res.token);
        this._auth.token = res.token;
        this.userId = decoded.userId;
        this.userName = decoded.name;
        this.role = '';

        this._auth.setLoggedIn(true);

        if (decoded.roles) {
          this.role = decoded.roles[0];
        }
        if (this.userId) {
          localStorage.setItem('userId', this.userId ?? '');
          this._auth.getUserData(Number(this.userId)).subscribe({
            next: (res) => {
              localStorage.setItem('role', this.role);
              this.email = res.email;
              this.image = res.profileImageUrl;
              this._auth.loggedUser = {
                userName: this.userName,
                email: this.email,
                userImage: this.image,
                password: this.LoginForm.controls.password.value || '',
              };
              this._auth.loggedUserId = Number(this.userId);

              if (this.role == 'MANAGER') {
                localStorage.setItem('admin', this.userId ?? '');
                this._router.navigateByUrl(`Admin/${this.userId}`);
              } else {
                this._location.back();
              }
            },
          });
        }
      },
      error: (err) => {
        this.islogged = false;
        this.notfound = true;
        this.LoginForm.reset();
      },
    });
  }
}
