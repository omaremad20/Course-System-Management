import { Component, input,computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table-skeleton',
  imports: [MatTableModule],
  templateUrl: './table-skeleton.html',
  styleUrl: './table-skeleton.css',
})
export class TableSkeleton {
  columns = input.required<string[]>();
  limit = input.required<number>();

  rows = computed(() => Array(this.limit()).fill({}));
}
