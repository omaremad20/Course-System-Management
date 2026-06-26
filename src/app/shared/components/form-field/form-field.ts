import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './form-field.html',
})
export class FormField {
  label = input.required<string>();
  control = input.required<FormControl>();
  matcher = input.required<ErrorStateMatcher>();
  type = input<string>('text');
  placeholder = input<string>('');
  options = input<{ value: string; label: string }[]>([]);

  errorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    if (errors['required']) return `${this.label()} is required`;
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters`;
    return 'Invalid value';
  }

  onInput(event: Event) {
    if (this.type() !== 'number') return;
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/e/gi, '');
  }
}
