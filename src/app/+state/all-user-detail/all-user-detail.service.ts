import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IUserFullDetail } from 'src/app/models/users-full-detail.model';
import { AdminRestService } from 'src/app/services/admin-rest/admin-rest.service';

@Injectable({
  providedIn: 'root',
})
export class AllUserDetailService {
  private readonly loadedSub$ = new BehaviorSubject<boolean>(false);
  public readonly loaded$ = this.loadedSub$.asObservable();

  private readonly loadingSub$ = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSub$.asObservable();

  private readonly errorSub$ = new BehaviorSubject<any>(null);
  public readonly error$ = this.loadingSub$.asObservable();

  private readonly allUserDetailSub$ = new BehaviorSubject<IUserFullDetail[]>(
    []
  );

  public readonly allUserDetail$ = this.allUserDetailSub$.asObservable();

  constructor(private readonly adminRestService: AdminRestService) {}

  loadAllUserDetails(hardReload = false) {
    if (
      this.loadedSub$.value === false &&
      (hardReload === true || this.loadedSub$.value === false)
    ) {
      this.loadedSub$.next(false);
      this.loadingSub$.next(true);
      this.errorSub$.next(null);

      this.adminRestService
        .getAllUserDetails()
        .pipe(
          finalize(() => {
            this.loadingSub$.next(false);
          })
        )
        .subscribe(
          (getAllUserDetailSucRes) => {
            this.allUserDetailSub$.next(getAllUserDetailSucRes || []);
            this.loadedSub$.next(true);
            this.loadingSub$.next(false);
          },
          (getAllUserDetailErrRes) => {
            this.loadedSub$.next(false);
            this.errorSub$.next(getAllUserDetailErrRes.error.message);
          }
        );
    }
  }
}
