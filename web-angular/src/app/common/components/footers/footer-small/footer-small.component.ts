import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer-small',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './footer-small.component.html',
})
export class FooterSmallComponent implements OnInit {
  date = new Date().getFullYear();

  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
  @Input()
  get absolute(): boolean {
    return this._absolute;
  }
  set absolute(absolute: boolean) {
    this._absolute = absolute === undefined ? false : absolute;
  }
  private _absolute = false;

  constructor() {}

  ngOnInit(): void {}
}
