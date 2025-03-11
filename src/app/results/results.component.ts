import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class ResultsComponent implements OnInit {
  testId: string | null = null;
  result: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.loadResults();
  }

  loadResults(): void {
    this.http.get<any>(`https://localhost:5001/api/tests/${this.testId}/results`).subscribe({
      next: (result) => {
        this.result = result;
      },
      error: (err) => console.error('Error loading results:', err),
    });
  }
}