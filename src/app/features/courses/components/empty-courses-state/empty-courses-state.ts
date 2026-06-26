import { Component, input, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-courses-state',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './empty-courses-state.html',
})
export class EmptyCoursesState {
  hasActiveFilters = input<boolean>(false);

  content = computed(() => {
    if (this.hasActiveFilters()) {
      return {
        icon: 'search_off',
        title: 'No results found',
        description: 'No courses match your current search or filters. Try adjusting them.',
        showButton: false,
      };
    }
    return {
      icon: 'school',
      title: 'No Courses Available',
      description: 'It looks like there are no courses yet. Get started by adding a new course.',
      showButton: true,
    };
  });
}
