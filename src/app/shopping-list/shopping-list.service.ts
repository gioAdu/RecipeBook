import { Injectable } from '@angular/core';
import { ingredient } from '../shared-components/ingredient.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  ingredientsChanged: Subject<any> = new Subject<any>();
  startedEditing = new Subject<number>();

  private ingredients: ingredient[] = [
    new ingredient('Apples', 5),
    new ingredient('tomatoes', 15),
  ];

  constructor() {}

  addIngredient(ingredient: ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredientsFromRecipe(ingredient: ingredient[]) {
    this.ingredients.push(...ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index:number){
    this.ingredients.splice(index,1)
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  updateIngredient(index:number,newIngredient:ingredient){
    this.ingredients[index] = newIngredient
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
