import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';

import {PacService} from './src/postage-assessment-calculator.service';

export * from './src/postage-assessment-calculator.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  exports: []
})
export class AustraliaPostAPIModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AustraliaPostAPIModule,
      providers: [PacService]
    };
  }
}
