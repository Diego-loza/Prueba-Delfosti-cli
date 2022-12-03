import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoDetailComponent } from './producto/producto-detail/producto-detail.component';
import { ProductoEditComponent } from './producto/producto-edit/producto-edit.component';
import { ProductoListComponent } from './producto/producto-list/producto-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'productos',
    component: ProductoListComponent
  },
  {
    path: 'productos/:_id',
    component: ProductoDetailComponent
  },
  {
    path: 'productos/:_id/edit',
    component: ProductoEditComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
