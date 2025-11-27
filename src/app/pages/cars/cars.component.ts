import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Car } from '../../models';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss',
})
export class CarsComponent implements OnInit {
  searchForm: FormGroup;
  cars: Car[] = [];
  loading = false;
  searched = false;
  errorMessage = '';
  minDate = new Date().toISOString().split('T')[0];
  categories = ['All', 'Hatchback', 'Sedan', 'MPV', 'SUV'];
  selectedCategory = 'All';
  filteredCars: Car[] = [];

  constructor(
    private fb: FormBuilder,
    private carService: CarService
  ) {
    this.searchForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Set default dates (today + 1 week)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    this.searchForm.patchValue({
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0]
    });

    this.searchCars();
  }

  searchCars() {
    this.loading = true;
    this.carService.getAllCars().subscribe({
      next: (cars: Car[]) => {
        this.cars = cars;
        this.applyFilter();   // ✅ Important
      },
      error: () => this.loading = false,
      complete: () => this.loading = false
    });
  }

  selectCategory(category: string) {
  this.selectedCategory = category;
  this.applyFilter();
}

applyFilter() {
  if (this.selectedCategory === 'All') {
    this.filteredCars = this.cars;
  } else {
    this.filteredCars = this.cars.filter(
      c => c.type.toLowerCase() === this.selectedCategory.toLowerCase()
    );
  }
}
  //   if (this.searchForm.valid) {
  //     this.loading = true;
  //     this.searched = true;

  //     const { startDate, endDate } = this.searchForm.value;

  //     this.carService.getAvailableCars(new Date(startDate), new Date(endDate))
  //       .subscribe({
  //         next: (response) => {
  //           this.cars = response || [];
  //           this.loading = false;
  //         },
  //         error: () => {
  //           this.loading = false;
  //         }
  //       });
  //   }
  // }
}
