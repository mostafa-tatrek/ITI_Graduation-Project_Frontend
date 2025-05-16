import { Component, OnInit, ViewChild } from '@angular/core';
import { IRecipeDetails } from '../../models/irecipe-details';
import { IuserEmail } from '../../models/iuser-email';
import { TopRatedService } from '../../services/top-rated.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIIngredientService } from '../../services/api-ingredient.service';
import { IIngredient } from '../../models/iingredient';
import { APICategoriesService } from '../../services/api-categories.service';
import { ICategory } from '../../models/icategory';
import { ICategoryToAdd } from '../../models/icategory-to-add';
import { RecipeCreated } from '../../models/recipe-created';
import { IAuthor } from '../../models/iauthor';
import { IRecipeIngredieent } from '../../models/irecipe-ingredieent';
import { APIRecipeService } from '../../services/apirecipe.service';
import { IIngredientPost } from '../../models/iingredientpost';
import { AuthService } from '../../services/auth.service';
import { IuserData } from '../../models/iuser-data';
import { ViewportScroller } from '@angular/common';
import { EditAdminComponent } from './edit-admin/edit-admin.component';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css',
})
export class AdminProfileComponent {
  @ViewChild('update') update!: EditAdminComponent;

  editRecipe(arg0: number) {
    throw new Error('Method not implemented.');
  }

  selectedRecipes: any[] = [];
  selectedRecipe: any = 0;
  selectedCategories: any[] = [];
  selectedCategory: any = '0';
  selectedIngredients: any[] = [];
  selectedIng: any = 0;

  showRecipes: boolean = true;
  showCat: boolean = false;
  showIngredient: boolean = false;

  AddIngredient: boolean = false;
  AddRecipe: boolean = false;
  AddCategory: boolean = false;

  btnAddIngredient: boolean = false;
  btnAddRecipe: boolean = false;
  btnAddCategory: boolean = false;
  AllRecipes: IRecipeDetails[] = [] as IRecipeDetails[];
  AllCategories: any[] = [];
  AllIngredients: any[] = [];

  selectedOptions: any[] = [];
  _selectedOptions: any[] = [];
  selectedIngredient: number = 0;
  edit: boolean = false;
  user: IuserData = {} as IuserData;
  Recipeingredients: IRecipeIngredieent[] = [] as IRecipeIngredieent[];
  OneRecipeingredient: IRecipeIngredieent = {} as IRecipeIngredieent;
  UserId: number = 0;
  ingredient: IIngredientPost = {
    ingredientName: '',
    carbs: 0,
    caloriesPer100g: 0,
    fats: 0,

    protein: 0,
  };
  category: ICategoryToAdd = {
    name: '',
    categoryID: 0,
  };
  recipeupdate = {} as IRecipeDetails;
  recipe: RecipeCreated = {
    title: '',

    instructions: '',

    prepTime: 0,

    description: '',

    cookingTime: 0,

    cuisineType: '',
    image: '',

    author: { userName: '', id: '8' },

    categoryNames: [],

    ingredients: [],
  };

  constructor(
    private _TopRatedService: TopRatedService,
    private _auth: AuthService,
    private _router: Router,
    private _email: EmailService,
    private _apiIngredientService: APIIngredientService,
    private _apiCategory: APICategoriesService,
    private _apiRecipess: APIRecipeService,
    private _activatedRoute: ActivatedRoute,
    private _virePortScrroller: ViewportScroller
  ) {}
  //ingredient form
  ingredientForm = new FormGroup({
    name: new FormControl('', Validators.required),

    calories: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    protein: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),

    fats: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    carbs: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
  });
  //Category form
  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  //Recipe form
  recipeForm = new FormGroup({
    image: new FormControl<File | null>(null, [Validators.required]),
    title: new FormControl('', Validators.required), //done
    instructions: new FormControl('', Validators.required), //done
    prepTime: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]), //done
    description: new FormControl('', Validators.required), //done
    cookingtime: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]), //done
    CuisineType: new FormControl('', Validators.required), //done
    author: new FormControl('', Validators.required), //done
    categories: new FormControl(null, Validators.required), //done
    ingredient_name: new FormControl(null, Validators.required),
    ingredient_quantity: new FormControl(1, Validators.required),
    ingredient_unit: new FormControl('', Validators.required),
  });
  ngOnInit() {
    this._virePortScrroller.scrollToPosition([0, 0]);
    this.loadAllRecipes();
    this._apiRecipess.GetAllRecipes().subscribe((data: any[]) => {
      this.selectedRecipes = [
        { recipeID: 0, title: 'All Recipes' },
        ...data.map((item) => ({
          recipeID: Number(item.recipeID),
          title: item.title,
        })),
      ];
    });
    this.UserId =
      Number(this._activatedRoute.snapshot.paramMap.get('AdminID')) ?? 0;
    this._auth.getUserData(this.UserId).subscribe({
      next: (res) => {
        this.user = res;
        if (!this.user.profileImageUrl) {
          this.user.profileImageUrl =
            'assets/blank-profile-picture-973460_640.webp';
        }
      },
    });

    this._apiIngredientService.GetAllIngredients().subscribe((data: any[]) => {
      this.AllIngredients = data;

      this.selectedIngredients = [
        { IngredientID: 0, IngredientName: 'All Ingredients' },
        ...data.map((item) => ({
          IngredientID: Number(item.ingredientID),
          IngredientName: item.ingredientName,
        })),
      ];
      this.selectedOptions = [
        ...data.map((item) => ({
          IngredientID: Number(item.ingredientID),
          IngredientName: item.ingredientName,
        })),
      ];
    });

    this._apiCategory.GetAllCategories().subscribe((data: any[]) => {
      this.AllCategories = data;
      this.selectedCategories = [
        { CatID: '0', CatName: 'All Categories' },
        ...data.map((item) => ({
          CatID: item.categoryID,
          CatName: item.name,
        })),
      ];
      this._selectedOptions = [
        ...data.map((item) => ({
          CatID: Number(item.categoryID),
          CatName: item.name,
        })),
      ];
    });
  }

  EditData() {
    this._router.navigateByUrl(`EditProfile/${this.UserId}`);
  }

  IngredientAdded() {
    this.btnAddIngredient = true;
    this.ingredient.ingredientName =
      this.ingredientForm.controls.name.value ?? '';

    this.ingredient.fats = Number(this.ingredientForm.controls.fats.value) || 0;

    this.ingredient.carbs =
      Number(this.ingredientForm.controls.carbs.value) || 0;
    this.ingredient.caloriesPer100g =
      Number(this.ingredientForm.controls.calories.value) || 0;
    this.ingredient.protein =
      Number(this.ingredientForm.controls.protein.value) || 0;
    this.ingredientForm.reset();

    this._apiIngredientService.AddIngredient(this.ingredient).subscribe({
      next: (res) => (this.btnAddIngredient = false),
      error: (err) => (this.btnAddIngredient = false),
    });
    this._apiIngredientService.GetAllIngredients().subscribe((data: any[]) => {
      this.selectedOptions = [
        ...data.map((item) => ({
          IngredientID: Number(item.ingredientID),
          IngredientName: item.ingredientName,
        })),
      ];
    });
  }
  CategoryAdded() {
    this.btnAddCategory = true;
    this.category.name = this.categoryForm.controls.name.value ?? '';
    this._apiCategory.AddCategory(this.category).subscribe({
      next: (res) => (this.btnAddCategory = false),
      error: (err) => (this.btnAddCategory = false),
    });
    this.categoryForm.reset();
  }

  addReccipeCategory() {
    const selectedId = this.recipeForm.get('categories')?.value;
    const selectedCategory = this._selectedOptions.find(
      (cat) => cat.CatID == selectedId
    );

    if (this.recipe.categoryNames.length != 0) {
      this.recipe.categoryNames.push(selectedCategory.CatName);
    } else {
      this.recipeForm.controls.categories.clearValidators();
      this.recipe.categoryNames.push(selectedCategory.CatName);
    }
    this.recipeForm.controls.categories.setValue(null);
  }
  addReccipeIngredient() {
    const Recipeingredient: IRecipeIngredieent = {} as IRecipeIngredieent;

    const selectedId = this.recipeForm.get('ingredient_name')?.value;
    const selectedIngredient = this.selectedOptions.find(
      (ingredient) => ingredient.IngredientID == selectedId
    );
    Recipeingredient.ingredientName = selectedIngredient.IngredientName;
    Recipeingredient.ingredientID = selectedIngredient.IngredientID;
    Recipeingredient.quantity = Number(
      this.recipeForm.controls.ingredient_quantity.value
    );
    Recipeingredient.unit =
      this.recipeForm.controls.ingredient_unit.value ?? '';

    if (this.recipe.ingredients.length != 0) {
      this.recipe.ingredients.push(Recipeingredient);
    } else {
      this.recipeForm.controls.ingredient_name.clearValidators();
      this.recipeForm.controls.ingredient_quantity.clearValidators();
      this.recipeForm.controls.ingredient_unit.clearValidators();

      this.recipe.ingredients.push(Recipeingredient);
    }
    this.recipeForm.controls.ingredient_name.setValue(null);
  }
  recipeAdded() {
    this.btnAddRecipe = true;
    const file = this.recipeForm.controls.image.value;
    if (file instanceof File) {
      this.resizeAndConvertToBase64(file, 1000, 500, (base64: string) => {
        this.recipe.image = base64;

        this.recipe.title = this.recipeForm.controls.title.value ?? '';
        this.recipe.instructions =
          this.recipeForm.controls.instructions.value ?? '';
        this.recipe.prepTime =
          Number(this.recipeForm.controls.prepTime.value) ?? 0;
        this.recipe.description =
          this.recipeForm.controls.description.value ?? '';
        this.recipe.cookingTime =
          Number(this.recipeForm.controls.cookingtime.value) ?? 0;
        this.recipe.cuisineType =
          this.recipeForm.controls.CuisineType.value ?? '';
        this.recipe.author.userName =
          this.recipeForm.controls.author.value ?? '';

        this._apiRecipess.AddRecipe(this.recipe).subscribe({
          next: (res) => (this.btnAddRecipe = false),
          error: (err) => (this.btnAddRecipe = false),
        });

        this.recipeForm.reset();
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('admin');
    this._auth.setLoggedIn(false);
    this._router.navigateByUrl('home');
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
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.recipeForm.controls['image'].setValue(file);
    }
  }
  clickAddRecipe() {
    this.showRecipes = false;
    this.showCat = false;
    this.showIngredient = false;
    this.AddRecipe = true;
    this.AddCategory = false;
    this.AddIngredient = false;
    this.recipe.categoryNames = [];
    this.recipe.ingredients = [];
    this._apiIngredientService.GetAllIngredients().subscribe((data: any[]) => {
      this.selectedOptions = [
        ...data.map((item) => ({
          IngredientID: Number(item.ingredientID),
          IngredientName: item.ingredientName,
        })),
      ];
    });

    this._apiCategory.GetAllCategories().subscribe((data: any[]) => {
      this._selectedOptions = [
        ...data.map((item) => ({
          CatID: Number(item.categoryID),
          CatName: item.name,
        })),
      ];
    });
  }
  ShowRecipe() {
    this.showRecipes = true;
    this.AddIngredient = false;
    this.AddCategory = false;
    this.AddRecipe = false;
    this.showIngredient = false;
    this.showCat = false;
    this.loadAllRecipes();
  }
  ShowCat() {
    this.showIngredient = false;

    this.showCat = true;
    this.showRecipes = false;
    this.AddIngredient = false;
    this.AddCategory = false;
    this.AddRecipe = false;
    this.loadAllCategories();
  }
  ShowIngrediengt() {
    this.showIngredient = true;
    this.showCat = false;
    this.showRecipes = false;
    this.AddIngredient = false;
    this.AddCategory = false;

    this.AddRecipe = false;
    this.loadAllIngredients();
  }

  loadAllRecipes() {
    this._apiRecipess.GetAllRecipes().subscribe({
      next: (response: IRecipeDetails[]) => {
        this.AllRecipes = response;
        this.selectedRecipes = [
          { recipeID: 0, title: 'All Recipes' },
          ...response.map((item) => ({
            recipeID: Number(item.recipeID),
            title: item.title,
          })),
        ];
      },
      error: (err: any) => {},
    });
  }
  loadAllCategories() {
    this._apiCategory.GetAllCategoriesV2().subscribe({
      next: (response) => {
        this.AllCategories = response;
        this.selectedCategories = [
          { CatID: '0', CatName: 'All Categories' },
          ...response.map((item) => ({
            CatID: item.id,
            CatName: item.name,
          })),
        ];
      },
      error: (err: any) => {},
    });
  }
  loadAllIngredients() {
    this._apiIngredientService.GetAllIngredients().subscribe({
      next: (response) => {
        this.AllIngredients = response;
        this.selectedIngredients = [
          { IngredientID: 0, IngredientName: 'All Ingredients' },
          ...response.map((item) => ({
            IngredientID: Number(item.ingredientID),
            IngredientName: item.ingredientName,
          })),
        ];
      },
      error: (err: any) => {},
    });
  }

  onRecipeSelected(recipeId: number) {
    if (recipeId === 0) {
      this._apiRecipess.GetAllRecipes().subscribe({
        next: (response: IRecipeDetails[]) => {
          this.AllRecipes = response;
        },
        error: (err: any) => {},
      });
    } else {
      this._apiRecipess.GetRecipeById(recipeId).subscribe((recipes) => {
        this.AllRecipes = [];
        this.AllRecipes[0] = recipes;
      });
    }
  }
  onCategorySelected(CatId: string) {
    if (CatId === '0') {
      this._apiCategory.GetAllCategoriesV2().subscribe({
        next: (response) => {
          this.AllCategories = response;
        },
        error: (err: any) => {},
      });
    } else {
      this._apiCategory.GetCategoryById(CatId).subscribe((recipes) => {
        this.AllCategories = [];
        this.AllCategories[0] = recipes;
      });
    }
  }
  onIngredientSelected(InredientId: number) {
    if (InredientId === 0) {
      this._apiIngredientService.GetAllIngredients().subscribe({
        next: (response) => {
          this.AllIngredients = response;
        },
        error: (err: any) => {},
      });
    } else {
      this._apiIngredientService
        .GetIngredientById(InredientId)
        .subscribe((recipes) => {
          this.AllIngredients = [];
          this.AllIngredients[0] = recipes;
        });
    }
  }
  deleteRecipe(recipeId: number) {
    this._apiRecipess.DeleteRecipe(recipeId).subscribe({
      next: (res) => {
        this.loadAllRecipes();
        this.selectedRecipe = 0;
      },
      error: (err: any) => {},
    });
  }
  deleteCategory(CatId: string) {
    this._apiCategory.DeleteCategory(CatId).subscribe({
      next: (res) => {
        this.loadAllCategories();
        this.selectedCategory = '0';
      },
      error: (err: any) => {},
    });
  }
  deleteIngredient(IngredientID: number) {
    this._apiIngredientService.deleteIngredient(IngredientID).subscribe({
      next: (res) => {
        this.loadAllIngredients();
        this.selectedIng = 0;
      },
      error: (err: any) => {},
    });
  }
  onEditModeChange(editMode: boolean) {
    if (editMode) {
      this.showRecipes = false;
      this.AddIngredient = false;
      this.AddCategory = false;
      this.AddRecipe = false;
      this.showIngredient = false;
      this.showCat = false;
    } else {
      // Reset to previous state when edit mode is cancelled
      if (this.update.edit) {
        this.showRecipes = true;
      } else if (this.update.editIngredientMode) {
        this.showIngredient = true;
      } else if (this.update.editCategoryMode) {
        this.showCat = true;
      }
    }
  }
}
