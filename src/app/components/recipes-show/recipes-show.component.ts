import { Component, OnInit } from '@angular/core';
import { TopRatedService } from '../../services/top-rated.service';
import { IRecipeDetails } from '../../models/irecipe-details';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APICategoriesService } from '../../services/api-categories.service';
import { APIRecipeService } from '../../services/apirecipe.service';
import { forkJoin } from 'rxjs';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-recipes-show',
  standalone: false,
  templateUrl: './recipes-show.component.html',
  styleUrl: './recipes-show.component.css',
})
export class RecipesShowComponent implements OnInit {
  selectedOptions: any[] = [];
  topRated: IRecipeDetails[] = [] as IRecipeDetails[];
  selectedCategory: number = 0;
  emptyCategory: boolean = false;
  constructor(
    private _TopRatedService: TopRatedService,
    private _router: Router,
    private _apiCategories: APICategoriesService,
    private _apiRecipes: APIRecipeService,
    private _activatedRoute: ActivatedRoute,
    private _viewPortScroll: ViewportScroller
  ) {}

  ngOnInit() {
    this._viewPortScroll.scrollToPosition([0, 0]);
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      const idparam = paramMap.get('id');

      if (idparam === 'all') {
        this.loadAllRecipes();
      } else if (isFinite(Number(idparam))) {
        this._apiRecipes
          .GetRecipeByCat(Number(idparam))
          .subscribe((recipes) => {
            if (recipes.length == 0) {
              this.emptyCategory = true;
            }
            this.topRated = recipes;
          });
      }
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
  getRecipe(receipeId: number) {
    this._router.navigateByUrl(`oneRecipeShow/${receipeId}`);
  }
  loadAllRecipes() {
    this._apiRecipes.GetAllRecipes().subscribe({
      next: (response) => {
        this.topRated = response;
      },
      error: (err) => {},
    });
  }
  onCategorySelected(categoryId: number) {
    if (categoryId === 0) {
      this.loadAllRecipes();
    } else {
      this._apiRecipes.GetRecipeByCat(categoryId).subscribe((recipes) => {
        if (recipes.length != 0) {
          this.topRated = recipes;
          this.emptyCategory = false;
        } else {
          this.emptyCategory = true;
        }
      });
    }
  }
  get selectedCategoryName(): string {
    if (!this.selectedCategory) return 'All';
    const selected = this.selectedOptions.find(
      (opt) => opt.id === this.selectedCategory
    );
    return selected ? selected.displayName : 'All';
  }
}
