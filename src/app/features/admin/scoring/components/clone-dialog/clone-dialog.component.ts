import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Cloner la version</h2>
    <mat-dialog-content>
      <p>Version actuelle: <strong>{{ data.currentVersion }}</strong></p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nouvelle version</mat-label>
        <input matInput [(ngModel)]="newVersion" placeholder="Ex: 1.1.0">
        <mat-hint>Utilisez le versioning sémantique (ex: 1.0.0, 2.0.0-beta)</mat-hint>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary"
              [disabled]="!newVersion.trim()"
              (click)="confirm()">
        Cloner
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 1rem;
    }
  `]
})
export class CloneDialogComponent {
  private dialogRef = inject(MatDialogRef<CloneDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  newVersion = '';

  confirm(): void {
    if (this.newVersion.trim()) {
      this.dialogRef.close(this.newVersion.trim());
    }
  }
}
