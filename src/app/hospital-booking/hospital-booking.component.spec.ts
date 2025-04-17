import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalBookingComponent } from './hospital-booking.component';
import { By } from '@angular/platform-browser';

describe('HospitalBookingComponent', () => {
  let component: HospitalBookingComponent;
  let fixture: ComponentFixture<HospitalBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalBookingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form when required fields are missing', () => {
    component.name = '';
    component.phone = '';
    component.doctor = '';
    component.date = '';
    component.selectedSlot = '';

    fixture.detectChanges();

    const isValid = component.validateForm();
    expect(isValid).toBeFalse();
  });

  it('should validate and allow booking with proper input', () => {
    component.name = 'John Doe';
    component.phone = '1234567890';
    component.doctor = 'Dr. Rahul';
    component.date = '2025-04-30';
    component.selectedSlot = 'seat-1';

    fixture.detectChanges();

    const isValid = component.validateForm();
    expect(isValid).toBeTrue();
  });

  it('should add booking and save to localStorage on valid submit', () => {
    component.name = 'Jane Doe';
    component.phone = '9876543210';
    component.doctor = 'Dr. Midhun';
    component.date = '2025-04-30';
    component.selectedSlot = 'seat-2';

    const initialBookings = component.bookings.length;
    component.submitForm();

    fixture.detectChanges();

    const updatedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    expect(updatedBookings.length).toBeGreaterThan(initialBookings);
    expect(component.successMessage).toContain('Booking Successful');
  });

  it('should prevent duplicate booking with same name and phone', () => {
    component.name = 'Alex';
    component.phone = '1112223333';
    component.doctor = 'Dr. Devika';
    component.date = '2025-04-30';
    component.selectedSlot = 'seat-3';
    component.submitForm();

    fixture.detectChanges();

    component.name = 'Alex';
    component.phone = '1112223333';
    component.doctor = 'Dr. Devika';
    component.date = '2025-04-30';
    component.selectedSlot = 'seat-4';
    component.submitForm();

    fixture.detectChanges();

    const isValid = component.validateForm();
    expect(isValid).toBeFalse();
    expect(component.nameError).toBe('Already used');
    expect(component.phoneError).toBe('Already used');
  });

  it('should select a valid time slot', () => {
    component.doctor = 'Dr. Vishnu';
    component.date = '2025-04-30';
    component.selectSlot('Morning', '8:30 - 9:00', 'seat-0');

    fixture.detectChanges();

    expect(component.selectedSlot).toBe('seat-0');
    expect(component.selectedPeriod).toBe('Morning');
  });

  it('should not allow booking if all slots are taken for a doctor on a date', () => {
    const allSlots = [...component.timeSlots['Morning'], ...component.timeSlots['Evening']];
    component.doctor = 'Dr. Ancy';
    component.date = '2025-04-30';

    // Simulate all slots booked
    allSlots.forEach((slot, index) => {
      const period = index < component.timeSlots['Morning'].length ? 'Morning' : 'Evening';
      component.bookedSlots.push({
        doctor: 'Dr. Ancy',
        date: '2025-04-30',
        slot: slot,
        seatId: `seat-${index}`,
        period: period
      });
    });

    fixture.detectChanges();

    // Check both periods
    const resultMorning = component.isDoctorDateBooked('Dr. Ancy', '2025-04-30', 'Morning');
    const resultEvening = component.isDoctorDateBooked('Dr. Ancy', '2025-04-30', 'Evening');

    expect(resultMorning).toBeTrue();
    expect(resultEvening).toBeTrue();
  });

  it('should disable slot when already booked', () => {
    component.doctor = 'Dr. Devika';
    component.date = '2025-04-30';
    component.selectedSlot = 'seat-1';

    component.bookedSlots.push({
      doctor: 'Dr. Devika',
      date: '2025-04-30',
      slot: '8:00 - 8:30',
      seatId: 'seat-1',
      period: 'Morning'
    });

    fixture.detectChanges();

    const slotButton = fixture.debugElement.query(By.css('button[disabled]'));
    expect(slotButton).toBeTruthy();
  });
});
