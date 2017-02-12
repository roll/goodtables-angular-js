import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-table-values',
  templateUrl: './table-values.component.html',
})
export class TableValuesComponent {
  @Input() table: any;
  expandedRows = [];

  get rows() {
    const rows = [];
    for (const error of this.table.errors) {
      const rowNumber = error['row-number'] || 0;
      const values = [null, ...((rowNumber === 0) ? this.table.headers : error.row)];
      const headers = [null, ...this.table.headers];
      // Initial
      if (!rows[rowNumber]) {
        rows[rowNumber] = {values: [], badcols: [], errors: []};
      }
      // Values
      if (error.code === 'blank-row') {
        rows[rowNumber].values = headers.map(() => '');
      } else {
        rows[rowNumber].values = values;
        if (error.code === 'missing-value') {
          rows[rowNumber].values[error['column-number']] = '';
        }
      }
      // Badcols
      if (!error['column-number']) {
        const base = (error.code === 'blank-row') ? headers : values;
        rows[rowNumber].badcols = base.map((_, index) => index).filter(Boolean);
      } else {
        rows[rowNumber].badcols.push(error['column-number']);
      }
      // Errors
      rows[rowNumber].errors.push(error);
    }
    return rows;
  }

  toggleExpandedRow(rowNumber) {
    if (this.expandedRows.includes(rowNumber)) {
      this.expandedRows = this.expandedRows.filter((value) => value !== rowNumber);
    } else {
      this.expandedRows.push(rowNumber);
    }
  }
}
