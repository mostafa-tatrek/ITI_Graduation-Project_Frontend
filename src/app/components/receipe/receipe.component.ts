import { Component, OnInit } from '@angular/core';
import { TopRatedService } from '../../services/top-rated.service';
import { IRecipeDetails } from '../../models/irecipe-details';
import { ICategory } from '../../models/icategory';
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIRecipeService } from '../../services/apirecipe.service';
import { HttpClient } from '@angular/common/http';
import { APICategoriesService } from '../../services/api-categories.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-receipe',
  standalone: false,
  templateUrl: './receipe.component.html',
  styleUrl: './receipe.component.css',
})
export class ReceipeComponent implements OnInit {
  selectedCategory: any = null;
  selectedOptions: any[] = [];
  topRated: IRecipeDetails[] = [] as IRecipeDetails[];
  Popularcategories: ICategory[] = [] as ICategory[];

  constructor(
    private _apiRecipe: APIRecipeService,
    private _router: Router,
    private _apiCategories: APICategoriesService,
    private _viewPortScroller: ViewportScroller
  ) {}
  ngOnInit() {
    this._viewPortScroller.scrollToPosition([0, 0]);
    this.loadAllRecipes();

    this._apiCategories.GetAllCategoriesV2().subscribe({
      next: (res) => (this.Popularcategories = res),
    });
    this._apiCategories.GetAllCategories().subscribe((categories: any[]) => {
      this.selectedOptions = [
        { id: 0, displayName: 'All', description: '' },
        ...categories.map((category) => ({
          id: category.categoryID,
          displayName: category.name,
        })),
      ];
    });
  }

  onCategorySelected(categoryId: number) {
    if (categoryId === 0) {
      this.loadAllRecipes();
    } else {
      this._apiRecipe.GetRecipeByCat(categoryId).subscribe((recipes) => {
        this.topRated = recipes;
      });
    }
  }
  getRecipe(receipeId: number) {
    this._router.navigateByUrl(`oneRecipeShow/${receipeId}`);
  }
  getRecipesCat(catId: number) {
    this._router.navigateByUrl(`recipesShow/${catId}`);
  }
  getAllRecipes(recipes: string) {
    this._router.navigateByUrl(`recipesShow/${recipes}`);
  }

  loadAllRecipes() {
    this._apiRecipe.GetTopRatedRecipes().subscribe({
      next: (response) => {
        this.topRated = response;
      },
      error: (err) => {},
    });
  }
}
