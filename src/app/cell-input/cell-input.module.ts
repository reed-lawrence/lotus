import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellInputComponent } from './cell-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CellInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CellInputComponent
  ]
})
export class CellInputModule { }
