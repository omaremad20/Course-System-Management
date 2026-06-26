import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card-skeleton.html',
})
export class CourseCardSkeleton {
  @Input() limit: number = 5;

  get dummyArray(): number[] {
    return Array(this.limit).fill(0);
  }
}
