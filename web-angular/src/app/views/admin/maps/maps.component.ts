import { Component, OnInit } from '@angular/core';
import { MapExampleComponent } from '../../../components/maps/map-example/map-example.component';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  imports: [MapExampleComponent],
})
export class MapsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
