import { Component, OnInit } from '@angular/core';
import { DataCell } from '../_shared/classes/data-cell';
import { TABLE_COL_REFS } from '../_shared/constants/data-table.constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  private _maxRows = 50;

  table: DataCell[][] = [];

  selected!: DataCell;

  async initDataTable() {

    for (let i = 0; i < this._maxRows; i++) {
      for (let j = 0; j < TABLE_COL_REFS.length; j++) {
        if (j === 0)
          this.table.push([]);

        this.table[i][j] = new DataCell({ ref: `${TABLE_COL_REFS[j]}${i}` });
      }
    }

  }

  ngOnInit(): void {
    this.initDataTable();

    if (!this.selected)
      this.selected = this.table[0][0];
  }

}
