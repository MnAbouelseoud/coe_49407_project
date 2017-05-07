import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shop } from './shop';

@NgModule({
  declarations: [
    Shop,
  ],
  imports: [
    IonicPageModule.forChild(Shop),
  ],
  exports: [
    Shop
  ]
})
export class ShopModule {}
