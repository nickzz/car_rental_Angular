import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Car } from '../../models';

@Component({
  selector: 'app-admin-cars',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-cars.html',
  styleUrl: './admin-cars.scss'
})
export class AdminCars implements OnInit {
  cars: Car[] = [];
  loading = false;
  updateForm: FormGroup;
  selectedCar: Car | null = null;
  showUpdateModal = false;
  submitLoading = false;
  successMessage = '';
  errorMessage = '';
  showCarModal = false;

  constructor(
    private carService: CarService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      type: ['', Validators.required],
      plateNo: ['', Validators.required],
      colour: [''],
      pricePerDay: [0, Validators.required],
      pricePerWeek: [0],
      pricePerMonth: [0]
    });
  }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars() {
    this.loading = true;
    this.carService.getAllCars().subscribe({
      next: (cars: Car[]) => {
        this.cars = cars;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load cars';
      },
      complete: () => this.loading = false
    });
  }

  openCreateModal() {
    this.selectedCar = null;
    this.updateForm.reset({
      brand: '', model: '', type: '', plateNo: '', colour: '', pricePerDay: 0, pricePerWeek: 0, pricePerMonth: 0
    });
    this.showCarModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openUpdateModal(car: Car) {
    this.selectedCar = car;
    this.updateForm.patchValue({
      brand: car.brand,
      model: car.model,
      type: car.type,
      plateNo: car.plateNo,
      colour: car.colour,
      pricePerDay: car.pricePerDay,
      pricePerWeek: car.pricePerWeek,
      pricePerMonth: car.pricePerMonth
    });
    this.showCarModal = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeCarModal() {
    this.showCarModal = false;
    this.selectedCar = null;
    this.updateForm.reset();
  }

  submitCar() {
    if (this.updateForm.invalid) return;

    this.submitLoading = true;
    const carData = this.updateForm.value;

    if (this.selectedCar) {
      // Update car
      this.carService.updateCar(this.selectedCar.id, carData).subscribe({
        next: (res: string) => {
          this.successMessage = res || 'Car updated successfully!';
          this.loadCars();
          this.closeCarModal();
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error: (err) => this.errorMessage = err?.error?.message || 'Failed to update car',
        complete: () => this.submitLoading = false
      });
    } else {
      // Create car
      this.carService.addCar(carData).subscribe({
        next: (res: string) => {
          this.successMessage = res || 'Car created successfully!';
          this.loadCars();
          this.closeCarModal();
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error: (err) => this.errorMessage = err?.error?.message || 'Failed to create car',
        complete: () => this.submitLoading = false
      });
    }
  }

  // openUpdateModal(car: Car) {
  //   this.selectedCar = car;
  //   this.updateForm.patchValue({
  //     brand: car.brand,
  //     model: car.model,
  //     type: car.type,
  //     plateNo: car.plateNo,
  //     colour: car.colour,
  //     pricePerDay: car.pricePerDay,
  //     pricePerWeek: car.pricePerWeek,
  //     pricePerMonth: car.pricePerMonth
  //   });
  //   this.showUpdateModal = true;
  //   this.successMessage = '';
  //   this.errorMessage = '';
  // }

  // closeUpdateModal() {
  //   this.showUpdateModal = false;
  //   this.selectedCar = null;
  //   this.updateForm.reset();
  // }

  // submitUpdate() {
  //   if (this.updateForm.invalid || !this.selectedCar) return;

  //   this.submitLoading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';

  //   const updatedCar = this.updateForm.value;
  //   this.carService.updateCar(this.selectedCar.id, updatedCar).subscribe({
  //     next: (res: string) => {
  //       console.log('Update response:', res);
  //       this.successMessage = res || 'Car updated successfully!';
  //       this.errorMessage = '';
  //       this.loadCars();
  //       setTimeout(() => this.closeUpdateModal(), 1500);
  //     },
  //     error: (err: any) => {
  //       console.error('Update error:', err);
  //       let errorMsg = 'Failed to update car';
  //       if (err?.error?.message) {
  //         errorMsg = err.error.message;
  //       } else if (err?.error?.errors && Array.isArray(err.error.errors)) {
  //         errorMsg = err.error.errors[0] || 'Failed to update car';
  //       } else if (typeof err?.error === 'string') {
  //         errorMsg = err.error;
  //       }
  //       this.errorMessage = errorMsg;
  //     },
  //     complete: () => this.submitLoading = false
  //   });
  // }

  deleteCar(car: Car) {
    if (!confirm(`Delete car ${car.brand} ${car.model}? This action cannot be undone.`)) {
      return;
    }

    this.carService.deleteCar(car.id).subscribe({
      next: (res: string) => {
        this.successMessage = res || 'Car deleted successfully!';
        this.errorMessage = '';
        this.loadCars();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err: any) => {
        console.error('Delete error:', err);
        let errorMsg = 'Failed to delete car';
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.error?.errors && Array.isArray(err.error.errors)) {
          errorMsg = err.error.errors[0] || 'Failed to delete car';
        } else if (typeof err?.error === 'string') {
          errorMsg = err.error;
        }
        this.errorMessage = errorMsg;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
