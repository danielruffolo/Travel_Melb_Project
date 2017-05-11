import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentDrawer } from './content-drawer';

@NgModule({
  declarations: [
    ContentDrawer,
  ],
  imports: [
    IonicPageModule.forChild(ContentDrawer),
  ],
  exports: [
    ContentDrawer
  ]
})
export class ContentDrawerModule {}
