import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataCell, DataCellType } from '../_shared/classes/data-cell';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  constructor() { }

  @Input()
  table!: DataCell[][];

  @Output()
  onSelect = new EventEmitter<DataCell>();

  ngOnInit(): void {
  }

}
