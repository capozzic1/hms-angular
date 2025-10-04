import { Component, effect, input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-doctors-list',
  imports: [MatCardModule,MatButtonModule],
  templateUrl: './doctors-list.html',
  styleUrl: './doctors-list.scss'
})
export class DoctorsList {
  public doctors = input<any[]>([]); // signal-based input
  @Output() deleteDoctor = new EventEmitter<string>();

  constructor() {
    effect(() => {
      console.log(this.doctors());
    });
  }

  onDelete(id: string) {
    this.deleteDoctor.emit(id);
  }
}
