
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DoctorService } from '../../core/services/doctor-service/doctor-service';

@Component({
    selector: 'app-doctor-add-dialog',
    templateUrl: './doctor-add-dialog.component.html',
    styleUrls: ['./doctor-add-dialog.component.scss'],
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDialogModule, MatCheckboxModule]
})
export class DoctorAddDialogComponent {
    private ref = inject<MatDialogRef<DoctorAddDialogComponent>>(MatDialogRef);
    private doctorService = inject(DoctorService);
    doctorForm: FormGroup;
    availabilities = [
        {key:'9:00 AM - 10:00 AM', value: '9:00-10:00'},
        {key:'10:00 AM - 11:00 AM', value: '10:00-11:00'},
        {key:'11:00 AM - 12:00 PM', value: '11:00-12:00'},
        {key:'12:00 PM - 1:00 PM', value: '12:00-1:00'}
    ];
    

    specializations = [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Pediatrician',
        'Orthopedic',
        'Gynecologist',
        'Psychiatrist',
        'Dentist',
        'Ophthalmologist',
        'ENT Specialist',
        'Urologist',
        'Oncologist',
        'Gastroenterologist',
        'General Physician'
    ];


    constructor(private fb: FormBuilder) {
        this.doctorForm = this.fb.group({
            name: [''],
            specialization: [''],
            email: [''],
            password: [''],
            mobile: [''],
            availabilities: this.fb.group({
                '9:00-10:00': [false],
                '10:00-11:00': [false],
                '11:00-12:00': [false],
                '12:00-1:00': [false]
            })
        });
    }
    //build the dialog template
    //make the reactive form 
    //wire up event listeners 
    //style the dialog 
    //call the api to save the doctor
    onSave() {
        // TODO: Implement save logic
        const doctorData = {
            name: this.doctorForm.value.name,
            email: this.doctorForm.value.email,
            phone: this.doctorForm.value.mobile,
            password: this.doctorForm.value.password,
            specialty: this.doctorForm.value.specialization,
            checkedTimes: Object.keys(this.doctorForm.value.availabilities)
                .filter(key => this.doctorForm.value.availabilities[key])
        };
        console.log(this.doctorForm.value);
        this.doctorService.addDoctor(doctorData).subscribe((res) => {
            console.log('Doctor added successfully', res);
            this.ref.close(res);
        });
    }

// http://localhost:8080/doctor/save/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTM1NzU2NCwiZXhwIjoxNzU5OTYyMzY0fQ.UNHRRklcbS02a1mreTP3ymvE5791sizoRrvAVbF1zXA
// { "name": "test9", "email": "co@hotmail.com", "phone": "4448598734", "password": "summer88", "specialty": "gynecologist", "checkedTimes": ["09:00-10:00", "10:00-11:00"] }
close() { this.ref.close(null); }

}
