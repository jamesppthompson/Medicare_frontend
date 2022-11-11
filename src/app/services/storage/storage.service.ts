import { Injectable } from '@angular/core';
import { IMedicareMagicianProfile } from 'src/app/models/medicare-magician-profile.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clearStorage() {
    window.localStorage.clear();
  }

  saveAccessToken(accessToken: string) {
    window.localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken() {
    return window.localStorage.getItem('accessToken');
  }

  saveUserId(userId: string) {
    window.localStorage.setItem('userId', userId);
  }

  getUserId() {
    return window.localStorage.getItem('userId');
  }

  removeUserId() {
    window.localStorage.removeItem('userId');
  }

  removeAccessToken() {
    window.localStorage.removeItem('accessToken');
  }

  saveMedicareMagicianProfile(
    medicareMagicianProfile: IMedicareMagicianProfile
  ) {
    window.localStorage.setItem(
      'medicareMagicianProfile',
      JSON.stringify(medicareMagicianProfile)
    );
  }

  getMedicareMagicianProfile() {
    const saveMedicareMagicianProfile = window.localStorage.getItem(
      'medicareMagicianProfile'
    );
    if (saveMedicareMagicianProfile) {
      try {
        return JSON.parse(saveMedicareMagicianProfile);
      } catch (err) {
        return null;
      }
    }

    return null;
  }

  removeMedicareMagicianProfile() {
    window.localStorage.removeItem('medicareMagicianProfile');
  }
}
