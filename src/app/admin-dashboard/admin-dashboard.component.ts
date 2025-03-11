import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  teachers: any[] = [];
  tests: any[] = [];
  email: string = ''; // Added
  password: string = ''; // Added
  name: string = ''; // Added
  duration: number | null = null; // Added

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'Admin') this.router.navigate(['/login']);
    this.loadTeachers();
    this.loadTests();
  }

  loadTeachers(): void {
    this.http.get<any[]>('https://localhost:5001/api/admin/teachers').subscribe({
      next: (teachers) => (this.teachers = teachers),
      error: (err) => console.error('Error loading teachers:', err),
    });
  }

  loadTests(): void {
    this.http.get<any[]>('https://localhost:5001/api/admin/tests').subscribe({
      next: (tests) => (this.tests = tests),
      error: (err) => console.error('Error loading tests:', err),
    });
  }

  addTeacher(): void {
    if (!this.email || !this.password) return;
    this.http.post('https://localhost:5001/api/admin/teachers', { email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loadTeachers();
        this.email = '';
        this.password = '';
      },
      error: (err) => console.error('Error adding teacher:', err),
    });
  }

  deleteTeacher(teacherId: string): void {
    this.http.delete(`https://localhost:5001/api/admin/teachers/${teacherId}`).subscribe({
      next: () => this.loadTeachers(),
      error: (err) => console.error('Error deleting teacher:', err),
    });
  }

  addTest(): void {
    if (!this.name || this.duration === null) return;
    this.http.post('https://localhost:5001/api/admin/tests', { name: this.name, duration: this.duration }).subscribe({
      next: () => {
        this.loadTests();
        this.name = '';
        this.duration = null;
      },
      error: (err) => console.error('Error adding test:', err),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
