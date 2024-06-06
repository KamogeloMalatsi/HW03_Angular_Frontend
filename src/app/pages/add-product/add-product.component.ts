import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Brand, ProductType } from '../../shared/lookup-data';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  brands: Brand[] = [];
  productTypes: ProductType[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      price: ['', [Validators.required, this.decimalValidator]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      brand: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.apiService.getBrands().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });

    this.apiService.getProductTypes().subscribe((productTypes: ProductType[]) => {
      this.productTypes = productTypes;
    });
  }

  get f() {
    return this.addProductForm.controls;
  }

  decimalValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    if (value && !decimalRegex.test(value)) {
      return { decimal: true };
    }
    return null;
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.match(/image\/*/) == null) {
        this.errorMessage = 'Only images are allowed.';
        this.addProductForm.patchValue({ image: null });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.addProductForm.patchValue({ image: reader.result?.toString().split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.addProductForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      this.showSnackBar(this.errorMessage, 'Close', 'error-snackbar');
      return;
    }

    this.apiService.addProduct(this.addProductForm.value).subscribe(
      response => {
        const successMessage = `${this.addProductForm.value.name} created successfully!`;
        this.showSnackBar(successMessage, 'Close', 'success-snackbar');
        setTimeout(() => {
          this.router.navigate(['/product-listing'], { state: { message: successMessage } });
        }, 2000);
      },
      (error: HttpErrorResponse) => {
        console.error('Add product error', error);
        this.errorMessage = 'An error occurred. Please try again later.';
        this.showSnackBar(this.errorMessage, 'Close', 'error-snackbar');
      }
    );
  }

  showSnackBar(message: string, action: string, panelClass: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [panelClass]
    });
  }
}