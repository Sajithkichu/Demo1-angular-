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
  name = '';
  phone = '';
  doctor = '';
  date = '';
  selectedSlot = '';
  selectedPeriod = '';
  doctorUnavailableMessage = '';
  
  nameError = '';
  phoneError = '';
  doctorError = '';
  slotError = '';
  generalErrorMessage = '';
  successMessage = '';
  showMessage = false;

  doctors = ['Dr.Rahul', 'Dr.Vishnu', 'Dr.Midhun', 'Dr.Devika', 'Dr.Ancy'];

  timeSlots: { [key: string]: string[] } = {
    Morning: ['8:00 - 8:30', '8:30 - 9:00', '9:00 - 9:30', '9:30 - 10:00', '10:00 - 10:30'],
    Evening: ['5:00 - 5:30', '5:30 - 6:00', '6:00 - 6:30', '6:30 - 7:00', '7:00 - 7:30', '7:30 - 8:00', '8:00 - 8:30', '8:30 - 9:00']
  };

  bookings: any[] = [];
  bookedSlots: { doctor: string, date: string, period: string, seatId: string, slot?: string, user?: { name: string, phone: string } }[] = [];

  ngOnInit() {
    this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    this.bookedSlots = JSON.parse(localStorage.getItem('bookedSlots') || '[]');
  }

  isDoctorAvailable(doctor: string, date: string, period: string): boolean {
    return this.bookedSlots.filter(s => s.doctor === doctor && s.date === date && s.period === period).length < this.timeSlots[period].length;
  }

  // Check if the phone number is already associated with a booking
  isPhoneAlreadyBooked(phone: string): boolean {
    return this.bookings.some(b => b.phone === phone);
  }

  isSlotBooked(doctor: string, date: string, period: string, seatId: string): boolean {
    return this.bookedSlots.some(s => s.doctor === doctor && s.date === date && s.period === period && s.seatId === seatId);
  }

  getSlotUser(doctor: string, date: string, period: string, seatId: string): string | null {
    const slot = this.bookedSlots.find(s => s.doctor === doctor && s.date === date && s.period === period && s.seatId === seatId);
    return slot ? slot.user?.name || null : null;
  }

  selectSlot(period: string, slot: string, seatId: string) {
    if (!this.isSlotBooked(this.doctor, this.date, period, seatId)) {
      this.selectedPeriod = period;
      this.selectedSlot = seatId;
      this.slotError = '';
    }
  }

  submitForm() {
    this.clearErrors();

    if (!this.validateForm()) return;

    const booking = {
      name: this.name,
      phone: this.phone,
      doctor: this.doctor,
      date: this.date,
      period: this.selectedPeriod,
      slot: this.selectedSlot
    };

    this.bookings.push(booking);
    this.bookedSlots.push({
      doctor: this.doctor,
      date: this.date,
      period: this.selectedPeriod,
      seatId: this.selectedSlot,
      slot: this.selectedSlot,
      user: { name: this.name, phone: this.phone }
    });

    localStorage.setItem('bookings', JSON.stringify(this.bookings));
    localStorage.setItem('bookedSlots', JSON.stringify(this.bookedSlots));

    this.successMessage = 'Booking Successful!';
    this.showMessage = true;

    this.clearForm();

    setTimeout(() => this.showMessage = false, 5000);
  }

  // Check if all slots are booked for a given doctor, date, and period
  isAllSlotsBooked(doctor: string, date: string, period: string): boolean {
    const totalSlots = this.timeSlots[period] || [];
    const booked = this.bookedSlots.filter(s => s.doctor === doctor && s.date === date && s.period === period);
    return booked.length >= totalSlots.length;
  }

  isDateFullyBooked(date: string): boolean {
    const bookedDates = this.bookedSlots.filter(b => b.date === date);
    return bookedDates.length === this.doctors.length * this.timeSlots['Morning'].length + this.doctors.length * this.timeSlots['Evening'].length;
  }

  validateForm(): boolean {
    let isValid = true;

    // Name validation
    if (!this.name) {
      this.nameError = 'Name is required.';
      isValid = false;
    }

    // Phone validation
    if (!this.phone) {
      this.phoneError = 'Phone number is required.';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(this.phone)) {
      this.phoneError = 'Phone must be a 10-digit number.';
      isValid = false;
    } else if (this.isPhoneAlreadyBooked(this.phone)) {
      this.phoneError = 'This phone number is already associated with a booking.';
      isValid = false;
    }

    // Doctor validation
    if (!this.doctor) {
      this.doctorError = 'Please select a doctor.';
      isValid = false;
    } else if (!this.isDoctorAvailable(this.doctor, this.date, this.selectedPeriod)) {
      this.doctorError = 'This doctor is not available on the selected date and period.';
      isValid = false;
      this.doctorUnavailableMessage = 'Sorry! The doctor is not available at the selected time. Please choose another slot.';
    }

    // Date validation
    if (!this.date) {
      isValid = false;
    } else if (this.isDateFullyBooked(this.date)) {
      this.generalErrorMessage = 'Sorry! The selected date is fully booked.';
      isValid = false;
    }

    // Slot validation
    if (!this.selectedSlot) {
      this.slotError = 'Please select a slot.';
      isValid = false;
    }

    return isValid;
  }

  clearForm() {
    this.name = '';
    this.phone = '';
    this.doctor = '';
    this.date = '';
    this.selectedSlot = '';
    this.selectedPeriod = '';
    this.doctorUnavailableMessage = '';
  }

  clearErrors() {
    this.nameError = '';
    this.phoneError = '';
    this.doctorError = '';
    this.slotError = '';
    this.generalErrorMessage = '';
    this.doctorUnavailableMessage = '';
  }

  isDoctorDateBooked(doctor: string, date: string, period: string): boolean {
    return this.bookedSlots.some(s => s.doctor === doctor && s.date === date && s.period === period);
  }

  // View All Bookings
  viewAllBookings() {
    // You can navigate to a new route or display the bookings in a modal or new page
    console.log('All bookings:', this.bookings);
    alert('All bookings are logged in the console!');
  }
}
