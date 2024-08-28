import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { Order } from '../interfaces/order';
import { Observable, Subject } from 'rxjs';
import { OrderState } from '../order-state';
import { FoodRequest } from '../interfaces/food-request';
@Injectable({
  providedIn: 'root'
})
export class RealtimeClientService {
  private hubConnection?: signalR.HubConnection;
  private pendingFoodUpdatedSubject = new Subject<Order[]>
  private ordersUpdated: Observable<Order[]> = this.pendingFoodUpdatedSubject.asObservable();
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5215")
      .build();

      this.hubConnection
        .start()
        .then(() => console.log('Connected to SignlarR hub'))
        .catch(error => console.error("Error connecting to SignalR hub:", error));

      this.hubConnection
        .on('PendingFoodUpdated', (orders: Order[]) => {
          this.pendingFoodUpdatedSubject.next(orders);
        })
   }

   async orderFoodItem(foodId: number, tableNumber: number) {
    console.log(`ordering ${foodId} at table ${tableNumber}`);
    await this.hubConnection?.invoke('OrderFoodItem', {
      foodId,
      tableNumber
    } as FoodRequest)
   }

   async updateFoodItem(orderId: number, state: OrderState) {
    await this.hubConnection?.invoke('UpdateFoodItem', orderId, state)
   }
}
