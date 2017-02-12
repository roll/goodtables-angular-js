import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { ReportComponent } from './report.component';
import { TableComponent } from './table.component';
import { TableValuesComponent } from './table-values.component';
import { TableErrorsComponent } from './table-errors.component';
import './styles.css';

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    ReportComponent,
    TableComponent,
    TableValuesComponent,
    TableErrorsComponent,
  ],
  bootstrap: [ReportComponent]
})
export class ReportModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
