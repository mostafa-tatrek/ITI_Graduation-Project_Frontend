import { Component } from '@angular/core';
import { IRecipeDetails } from '../../models/irecipe-details';
import { TopRatedService } from '../../services/top-rated.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IuserEmail } from '../../models/iuser-email';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';
import { IuserData } from '../../models/iuser-data';
import { Favrecipes } from '../../models/favrecipes';
import { APIRecipeService } from '../../services/apirecipe.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  noFav = false;
  UserId: number = 0;
  edit: boolean = false;
  fav: Favrecipes[] = [] as Favrecipes[];
  user: IuserData = {} as IuserData;
  constructor(
    private _TopRatedService: TopRatedService,
    private _router: Router,
    private _email: EmailService,
    private _activatedRouter: ActivatedRoute,
    private _auth: AuthService,
    private _apirecipes: APIRecipeService,
    private _viePort: ViewportScroller
  ) {}

  ngOnInit() {
    this._viePort.scrollToPosition([0, 0]);
    this.UserId =
      Number(this._activatedRouter.snapshot.paramMap.get('UserId')) ?? 0;
    this._auth.getUserData(this.UserId).subscribe({
      next: (res) => {
        this.user = res;
        if (!this.user.profileImageUrl) {
          this.user.profileImageUrl =
            'assets/blank-profile-picture-973460_640.webp';
        }
      },
    });
    if (this.UserId) {
      this._apirecipes.GetFavritRecipes(this.UserId!).subscribe({
        next: (res) => {
          this.fav = res;
          if (this.fav.length == 0) {
            this.noFav = true;
          }
        },
        error: (err) => {},
      });
    }
  }
  getRecipe(receipeId: number) {
    this._router.navigateByUrl(`oneRecipeShow/${receipeId}`);
  }
  EditData() {
    this._router.navigateByUrl(`EditProfile/${this.UserId}`);
  }
}
