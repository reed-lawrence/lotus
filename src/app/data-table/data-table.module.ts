import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { DataTableComponent } from "./data-table.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    DataTableComponent
  ],
  exports: [
    DataTableComponent
  ]
})
export class DataTableModule { }