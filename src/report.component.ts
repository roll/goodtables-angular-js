import { Component, OnInit } from '@angular/core';
declare var fetch: any;

@Component({
  selector: 'my-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  report = {};

  ngOnInit() {
    // TODO: remove quick fix
    // Just need this data - non angular2 way
    // Also to make this component reusable it
    // sould be moved to index.html
    fetch('data/report.json').then(response => {
      response.json().then(report => {
        this.report = report;
      });
    });
  }
}
