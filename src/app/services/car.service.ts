import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, PriceEstimate } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly API_URL = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) { }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.API_URL}/GetCars`);
  }


  getAvailableCars(startDate: Date, endDate: Date): Observable<Car[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<Car[]>(`${this.API_URL}/available`, { params });
  }


  getEstimatedPrice(carId: number, startDate: Date, endDate: Date): Observable<PriceEstimate> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<PriceEstimate>(`${this.API_URL}/${carId}/estimate`, { params });
  }

  addCar(car: Partial<Car>): Observable<string> {
    return this.http.post(`${this.API_URL}/AddCar`, car, { responseType: 'text' });
  }

  updateCar(id: number, car: Partial<Car>): Observable<string> {
    return this.http.put(`${this.API_URL}/UpdateCar/${id}`, car, { responseType: 'text' });
  }

  deleteCar(id: number): Observable<string> {
    return this.http.delete(`${this.API_URL}/RemoveCar/${id}`, { responseType: 'text' });
  }
}