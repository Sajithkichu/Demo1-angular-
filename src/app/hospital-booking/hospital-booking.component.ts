import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hospital-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hospital-booking.component.html',
  styleUrls: ['./hospital-booking.component.css']
})
export class HospitalBookingComponent implements OnInit {
  name: string = '';
  phone: string = '';
  doctor: string = '';
  date: string = '';
  selectedSlot: string = '';
  selectedPeriod: string = '';
  
  // New properties for error handling
  nameError: string = '';
  phoneError: string = '';
  doctorError: string = '';
  dateError: string = '';
  periodError: string = '';
  slotError: string = '';

  doctors: string[] = ['Dr.Rahul', 'Dr.Vishnu', 'Dr.Midhun', 'Dr.Devika', 'Dr.Ancy'];

  timeSlots: { [key: string]: string[] } = {
    Morning: ['8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00', '10:00 - 10:30'],
    Evening: ['5:00 - 5:30', '5:30 - 6:00', '6:00 - 6:30', '6:30 - 7:00', '7:00 - 7:30', '7:30 - 8:00', '8:00 - 9:30', '9:30 - 10:00']
  };

  bookedSlots: string[] = [];
  successMessage: string = '';
  showMessage: boolean = false;

  ngOnInit() {
    const saved = localStorage.getItem('bookedSlots');
    this.bookedSlots = saved ? JSON.parse(saved) : [];
  }

  isBooked(slot: string): boolean {
    const key = `${this.date}-${slot}`;
    return this.bookedSlots.includes(key);
  }

  selectSlot(period: string, slot: string) {
    if (!this.isBooked(slot)) {
      this.selectedPeriod = period;
      this.selectedSlot = slot;
      this.slotError = ''; // Reset slot error when selecting a new slot
    }
  }

  validateForm(): boolean {
    let isValid = true;

    // Reset errors
    this.nameError = this.phoneError = this.doctorError = this.dateError = this.periodError = this.slotError = '';

    // Validate each field
    if (!this.name) {
      this.nameError = 'Name is required';
      isValid = false;
    }

    if (!this.phone) {
      this.phoneError = 'Phone is required';
      isValid = false;
    }

    if (!this.doctor) {
      this.doctorError = 'Doctor selection is required';
      isValid = false;
    }

    if (!this.date) {
      this.dateError = 'Date is required';
      isValid = false;
    }

    if (!this.selectedPeriod) {
      this.periodError = 'Time period is required';
      isValid = false;
    }

    if (!this.selectedSlot) {
      this.slotError = 'Time slot is required';
      isValid = false;
    }

    return isValid;
  }

  submitForm() {
    if (!this.validateForm()) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const bookingKey = `${this.date}-${this.selectedSlot}`;
    this.bookedSlots.push(bookingKey);
    localStorage.setItem('bookedSlots', JSON.stringify(this.bookedSlots));

    // Display success message after submission
    this.successMessage = 'Booking Successful!';
    this.showMessage = true;

    // Clear the form after submission
    this.clearForm();

    // Auto-hide the success message after 5 seconds
    setTimeout(() => {
      this.showMessage = false;
    }, 5000);
  }

  clearForm() {
    this.name = '';
    this.phone = '';
    this.doctor = '';
    this.date = '';
    this.selectedSlot = '';
    this.selectedPeriod = '';
  }
}
