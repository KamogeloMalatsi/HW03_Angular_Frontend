import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Login, User} from '../../shared/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  //user: Login = { userName: '', password: '' };
  loginForm!: FormGroup;
  errorMessage: string = '';
  formSubmitted: boolean = false; 

  constructor(private apiService: ApiService, private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    console.log('Login request', this.loginForm.value); // Log the request

    this.apiService.login(this.loginForm.value).subscribe(
      data => {
        console.log('Login response', data); // Log the response
        localStorage.setItem('User', JSON.stringify(data));
        this.router.navigate(['/product-listing']);
      },
      (error: HttpErrorResponse) => {
        console.error('Login error', error); // Log the error
        if (error.status === 401) {
          this.errorMessage = 'Invalid login credentials. Please try again.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    );
  }

}
