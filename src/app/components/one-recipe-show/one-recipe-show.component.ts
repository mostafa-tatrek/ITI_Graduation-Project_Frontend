import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRecipeDetails } from '../../models/irecipe-details';
import { TopRatedService } from '../../services/top-rated.service';
import { APIRecipeService } from '../../services/apirecipe.service';
import { AuthService } from '../../services/auth.service';
import { ViewportScroller } from '@angular/common';
import { Favrecipes } from '../../models/favrecipes';
@Component({
  selector: 'app-one-recipe-show',
  standalone: false,
  templateUrl: './one-recipe-show.component.html',
  styleUrl: './one-recipe-show.component.css',
})
export class OneRecipeShowComponent implements OnInit {
  isFilled = false; // By default, the heart is hollow
  isSaved = false;
  recipe: IRecipeDetails = {} as IRecipeDetails;
  fav: Favrecipes[] = [] as Favrecipes[];
  recipeID!: number;
  clicked: boolean = false;
  UserId!: number;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _topRatedServices: APIRecipeService,
    private _auth: AuthService,
    private _router: Router,
    private _viewPortScoller: ViewportScroller,
    private _apirecipes: APIRecipeService
  ) {}
  ngOnInit() {
    this.UserId = Number(localStorage.getItem('userId'));
    this._viewPortScoller.scrollToPosition([0, 0]);
    this.recipeID = parseInt(
      this._ActivatedRoute.snapshot.paramMap.get('recipeID') ?? '0'
    );
    this._topRatedServices.GetRecipeById(this.recipeID).subscribe({
      next: (response) => {
        this.recipe = response;
      },
    });
    if (this.UserId) {
      this._apirecipes.GetFavritRecipes(this.UserId!).subscribe({
        next: (res) => {
          this.fav = res;
          this.fav.forEach((element) => {
            if (element.recipeID == this.recipeID) {
              this.isSaved = true;
            }
          });
        },
        error: (err) => {},
      });
    }
  }

  toggleBookmark() {
    this.isSaved = !this.isSaved;

    if (this.UserId && this.isSaved == true) {
      this._topRatedServices
        .AddFavorite({
          recipeID: this.recipe.recipeID,
          userID: this.UserId,
        })
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.log(err),
        });
    } else if (this.UserId && this.isSaved == false) {
      this._topRatedServices
        .deleteFavorite({
          recipeID: this.recipe.recipeID,
          userID: this.UserId,
        })
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.log(err),
        });
    } else {
      this._router.navigateByUrl('Login');
    }
  }
}
