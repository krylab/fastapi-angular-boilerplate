import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-footer-admin",
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./footer-admin.component.html",
})
export class FooterAdminComponent implements OnInit {
  date = new Date().getFullYear();
  constructor() {}

  ngOnInit(): void {}
}
