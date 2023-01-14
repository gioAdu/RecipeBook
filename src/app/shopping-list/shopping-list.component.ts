import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ingredient } from '../shared-components/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit,OnDestroy {
  ingredients!:ingredient[]
  private subscription:Subscription

  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit(): void {
   this.ingredients = this.shoppingListService.getIngredients()
   this.subscription = this.shoppingListService.ingredientsChanged.subscribe((ingredient: ingredient[]) => {
    this.ingredients = ingredient
   })
  }

  onEditItem(id:number){
    this.shoppingListService.startedEditing.next(id)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }



}
