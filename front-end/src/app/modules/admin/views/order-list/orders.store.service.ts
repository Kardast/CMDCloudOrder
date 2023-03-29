import { Injectable } from "@angular/core";
import { GetOrdersManagedPageDto } from "app/common/clients/api.clients";
import { ReplaySubject, Subject } from "rxjs";

@Injectable()
export class OrdersStoreService {
    public orders$: Subject<GetOrdersManagedPageDto> = new Subject<GetOrdersManagedPageDto>();
    public orderNumber$: ReplaySubject<string> = new ReplaySubject<string>();
}