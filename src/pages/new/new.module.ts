import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { New } from './new';

@NgModule({
  declarations: [
    New,
  ],
  imports: [
    IonicPageModule.forChild(New),
  ],
  exports: [
    New
  ]
})
export class NewModule {}
