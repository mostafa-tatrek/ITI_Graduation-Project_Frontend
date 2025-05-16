import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRecipeDetails } from '../../../models/irecipe-details';
import { IuserData } from '../../../models/iuser-data';
import { IRecipeIngredieent } from '../../../models/irecipe-ingredieent';
import { IIngredientPost } from '../../../models/iingredientpost';
import { ICategoryToAdd } from '../../../models/icategory-to-add';
import { TopRatedService } from '../../../services/top-rated.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../../services/email.service';
import { APIIngredientService } from '../../../services/api-ingredient.service';
import { APICategoriesService } from '../../../services/api-categories.service';
import { APIRecipeService } from '../../../services/apirecipe.service';
import { ViewportScroller } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IIngredient } from '../../../models/iingredient';
import { ICategory } from '../../../models/icategory';
@Component({
  selector: 'app-edit-admin',
  standalone: false,
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css',
})
export class EditAdminComponent {
  @Output() editModeChange = new EventEmitter<boolean>();
  @Input() showRecipesList: boolean = true;

  selectedRecipes: any[] = [];
  selectedRecipe: any = 0;
  selectedCategories: any[] = [];
  selectedCategory: any = '0';
  selectedIngredients: any[] = [];
  selectedIng: any = 0;

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
  categoryupdate= {} as ICategory;
  recipeupdate = {} as IRecipeDetails;

  // Add new form groups for ingredient and category editing
  editIngredientForm = new FormGroup({
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

  editCategoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  // Add flags for showing edit forms
  editIngredientMode: boolean = false;
  editCategoryMode: boolean = false;

  // Add properties to store current items being edited
  currentIngredient: IIngredient = {} as IIngredient;
  currentCategory: ICategory = {} as ICategory;

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
  //Recipe form
  editrecipeForm = new FormGroup({
    image: new FormControl<File | null>(null, [Validators.required]),
    title: new FormControl('', Validators.required),
    instructions: new FormControl('', Validators.required),
    prepTime: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    description: new FormControl('', Validators.required),
    cookingtime: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    CuisineType: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    categories: new FormControl<number[]>([], Validators.required),
    ingredient_name: new FormControl('', Validators.required),
    ingredient_quantity: new FormControl(1, Validators.required),
    ingredient_unit: new FormControl('', Validators.required),
  });
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
      this.editrecipeForm.controls['image'].setValue(file);
    }
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
  addReccipeCategory() {
    const selectedId = this.editrecipeForm.get('categories')?.value;
    const selectedCategory = this._selectedOptions.find(
      (cat) => cat.CatID == selectedId
    );
 if (this.recipeupdate.categoryNames.length != 0) {
      this.recipeupdate.categoryNames.push(selectedCategory.CatName);
    } else {
      this.editrecipeForm.controls.categories.clearValidators();
      this.recipeupdate.categoryNames.push(selectedCategory.CatName);
    }
    this.editrecipeForm.controls.categories.setValue(null);
  }
  updateReccipeIngredient() {
    const Recipeingredient: IIngredient = {} as IIngredient;

    const selectedId = this.editrecipeForm.get('ingredient_name')?.value;
    const selectedIngredient = this.selectedOptions.find(
      (ingredient) => ingredient.IngredientID == selectedId
    );
    Recipeingredient.ingredientName = selectedIngredient.IngredientName;
    Recipeingredient.ingredientID = selectedIngredient.IngredientID;
    Recipeingredient.quantity = Number(
      this.editrecipeForm.controls.ingredient_quantity.value
    );
    Recipeingredient.unit =
      this.editrecipeForm.controls.ingredient_unit.value ?? '';

    if (this.recipeupdate.ingredients.length != 0) {
      this.recipeupdate.ingredients.push(Recipeingredient);
    } else {
      this.editrecipeForm.controls.ingredient_name.clearValidators();
      this.editrecipeForm.controls.ingredient_quantity.clearValidators();
      this.editrecipeForm.controls.ingredient_unit.clearValidators();

      this.recipeupdate.ingredients.push(Recipeingredient);
    }
    this.editrecipeForm.controls.ingredient_name.setValue(null);
  }

  currentRecipeImage: string = '';
  editRecipe(recipeid: number) {
    this.edit = true;
    this.editModeChange.emit(true);
    this.editIngredientMode = false;
    this.editCategoryMode = false;

    this._apiRecipess
      .GetRecipeById(recipeid)
      .subscribe((recipe: IRecipeDetails) => {
        this.recipeupdate = recipe;
        this.currentRecipeImage = recipe.image || '';

        // Find the ingredient ID from selectedOptions based on the ingredient name
        const firstIngredient = recipe.ingredients[0];
        const matchingIngredient = this.selectedOptions.find(
          (opt) => opt.IngredientName === firstIngredient.ingredientName
        );

        // Find category IDs that match the recipe's category names
        const categoryIds = recipe.categoryNames.map(catName => {
          const matchingCategory = this._selectedOptions.find(cat => cat.CatName === catName);
          return matchingCategory ? matchingCategory.CatID : null;
        }).filter(id => id !== null);

        this.editrecipeForm.patchValue({
            title: recipe.title,
            instructions: recipe.instructions,
            prepTime: String(recipe.prepTime),
            description: recipe.description,
            cookingtime: String(recipe.cookingTime),
            CuisineType: recipe.cuisineType,
            author: recipe.author.userName,
            categories: categoryIds,
            ingredient_name: matchingIngredient?.IngredientID,
            ingredient_quantity: firstIngredient.quantity,
            ingredient_unit: firstIngredient.unit,
        });
    });
  }
  updateRecipe() {
    this.btnAddRecipe = true;
    if (this.editrecipeForm.valid) {
      const file = this.editrecipeForm.controls.image?.value;
      if (file instanceof File) {
        this.resizeAndConvertToBase64(file, 1000, 500, (base64: string) => {
          this.recipeupdate.image = base64;
        });
      } else {
        this.recipeupdate.image = this.currentRecipeImage;
      }
      const updatedRecipe: IRecipeDetails = {
        ...this.recipeupdate,
        title: this.editrecipeForm.controls.title.value ?? '',
        instructions: this.editrecipeForm.controls.instructions.value ?? '',
        prepTime: Number(this.editrecipeForm.controls.prepTime.value) ?? 0,
        description: this.editrecipeForm.controls.description.value ?? '',
        cookingTime:
          Number(this.editrecipeForm.controls.cookingtime.value) ?? 0,
        cuisineType: this.editrecipeForm.controls.CuisineType.value ?? '',
        author: {
          userName: this.editrecipeForm.controls.author.value ?? '',
          id: this.recipeupdate.author.id,
        },
        categoryNames: this.recipeupdate.categoryNames,
        ingredients: this.recipeupdate.ingredients,
      };

      this._apiRecipess.EditRecipe(updatedRecipe).subscribe({
        next: (res) => {
          this.btnAddRecipe = false;
        },
        error: (err) => {
          this.btnAddRecipe = false;
          console.error('Error updating recipe:', err);
        },
      });
    }
  }

  editIngredient(ingredientId: number) {
    this.edit = false;
    this.editIngredientMode = true;
    this.editCategoryMode = false;
    this.editModeChange.emit(true);

    this._apiIngredientService.GetIngredientById(ingredientId).subscribe((ingredient) => {
      this.currentIngredient = ingredient;
      this.editIngredientForm.patchValue({
        name: ingredient.ingredientName,
        calories: String(ingredient.caloriesPer100g),
        protein: String(ingredient.protein),
        fats: String(ingredient.fats),
        carbs: String(ingredient.carbs)
      });
    });
  }

  editCategory(categoryId: string) {
    this.edit = false;
    this.editIngredientMode = false;
    this.editCategoryMode = true;
    this.editModeChange.emit(true);

    this._apiCategory.GetCategoryById(categoryId).subscribe((category) => {
      this.currentCategory = this.categoryupdate;
      this.editCategoryForm.patchValue({
        name: category.name
      });
    });
  }

  updateIngredient() {
    if (this.editIngredientForm.valid) {
      const updatedIngredient: IIngredient = {
        ...this.currentIngredient,
        ingredientName: this.editIngredientForm.controls.name.value ?? '',
        caloriesPer100g: Number(this.editIngredientForm.controls.calories.value) ?? 0,
        protein: Number(this.editIngredientForm.controls.protein.value) ?? 0,
        fats: Number(this.editIngredientForm.controls.fats.value) ?? 0,
        carbs: Number(this.editIngredientForm.controls.carbs.value) ?? 0
      };

      this._apiIngredientService.EditIngredient(updatedIngredient).subscribe({
        next: () => {
          this.editIngredientMode = false;
          this.editModeChange.emit(false);
          this.loadAllIngredients();
          this.editIngredientForm.reset();
        },
        error: (err) => {
          console.error('Error updating ingredient:', err);
        }
      });
    }
  }

  updateCategory() {
    if (this.editCategoryForm.valid) {
      const updatedCategory: ICategory = {
        ...this.currentCategory,
        name: this.editCategoryForm.controls.name.value ?? ''
      };

      this._apiCategory.EditCategory(updatedCategory).subscribe({
        next: () => {
          this.editCategoryMode = false;
          this.editModeChange.emit(false);
          this.loadAllCategories();
          this.editCategoryForm.reset();
        },
        error: (err) => {
          console.error('Error updating category:', err);
        }
      });
    }
  }

  cancelEdit() {
    this.edit = false;
    this.editIngredientMode = false;
    this.editCategoryMode = false;
    this.editModeChange.emit(false);
    this.editrecipeForm.reset();
    this.editIngredientForm.reset();
    this.editCategoryForm.reset();
  }
}
