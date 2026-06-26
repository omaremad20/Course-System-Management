import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackbar = inject(MatSnackBar);

  private get position() {
    return window.innerWidth < 768 ? 'center' : 'end';
  }

  success(message: string, action?: string): ReturnType<MatSnackBar['open']> {
    return this.snackbar.open(message, action ?? 'Dismiss', {
      duration: 3500,
      horizontalPosition: this.position,
      verticalPosition: 'bottom',
      panelClass: ['snack-success'],
    });
  }

  error(message: string): void {
    this.snackbar.open(message, 'Dismiss', {
      duration: 3500,
      horizontalPosition: this.position,
      verticalPosition: 'bottom',
      panelClass: ['snack-error'],
    });
  }
}
