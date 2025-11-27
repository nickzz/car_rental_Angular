import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'cars',
    loadComponent: () => import('./pages/cars/cars.component').then(m => m.CarsComponent)
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./pages/car-detail/car-detail.component').then(m => m.CarDetailComponent)
  },
  
  // Protected Routes (Require Login)
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [authGuard]
  },
  
  // Admin Routes (Require Admin Role)
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'cars',
        loadComponent: () => import('./pages/admin-cars/admin-cars').then(m => m.AdminCars)
      },
      // additional admin child routes (cars, bookings) can be added here
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/customer-dashboard/customer-dashboard').then(m => m.CustomerDashboard),
    canActivate: [authGuard]
  },
  
  // 404 Not Found
//   {
//     path: '**',
//     loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
//   }
];