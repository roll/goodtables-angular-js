import { TestBed } from '@angular/core/testing';
import { TableErrorsComponent } from '../src/table-errors.component';
const report = require('../data/report.json');

describe('TableErrors Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TableErrorsComponent]});
  });

  it('should render', () => {
    const fixture = TestBed.createComponent(TableErrorsComponent);
    fixture.componentInstance.table = report.tables[0];
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('Row');
  });

});
