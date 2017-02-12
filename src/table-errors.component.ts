import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-table-errors',
  templateUrl: './table-errors.component.html',
})
export class TableErrorsComponent {
  @Input() table: any;
}
