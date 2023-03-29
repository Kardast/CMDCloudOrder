import { Component, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import itLocale from '@fullcalendar/core/locales/it';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-orders-calendar',
  templateUrl: './orders-calendar.component.html',
  styleUrls: ['./orders-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdersCalendarComponent {
  calendarOptions: CalendarOptions;

  constructor(
    private translocoService: TranslocoService) {
    this.calendarOptions = this.createCalendarOptions();
  }

  createCalendarOptions(): CalendarOptions {
    return {
      plugins: [dayGridPlugin],
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      initialView: 'dayGridMonth',
      aspectRatio: 3,
      navLinks: true,
      navLinkDayClick: 'week',
      weekNumbers: true,
      dayMaxEvents: true,
      eventTextColor: 'white',
      locales: [enGbLocale, itLocale], // it isn`t very cool that we should import all needed languages manually, but it`s how it works
      locale: this.translocoService.getActiveLang(),
    } as CalendarOptions;
  }
}