import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { ReportGenService } from "./report-gen.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgIf],
  template: `
    <section>
      <h1>Generate & Download Reports</h1>
      <form [formGroup]="applyForm" (submit)="submit()">
        <label for="month">Month of report</label>
        <input id="month" type="text" formControlName="month" placeholder="YYYY-MM">
        <button class="primary" type="submit">Download</button>
      </form>
      <p *ngIf="invalid" style="color: red">
        Invalid Month specification or internal server error occurred.
      </p>
    </section>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  applyForm = new FormGroup({
    month: new FormControl('')
  });
  invalid: boolean = false;

  reportService = inject(ReportGenService);

  submit() {
    let pattern = new RegExp("^\\d{4}-(0[1-9]|1[0-2])$");
    if (pattern.test(this.applyForm.value.month || "")) {
      this.invalid = false;
      this.reportService.download(this.applyForm.value.month || "").subscribe(res => {
        let filename = res.headers.get("filename");
        let blob: Blob = res.body as Blob;
        let dLink = document.createElement("a");
        dLink.download = filename || "";
        dLink.href = window.URL.createObjectURL(blob);
        dLink.click();
      });
    }
    else {
      this.invalid = true;
    }
  }
}
