import { Component, OnInit } from '@angular/core';
import { APIRecipeService } from '../../services/apirecipe.service';
import { APICategoriesService } from '../../services/api-categories.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  islogged = false;
  constructor(
    private _recipe: APIRecipeService,
    private _apiCategories: APICategoriesService,
    private router: Router,
    private _viewPortScroller: ViewportScroller,
    private _auth: AuthService
  ) {}
  ngOnInit() {
    this._viewPortScroller.scrollToPosition([0, 0]);
    this._auth.logged$.subscribe((val) => {
      this.islogged = val;
    });
  }

  Clicked(arg0: number) {
    this.router.navigateByUrl(`recipesShow/${arg0}`);
  }
}
