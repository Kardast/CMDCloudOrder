import { Component, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  text: string;
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<ConfirmDialogData>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.text = data.text;
  }

  confirm() {
    this.dialogRef.close(true);
  }

  abort() {
    this.dialogRef.close(false);
  }
}

export class ConfirmDialogData {
  text: string;
}
