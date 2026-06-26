import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './generic-table.html',
})

export class GenericTable implements OnChanges {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];

  @Output() view   = new EventEmitter<string>();
  @Output() edit   = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  ngOnChanges() {
    // بنتأكد إنه array قبل الـ spread
    if (Array.isArray(this.dataSource)) {
      this.dataSource = [...this.dataSource];
    } else {
      this.dataSource = [];
    }
  }
}
