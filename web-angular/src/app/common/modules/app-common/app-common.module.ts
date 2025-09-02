import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterOutlet, RouterLink],
  exports: [CommonModule, RouterOutlet, RouterLink],
})
export class AppCommonModule {}
