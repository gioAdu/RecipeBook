import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ingredient } from '../shared-components/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesChanged:Subject<Recipe[]> = new Subject<Recipe[]>()

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super tasty Schnitzel ',
  //     'https://www.thespruceeats.com/thmb/cckc3_4QUQ79kSFhcLPM8xg9F3g=/3797x2848/smart/filters:no_upscale()/wiener-schnitzel-recipe-1447089-Hero-5b587d6c46e0fb0071b0059d.jpg',
  //     [new ingredient('Meat', 1), new ingredient('French fries', 20)]
  //   ),
  //   new Recipe(
  //     'Burger',
  //     'super tasty burger',
  //     'https://i.stack.imgur.com/XGFw7m.jpg',
  //     [new ingredient('buns', 2), new ingredient('Meat', 1)]
  //   ),
  // ];

  private recipes:Recipe[] = []
  
  constructor(private slService: ShoppingListService) {}

  setRecipes(recipe:Recipe[]){
    this.recipes = recipe
    this.recipesChanged.next(this.recipes.slice())
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredient: ingredient[]) {
    this.slService.addIngredientsFromRecipe(ingredient);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe)
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.recipesChanged.next(this.recipes.slice())
  }

  deteleRecipe(index:number){
    this.recipes.splice(index,1)
    this.recipesChanged.next(this.recipes.slice())
  }

  
}
