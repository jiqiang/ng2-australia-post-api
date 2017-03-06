import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';

import {PostageAssessmentCalculatorService} from './src/postage-assessment-calculator.service';
import {AustraliaPostAPIConfig} from './src/australia-post-api-config';

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
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: AustraliaPostAPIModule,
      providers: [
        PostageAssessmentCalculatorService,
        {provide: AustraliaPostAPIConfig, useValue: config}
      ]
    };
  }
}
