import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-footer",
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {
  date = new Date().getFullYear();
  constructor() {}

  ngOnInit(): void {}
}
