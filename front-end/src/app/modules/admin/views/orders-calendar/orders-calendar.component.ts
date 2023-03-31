import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import itLocale from '@fullcalendar/core/locales/it';
import enGbLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TranslocoService } from '@ngneat/transloco';
import { OrderClient } from 'app/core/services/api.service';
import { Observable } from 'rxjs';
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

  constructor(private translocoService: TranslocoService, private orderClient: OrderClient) {
    this.calendarOptions = this.createCalendarOptions();
    this.orderDate$ = orderClient.list()
  }

  ngOnInit() {
    this.orderDate$.subscribe((orders: Order[]) => {
      let dateType: string;
      switch (this.stage) {
        case 'cutting':
          dateType = 'cuttingDate';
          break;
        case 'preparation':
          dateType = 'preparationDate';
          break;
        case 'bending':
          dateType = 'bendingDate';
          break;
        case 'assembly':
          dateType = 'assemblyDate';
          break;
      }
      let events = this.generateEvents(orders, dateType)
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEventSource(events);
    });
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