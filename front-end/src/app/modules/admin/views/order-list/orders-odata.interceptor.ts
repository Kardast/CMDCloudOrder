import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { OrdersStoreService } from './orders.store.service';
import { nameof } from 'app/shared/utils/nameof.utils';
import { GetOrdersQuery } from 'app/common/clients/api.clients';
import { environment } from 'environments/environment';

@Injectable()
export class OrdersOdataInterceptor implements HttpInterceptor {
  constructor(private ordersStoreService: OrdersStoreService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!(req.url.endsWith(`${environment.baseUrl}/api/orders/odata`) && req.params.get(nameof<GetOrdersQuery>('computeDurations')))) {
      return next.handle(req);
    }

    return next.handle(req)
      .pipe(
        tap(event => {
          if (event.type === 4) {
            this.ordersStoreService.orders$.next(event.body);
          }
        }));
  }
}
