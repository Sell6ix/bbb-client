import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { ApplicationCardComponent } from '../../components/application-card/application-card.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeComponent,          
    ApplicationCardComponent,
  ],
  exports: [
    HomeComponent,
  ]
})
export class HomeModule {}
