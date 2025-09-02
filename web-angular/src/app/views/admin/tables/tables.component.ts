import { Component, OnInit } from '@angular/core';
import { CardTableComponent } from '../../../components/cards/card-table/card-table.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  imports: [CardTableComponent],
})
export class TablesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
