import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class StudentDashboardComponent implements OnInit {
  tests: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'Student') this.router.navigate(['/login']);
    this.loadTests();
  }

  loadTests(): void {
    this.http.get<any[]>('https://localhost:5001/api/student/tests').subscribe({
      next: (tests) => (this.tests = tests),
      error: (err) => console.error('Error loading tests:', err),
    });
  }

  attemptTest(testId: string): void {
    this.router.navigate(['/test', testId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}