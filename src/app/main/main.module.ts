import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CellInputModule } from "../cell-input/cell-input.module";
import { DataTableModule } from "../data-table/data-table.module";
import { MainComponent } from "./main.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent
      }
    ]),
    DataTableModule,
    CellInputModule,
  ],
  declarations: [
    MainComponent
  ]
})
export class MainModule { }