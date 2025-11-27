import { Component } from '@angular/core';
import { Booking, BookingStatus } from '../../models';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss',
})
export class MyBookingsComponent {
  bookings: Booking[] = [];
  isLoading = true;
  errorMessage = '';
  BookingStatus = BookingStatus;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data.map(b => ({
          ...b,
          statusText: this.getStatusText(b.status)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load booking history';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: number): string {
    return BookingStatus[status]; // converts 0 -> "Pending", etc.
}
}
