import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipe = this.recipeService.getRecipes();
    return this.http
      .put(
        'https://recipe-app-92e78-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipe
      )
      .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get(
        'https://recipe-app-92e78-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes: any) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
