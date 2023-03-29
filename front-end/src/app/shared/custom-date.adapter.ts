import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
/** Adapts the native JS Date for use with cdk-based components that work with dates. */
export class CustomDateAdapter extends NativeDateAdapter {
  getFirstDayOfWeek(): number {
    if(this.locale === 'it') {
      return 1;
    }

    return 0;
  }
}
