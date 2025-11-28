import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingDto } from '../models';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly API_URL = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(booking: BookingDto): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/submit-booking`, booking);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/my`);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.API_URL}/pending`);
  }

  updateBookingStatus(bookingId: number, status: string, messageToCustomer?: string): Observable<string> {
    return this.http.put<string>(`${this.API_URL}/${bookingId}/status`, 
      { status, messageToCustomer },
      { responseType: 'text' as 'json' }
    );
  }
}
