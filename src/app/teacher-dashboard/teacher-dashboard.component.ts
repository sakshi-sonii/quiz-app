import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class TeacherDashboardComponent implements OnInit {
  tests: any[] = [];
  file: File | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'Teacher') this.router.navigate(['/login']);
    this.loadTests();
  }

  loadTests(): void {
    this.http.get<any[]>('https://localhost:5001/api/teacher/tests').subscribe({
      next: (tests) => (this.tests = tests),
      error: (err) => console.error('Error loading tests:', err),
    });
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  uploadQuestions(testId: string): void {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('file', this.file);
    this.http.post(`https://localhost:5001/api/teacher/tests/${testId}/questions`, formData).subscribe({
      next: () => this.loadTests(),
      error: (err) => console.error('Error uploading questions:', err),
    });
  }

  deleteTest(testId: string): void {
    this.http.delete(`https://localhost:5001/api/teacher/tests/${testId}`).subscribe({
      next: () => this.loadTests(),
      error: (err) => console.error('Error deleting test:', err),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}