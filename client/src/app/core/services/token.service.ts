import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'avalog_token';
  private readonly USER_KEY = 'avalog_user_id';
  private readonly EXPIRY_DAYS = 7;

  setToken(userId: string): string {
    const token = this.generateToken();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.EXPIRY_DAYS);

    // Rilevo se sono in http o https
    const isSecure = window.location.protocol === 'https:';
    const secureFlag = isSecure ? '; Secure' : '';

    // Salvo il token nel cookie
    document.cookie = `${this.TOKEN_KEY}=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict${secureFlag}`;
    document.cookie = `${this.USER_KEY}=${userId}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict;${secureFlag}`;

    console.info('Token savato per userId:', userId);

    return token;
  }

  getToken(): string | null {
    const token = this.getCookie(this.TOKEN_KEY);
    console.info('Token letto:', token);
    return token;
  }

  getUserId(): string | null {
    const userId = this.getCookie(this.USER_KEY);
    console.info('UserId letto:', userId);
    return userId;
  }

  clearToken(): void {
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${this.USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.info('Token cancellato');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    const userId = this.getUserId();
    const isValid = !!(token && userId);
    console.info('Token valido:', isValid);
    return isValid;
  }

  private generateToken(): string {
    //Genero un arrai di 32 valori
    const array = new Uint8Array(32);
    // Inserisco dei valori casuali
    crypto.getRandomValues(array);
    // Converto i valori da byte (0-255) a valori esadecimali a due cifre
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  private getCookie(name: string): string | null {
    const cookieString = document.cookie;
    if (!cookieString) return null;

    const cookies = cookieString.split(';');
    //console.log("COOKIES:", cookies.toString());

    for (const cookie of cookies) {
      const equalsIndex = cookie.trim().indexOf('=');

      //console.log('cookie:', cookie);
      //console.log('equalsIndex:', equalsIndex);

      if (equalsIndex > -1) {
        const key = cookie.trim().substring(0, equalsIndex);
        const value = cookie.trim().substring(equalsIndex + 1);

        //console.log('cookie key:', key);
        //console.log('cookie value:', value);

        if (key === name) {
          return value;
        }
      }
    }

    return null;
  }
}
