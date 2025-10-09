import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Form } from '@angular/forms';
import { DoctorService } from './doctor.service';


@Component({
    selector: 'app-doctor-profile',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './doctor-profile.component.html',
    styleUrls: ['./doctor-profile.component.scss']
})
export class DoctorProfileComponent implements OnInit {

    // Format a time range string like '08:00-09:00' to '8:00 AM – 9:00 AM'
    formatTimeRange(range: string): string {
        const [start, end] = range.split('-');
        return `${this.formatTime(start)} – ${this.formatTime(end)}`;
    }

    // Format a single time string like '08:00' to '8:00 AM'
    private formatTime(time: string): string {
        const [hourStr, minute] = time.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;
        return `${hour}:${minute} ${ampm}`;
    }

    // All possible available times (from screenshot)
    readonly ALL_AVAILABLE_TIMES: string[] = [
        '08:00-09:00',
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
        '17:00-18:00',
    ];


    profile: any = signal<any>({});
    form!: FormGroup;

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private doctorService = inject(DoctorService);
    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        // 1) Build an empty form first so template bindings are safe
        this.form = this.fb.group({
            email: [''],
            phone: [''],
            name: [''],
            specialty: [''],
            availableTimes: this.fb.group({})
        });

        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token') || '';
            this.doctorService.getProfile(token).subscribe(data => {
                this.profile.set({
                    id: data.id,
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    specialty: data.specialty,
                    availableTimes: data.availableTimes || []
                });
                const checkedTimes = new Set(data.availableTimes || []);

                this.form.patchValue({
                    email: this.profile().email,
                    phone: this.profile().phone,
                    name: this.profile().name,
                    specialty: this.profile().specialty,
                });

                // Always add controls for ALL_AVAILABLE_TIMES
                const atimesGroup = this.form.get('availableTimes') as FormGroup;
                Object.keys(atimesGroup.controls).forEach(key => atimesGroup.removeControl(key));
                this.ALL_AVAILABLE_TIMES.forEach(time => {
                    atimesGroup.addControl(time, new FormControl(checkedTimes.has(time)));
                });
            });
        }
    }

    getAvailableTimeControlByKey(key: string): FormControl {
        const ctrl = (this.form.get('availableTimes') as FormGroup).get(key);
        if (!ctrl) throw new Error(`No FormControl for available time: ${key}`);
        return ctrl as FormControl;
    }
    onUpdate() {
        // Collect form values
        const formValue = this.form.value;
        // availableTimes is a FormGroup, convert to array of selected times
        const availableTimesGroup = formValue.availableTimes;
        const selectedTimes = Object.keys(availableTimesGroup).filter(
            key => availableTimesGroup[key]
        );

        // Build the payload (include id)
        const payload = {
            id: this.profile()?.id,
            email: formValue.email,
            phone: formValue.phone.replace(/-/g, ""),
            name: formValue.name,
            specialty: formValue.specialty,
            availableTimes: selectedTimes
        };

        this.doctorService.updateProfile(payload).subscribe({
            next: (res) => {
                console.log('Profile updated:', res);
            },
            error: (err) => {
                console.error('Update failed:', err);
            }
        });
    }

    // No longer needed: getAvailableTimeControl and availableTimesFormArray
}
