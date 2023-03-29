import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if ( this._authService.user?.role == 'admin' )
      {
          return true;
      }

      // Redirect to the sign-in page with a redirectUrl param
      this._authService.signOut().subscribe();

      const redirectURL = state.url;
      const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);
      return of(urlTree);
    }
}