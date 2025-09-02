import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableDropdownComponent } from '../../dropdowns/table-dropdown/table-dropdown.component';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  imports: [NgClass, TableDropdownComponent],
})
export class CardTableComponent implements OnInit {
  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== 'light' && color !== 'dark' ? 'light' : color;
  }
  private _color = 'light';

  constructor() {}

  ngOnInit(): void {}
}
