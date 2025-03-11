import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const role = this.authService.getRole();
        if (role === 'Admin') this.router.navigate(['/admin']);
        else if (role === 'Teacher') this.router.navigate(['/teacher']);
        else if (role === 'Student') this.router.navigate(['/student']);
      },
      error: (err) => (this.errorMessage = 'Invalid credentials'),
    });
  }
}