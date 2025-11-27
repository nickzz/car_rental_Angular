import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../../../models';

@Component({
  selector: 'app-car-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './car-modal.component.html',
})
export class CarModalComponent implements OnInit {
  @Input() car: Car | null = null; // if null => Create, else Update
  @Input() visible: boolean = false;
  @Input() loading: boolean = false;
  @Input() successMessage: string = '';
  @Input() errorMessage: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Car>();

  carForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.carForm = this.fb.group({
      brand: [this.car?.brand || '', Validators.required],
      model: [this.car?.model || '', Validators.required],
      type: [this.car?.type || '', Validators.required],
      plateNo: [this.car?.plateNo || '', Validators.required],
      colour: [this.car?.colour || '', Validators.required],
      pricePerDay: [this.car?.pricePerDay || 0, [Validators.required, Validators.min(0)]],
      pricePerWeek: [this.car?.pricePerWeek || 0, [Validators.required, Validators.min(0)]],
      pricePerMonth: [this.car?.pricePerMonth || 0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.carForm.valid) {
      const carData = { ...this.carForm.value, id: this.car?.id };
      this.submit.emit(carData);
    }
  }

  onClose() {
    this.close.emit();
  }
}
