import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared-components/shared-components.module';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
		FormsModule,
		SharedModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent },
    ]),
		
  ],
})
export class ShoppingListModule {}
