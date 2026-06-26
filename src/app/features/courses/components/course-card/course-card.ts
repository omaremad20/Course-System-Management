import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ICourse } from '../../models/ICourse';
import { IMinCourse } from '../../models/IMinCourse';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './course-card.html',
})
export class CourseCard {
  @Input({ required: true }) course!: ICourse;

  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<IMinCourse>();
}
