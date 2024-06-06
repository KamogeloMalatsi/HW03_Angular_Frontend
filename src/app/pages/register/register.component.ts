import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Register} from '../../shared/authentication';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: Register = { emailaddress: '', password: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {}

  register(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      this.showSnackBar(this.errorMessage, 'Close', 'error-snackbar');
      return;
    }

    this.apiService.register(this.user).subscribe(
      () => {
        this.successMessage = 'Registered successfully!';
        this.showSnackBar(this.successMessage, 'Close', 'success-snackbar');
        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        }, 2000);
      },
      error => {
        this.errorMessage = 'Registration failed. Please try again.';
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
