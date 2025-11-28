import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';

import { 
  ApiResponse, 
  LoginDto, 
  RegisterDto, 
  TokenResponse, 
  UserRole 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  register(data: RegisterDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/register`, data);
  }

  login(credentials: LoginDto): Observable<ApiResponse<TokenResponse>> {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setTokens(response.data);
            this.loadUserFromToken();
          }
        })
      );
  }

  logout(): Observable<any> {
  const refreshToken = this.getRefreshToken();
  const accessToken = this.getAccessToken();

  return this.http.post(
      `${this.API_URL}/logout`,
      { refreshToken },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`
        })
      }
    )
    .pipe(
      tap(() => {
        this.clearTokens();
        this.currentUserSubject.next(null);
      })
    );
}


  refreshToken(): Observable<ApiResponse<TokenResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<TokenResponse>>(
      `${this.API_URL}/refresh-token`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setTokens(response.data);
          this.loadUserFromToken();
        }
      })
    );
  }

  private setTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch {
      return false;
    }
  }

  getUserRole(): UserRole | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === UserRole.Admin;
  }

  isCustomer(): boolean {
    return this.getUserRole() === UserRole.Customer;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  private loadUserFromToken(): void {
    const token = this.getAccessToken();
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const user = {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
      this.currentUserSubject.next(user);
    } catch {
      this.currentUserSubject.next(null);
    }
  }
}