import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './error-state.html',
  styleUrl: './error-state.css',
})
export class ErrorState {
  @Input() errorMessage: string = 'Something went wrong. Please try again.';
  @Input() showRetryButton = true;

  // Emits an event to the parent component when the button is clicked
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
