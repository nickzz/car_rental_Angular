import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Car } from '../../models';
import { CarService } from '../../services/car.service';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  car: Car | null = null;
  loading = true;
  submitting = false;
  errorMessage = '';
  estimatedPrice: number | null = null;
  rentalDays = 0;
  minDate = new Date().toISOString().split('T')[0];


  step: number = 1;

  notes: string = '';
  startDate!: string;
  endDate!: string;

  availableCars: Car[] = [];
  selectedCar!: Car;

  totalDays: number = 0;
  totalPrice: number = 0;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: [''],
      agreementAccepted: [false, Validators.requiredTrue]
    });
  }

  // STEP 1 - Search available cars
  searchCars() {
    this.errorMessage = '';

    if (!this.notes || !this.startDate || !this.endDate) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (end <= start) {
      this.errorMessage = 'Return date must be after pickup date';
      return;
    }

    this.isLoading = true;

    this.carService.getAvailableCars(start, end).subscribe({
      next: (cars) => {
        this.availableCars = cars;
        this.step = 2;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load available cars';
        this.isLoading = false;
      }
    });
  }

  // STEP 2
  selectCar(car: Car) {
    this.selectedCar = car;
    this.calculateTotal();
    this.step = 3;
  }

  calculateTotal() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diff = end.getTime() - start.getTime();
    this.totalDays = Math.ceil(diff / (1000 * 3600 * 24));
    this.totalPrice = this.totalDays * this.selectedCar.pricePerDay;
  }

  // FINAL
  confirmBooking() {

    const bookingPayload = {
      notes: this.notes,
      startDate: new Date(this.startDate),
      endDate: new Date(this.endDate),
      carId: this.selectedCar.id
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.createBooking(bookingPayload).subscribe({
      next: (response) => {
        console.log('Booking Created:', response);
        alert('Booking successful!');
        this.isLoading = false;
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Booking failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  goBackToSearch() {
    this.step = 1;
  }

  goBackToCars() {
    this.step = 2;
  }

  ngOnInit() {
    // const carId = Number(this.route.snapshot.paramMap.get('id'));

    // // Get query params for dates if available
    // this.route.queryParams.subscribe(params => {
    //   if (params['startDate']) {
    //     this.bookingForm.patchValue({ startDate: params['startDate'] });
    //   }
    //   if (params['endDate']) {
    //     this.bookingForm.patchValue({ endDate: params['endDate'] });
    //   }
    // });

    // // Load car details
    // this.carService.getAllCars().subscribe({
    //   next: (response) => {
    //     this.car = response.find(c => c.id === carId) || null;
    //     this.loading = false;

    //     if (this.car && this.bookingForm.value.startDate && this.bookingForm.value.endDate) {
    //       this.calculatePrice();
    //     }
    //   },
    //   error: () => {
    //     this.loading = false;
    //   }
    // });
  }

  // calculatePrice() {
  //   const startDate = this.bookingForm.value.startDate;
  //   const endDate = this.bookingForm.value.endDate;

  //   if (startDate && endDate && this.car) {
  //     this.carService.getEstimatedPrice(
  //       this.car.id,
  //       new Date(startDate),
  //       new Date(endDate)
  //     ).subscribe({
  //       next: (response) => {
  //         this.estimatedPrice = response.estimatedPrice;
  //         const start = new Date(startDate);
  //         const end = new Date(endDate);
  //         this.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  //       }
  //     });
  //   }
  // }

  // onSubmit() {
  //   if (this.bookingForm.valid && this.car) {
  //     this.submitting = true;
  //     this.errorMessage = '';

  //     const bookingData = {
  //       carId: this.car.id,
  //       startDate: new Date(this.bookingForm.value.startDate),
  //       endDate: new Date(this.bookingForm.value.endDate),
  //       notes: this.bookingForm.value.notes,
  //       agreementAccepted: this.bookingForm.value.agreementAccepted
  //     };

  //     this.bookingService.createBooking(bookingData).subscribe({
  //       next: (response: any) => {
  //         if (response.success) {
  //           alert('Booking request submitted successfully! Please wait for admin approval.');
  //           this.router.navigate(['/my-bookings']);
  //         }
  //       },
  //       error: (error: any) => {
  //         this.errorMessage = error.error?.message || 'Failed to create booking';
  //         this.submitting = false;
  //       }
  //     });
  //   }
  // }

  // goBack() {
  //   this.router.navigate(['/cars']);
  // }
}
