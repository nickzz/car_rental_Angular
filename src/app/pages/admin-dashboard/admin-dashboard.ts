import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CarService } from '../../services/car.service';
import { Booking, Car, BookingDto } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  bookings: Booking[] = [];
  cars: Car[] = [];

  bookingForm: FormGroup;
  carForm: FormGroup;
  statusForm: FormGroup;
  editingCar: Car | null = null;
  selectedBooking: Booking | null = null;
  statusModalOpen = false;

  loadingBookings = false;
  loadingCars = false;
  updatingStatus = false;

  constructor(
    private bookingService: BookingService,
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      userId: ['', Validators.required],
      carId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: [''],
      agreementAccepted: [true]
    });

    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      type: ['', Validators.required],
      plateNo: ['', Validators.required],
      colour: [''],
      pricePerDay: [0, Validators.required],
      pricePerWeek: [0],
      pricePerMonth: [0]
    });

    this.statusForm = this.fb.group({
      status: ['Approved', Validators.required],
      messageToCustomer: ['']
    });
  }

  ngOnInit(): void {
    this.loadBookings();
    this.loadCars();
  }

  loadBookings() {
    this.loadingBookings = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings: Booking[]) => {
        this.bookings = bookings;
      },
      complete: () => this.loadingBookings = false
    });
  }

  loadCars() {
    this.loadingCars = true;
    this.carService.getAllCars().subscribe({
      next: (cars: Car[]) => {
        this.cars = cars;
      },
      complete: () => this.loadingCars = false
    });
  }

  openStatusModal(booking: Booking) {
    this.selectedBooking = booking;
    this.statusForm.reset({ status: 'Approved', messageToCustomer: '' });
    this.statusModalOpen = true;
  }

  closeStatusModal() {
    this.statusModalOpen = false;
    this.selectedBooking = null;
    this.statusForm.reset();
  }

  submitStatusUpdate() {
    if (!this.statusForm.valid || !this.selectedBooking) return;

    this.updatingStatus = true;
    const { status, messageToCustomer } = this.statusForm.value;

    this.bookingService.updateBookingStatus(this.selectedBooking.id, status, messageToCustomer)
      .subscribe({
        next: () => {
          this.closeStatusModal();
          this.loadBookings();
        },
        error: (err) => {
          console.error('Error updating booking status:', err);
          this.updatingStatus = false;
        },
        complete: () => this.updatingStatus = false
      });
  }

  // submitBooking() {
  //   if (this.bookingForm.invalid) return;
  //   const dto: BookingDto = {
  //     carId: Number(this.bookingForm.value.carId),
  //     startDate: new Date(this.bookingForm.value.startDate),
  //     endDate: new Date(this.bookingForm.value.endDate),
  //     notes: this.bookingForm.value.notes,
  //     agreementAccepted: true
  //   };

  //   // allow admin to set userId server-side if supported; here we just call createBooking
  //   this.bookingService.createBooking(dto).subscribe({
  //     next: () => {
  //       this.bookingForm.reset({ agreementAccepted: true });
  //       this.loadBookings();
  //     }
  //   });
  // }

  startEditCar(car: Car) {
    this.editingCar = car;
    this.carForm.patchValue(car as any);
  }

  cancelEditCar() {
    this.editingCar = null;
    this.carForm.reset();
  }

  saveCar() {
    if (this.carForm.invalid) return;
    const payload = this.carForm.value;
    if (this.editingCar) {
      this.carService.updateCar(this.editingCar.id, payload).subscribe(() => {
        this.cancelEditCar();
        this.loadCars();
      });
    } else {
      this.carService.addCar(payload).subscribe(() => {
        this.carForm.reset();
        this.loadCars();
      });
    }
  }

  deleteCar(car: Car) {
    if (!confirm('Delete this car?')) return;
    this.carService.deleteCar(car.id).subscribe(() => this.loadCars());
  }
}
