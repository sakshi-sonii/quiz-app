import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TestAttemptComponent } from './test-attempt/test-attempt.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'teacher', component: TeacherDashboardComponent },
  { path: 'student', component: StudentDashboardComponent },
  { path: 'test/:id', component: TestAttemptComponent },
  { path: 'results/:id', component: ResultsComponent },
];