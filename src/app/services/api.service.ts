import { Injectable } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Login, Register } from '../shared/authentication';
import { Brand, ProductType } from '../shared/lookup-data';
import { Product, ProductListing } from '../shared/product';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'http://localhost:5240/api/'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
    constructor(private httpClient: HttpClient, private router: Router) {
    }

    login(user: Login): Observable<User> {
      return this.httpClient.post<User>(`${this.apiUrl}Authentication/Login`, user);
    }
  
    register(user: Register): Observable<any> {
      return this.httpClient.post<any>(`${this.apiUrl}Authentication/Register`, user);
    }

    getBrands(): Observable<Brand[]> {
      return this.httpClient.get<Brand[]>(`${this.apiUrl}Store/GetBrands`);
    }
  
    getProductTypes(): Observable<ProductType[]> {
      return this.httpClient.get<ProductType[]>(`${this.apiUrl}Store/GetProductTypes`);
    }
  
    getProducts(): Observable<ProductListing[]> {
      return this.httpClient.get<ProductListing[]>(`${this.apiUrl}Store/GetProducts`);
    }
  
    addProduct(product: Product): Observable<Product> {
      return this.httpClient.post<Product>(`${this.apiUrl}Store/AddProduct`, product);
    }

    getProductsReport(): Observable<any> {
      return this.httpClient.get<any>(`${this.apiUrl}Report/GenerateReport`);
    }

}
