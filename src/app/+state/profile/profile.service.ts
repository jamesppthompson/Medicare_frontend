import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileRestService } from '../../services/profile-rest/profile-rest.service';
import { IMedicareMagicianProfile } from '../../models/medicare-magician-profile.model';
import { StorageService } from '../../services/storage/storage.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly loadedSub$ = new BehaviorSubject<boolean>(false);
  public readonly loaded$ = this.loadedSub$.asObservable();

  private readonly loadingSub$ = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSub$.asObservable();

  private readonly medicareMagicianProfileSub$ =
    new BehaviorSubject<IMedicareMagicianProfile | null>(null);

  public readonly medicareMagicianProfile$ =
    this.medicareMagicianProfileSub$.asObservable();

  constructor(
    private readonly profileRestService: ProfileRestService,
    private readonly storageService: StorageService
  ) {}

  loadProfile(hardReload = false) {
    if (
      this.loadedSub$.value === false &&
      (hardReload === true || this.loadedSub$.value === false)
    ) {
      this.loadedSub$.next(false);
      this.loadingSub$.next(true);
      this.profileRestService
        .getProfile()
        .pipe(
          finalize(() => {
            this.loadingSub$.next(false);
          })
        )
        .subscribe(
          (getMedicareMagicianProfileSucRes) => {
            this.storageService.saveMedicareMagicianProfile(
              getMedicareMagicianProfileSucRes
            );
            this.medicareMagicianProfileSub$.next(
              getMedicareMagicianProfileSucRes
            );
            this.loadedSub$.next(true);
            this.loadingSub$.next(false);
          },
          (getMedicareMagicianProfileErrRes) => {}
        );
    }
  }

  reset() {
    this.loadedSub$.next(false);
    this.loadingSub$.next(false);
    this.medicareMagicianProfileSub$.next(null)
  }
}
