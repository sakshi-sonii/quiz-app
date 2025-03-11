import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-attempt',
  standalone: true,
  templateUrl: './test-attempt.component.html',
  styleUrls: ['./test-attempt.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class TestAttemptComponent implements OnInit, OnDestroy {
  testId: string | null = null;
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  answers: { [key: number]: string } = {};
  markedForReview: Set<number> = new Set();
  timeLeft: number = 0;
  timerSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.loadTest();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }

  loadTest(): void {
    this.http.get<any>(`https://localhost:5001/api/tests/${this.testId}`).subscribe({
      next: (test) => {
        this.questions = test.questions;
        this.timeLeft = test.duration * 60; // Duration in seconds
        this.startTimer();
      },
      error: (err) => console.error('Error loading test:', err),
    });
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) this.timeLeft--;
      else this.submitTest();
    });
  }

  selectAnswer(questionIndex: number, answer: string): void {
    this.answers[questionIndex] = answer;
  }

  markForReview(questionIndex: number): void {
    if (this.markedForReview.has(questionIndex)) this.markedForReview.delete(questionIndex);
    else this.markedForReview.add(questionIndex);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) this.currentQuestionIndex++;
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  clearResponse(): void {
    delete this.answers[this.currentQuestionIndex];
  }

  submitTest(): void {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    this.http
      .post(`https://localhost:5001/api/tests/${this.testId}/submit`, {
        answers: this.answers,
      })
      .subscribe({
        next: (result) => {
          this.router.navigate(['/results', this.testId]);
        },
        error: (err) => console.error('Error submitting test:', err),
      });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}