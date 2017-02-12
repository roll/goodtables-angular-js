import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-table',
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() table: any;
  id1 = Math.random().toString(36).substring(10);
  id2 = Math.random().toString(36).substring(10);
  show = false;
  values = false;

  get source() {
    let source = this.table.source;
    if (source.length > 50) {
      source = `<truncated>/${this.table.source.split('/').pop()}`;
    }
    return source;
  }
}
