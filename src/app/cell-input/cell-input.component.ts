import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataCell } from '../_shared/classes/data-cell';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.scss']
})
export class CellInputComponent implements OnInit, OnDestroy, OnChanges {

  constructor() { }

  private _subs: Subscription[] = [];

  @Input()
  cell!: DataCell;

  input = new FormControl(undefined);

  ngOnInit() {
    if (!this.cell)
      throw new Error('@Input() CellInputComponent.cell must be provided');

    this.input.valueChanges.subscribe({
      next: () => {
        this.cell.value = this.input.value;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.input.setValue(this.cell.value);
  }

  ngOnDestroy() {
    this._subs.forEach(s => s.unsubscribe());
  }

}
