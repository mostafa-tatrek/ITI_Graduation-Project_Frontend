import { Component, OnInit } from '@angular/core';
import { IuserEmail } from '../../models/iuser-email';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { flush } from '@angular/core/testing';
import { Location } from '@angular/common';
import { IAuthor } from '../../models/iauthor';
import { IuserData } from '../../models/iuser-data';
import { AuthService } from '../../services/auth.service';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-profile-data-editing',
  standalone: false,
  templateUrl: './profile-data-editing.component.html',
  styleUrl: './profile-data-editing.component.css',
})
export class ProfileDataEditingComponent implements OnInit {
  editName: boolean = false;
  userid: number = 0;
  loading = false;
  editImage: boolean = false;
  role = localStorage.getItem('role');
  user: IuserData = {} as IuserData;
  constructor(
    private _activateRoute: ActivatedRoute,
    private _email: EmailService,
    private _location: Location,
    private _auth: AuthService,
    private _viewPortScroller: ViewportScroller
  ) {}
  ImageForm = new FormGroup({
    image: new FormControl<File | null>(null, [Validators.required]),
  });

  EditForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this._viewPortScroller.scrollToPosition([0, 0]);
    this.userid =
      Number(this._activateRoute.snapshot.paramMap.get('UserId')) ?? 0;
    this._auth.getUserData(this.userid).subscribe({
      next: (res) => {
        this.user = res;
        if (!this.user.profileImageUrl) {
          this.user.profileImageUrl =
            'assets/blank-profile-picture-973460_640.webp';
        }
      },
    });
  }

  Edit() {
    if (this.editName) {
      this.user.userName =
        this.EditForm.controls.username.value ?? this.user.userName;
      this.editName = false;
    }

    this.EditForm.reset();
  }
  SavingImage() {
    const file = this.ImageForm.controls.image.value;

    if (this.editImage && file instanceof File) {
      this.resizeAndConvertToBase64(file, 1000, 500, (base64: string) => {
        this.user.profileImageUrl = base64;
      });
    }

    this.editImage = false;
    this.ImageForm.reset();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.ImageForm.controls['image'].setValue(file);
    }
  }

  ClearImage() {
    this.user.profileImageUrl = 'assets/blank-profile-picture-973460_640.webp';
    this.editImage = false;
  }
  goBack() {
    this.loading = true;
    this._auth
      .UpdateUserProfile(this.userid, {
        userName: this.user.userName,
        profileImageUrl: this.user.profileImageUrl,
      })
      .subscribe({
        next: (res) => {
          this._location.back();
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }
  cancelUsername() {
    this.editName = false;
    this.EditForm.reset();
    this.user.userName = this.user.userName;
  }

  resizeAndConvertToBase64(
    file: File,
    maxWidth: number,
    maxHeight: number,
    callback: (base64: string) => void
  ): void {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      img.src = e.target!.result as string;
    };

    reader.readAsDataURL(file);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      const base64String = canvas.toDataURL('image/jpeg', 0.8);
      callback(base64String); // استخدم الـ callback هنا
    };
  }
}
