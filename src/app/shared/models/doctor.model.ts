// doctor.model.ts
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availableTimes: string[];
}

export interface DoctorsResponse {
  doctors: Doctor[];
  message: string;
}

export interface DoctorData {
    name: string;
    email: string;
    phone: string;
    password: string;
    specialty: string;
    checkedTimes: string[];
}
