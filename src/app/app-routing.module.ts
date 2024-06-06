import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ProductListingComponent } from './pages/product-listing/product-listing.component';
import { ReportingComponent } from './pages/reporting/reporting.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'add-product', component: AddProductComponent},
  { path: 'product-listing', component: ProductListingComponent},
  { path: 'reporting', component: ReportingComponent},
  {path: '', redirectTo: 'login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
