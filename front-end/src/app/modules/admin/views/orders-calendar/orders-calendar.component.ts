import { ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import itLocale from '@fullcalendar/core/locales/it';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TranslocoService } from '@ngneat/transloco';
import { OrderClient } from 'app/core/services/api.service';
import {  Observable, } from 'rxjs';
import { Order } from 'app/core/services/api.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-orders-calendar',
  templateUrl: './orders-calendar.component.html',
  styleUrls: ['./orders-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdersCalendarComponent {
  @Input() stage: string;

  calendarOptions: CalendarOptions;
  orderDate$ = new Observable<Order[]>
  @ViewChild("calendar") calendarComponent: FullCalendarComponent

  currentMonth: number;
  currentYear : number;

  constructor(private translocoService: TranslocoService, private orderClient: OrderClient, private cdr: ChangeDetectorRef) {
    this.calendarOptions = this.createCalendarOptions();
    this.currentMonth = new Date().getMonth() + 1;
    this.currentYear = new Date().getFullYear();
    this.orderDate$ = orderClient.getOrderByDate(this.currentMonth, this.currentYear)
  }

  ngAfterViewInit() {
    this.calendarComponent.getApi().on('datesSet', (info) => {
      const newMonth = info.view.currentStart.getMonth() + 1;
      const newYear = info.view.currentStart.getFullYear();
      if (newMonth !== this.currentMonth || newYear !== this.currentYear) {
        this.currentMonth = newMonth;
        this.currentYear = newYear;
        this.orderDate$ = this.orderClient.getOrderByDate(this.currentMonth, this.currentYear);
        this.orderDate$.subscribe((orders: Order[]) => {
          const dateType: string = this.getDateType(this.stage);
          const events = this.generateEvents(orders, dateType);
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
          this.cdr.detectChanges();
        });
      }
    });

    this.orderDate$.subscribe((orders: Order[]) => {
      const dateType: string = this.getDateType(this.stage);
      const events = this.generateEvents(orders, dateType);
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEventSource(events);
    });
  }

  getDateType(stage: string): string {
    switch (stage) {
      case 'cutting':
        return 'cuttingDate';
      case 'preparation':
        return 'preparationDate';
      case 'bending':
        return 'bendingDate';
      case 'assembly':
        return 'assemblyDate';
      default:
        return '';
    }
  }

  generateEvents(orders: Order[], dateType: string) {
    return orders.map((order: Order) => ({
      title: order.customer + " - " + order.orderNumber,
      start: new Date(order[dateType]),
      color: "blue",
    }));
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