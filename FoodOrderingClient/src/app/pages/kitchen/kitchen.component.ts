import { Component, OnInit, signal } from '@angular/core';
import { Order } from '../../interfaces/order';
import { DatePipe } from '@angular/common';
import { firstValueFrom, Subscription } from 'rxjs';
import { RealtimeClientService } from '../../services/realtime-client.service';
import { HttpClient } from '@angular/common/http'
import { OrderState } from '../../order-state';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [
    DatePipe,
  ],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.css'
})
export class KitchenComponent implements OnInit {

  public orders = signal<Order[]>([]);
  public orderSubscription!: Subscription;
  foodStates = ['Ordered', 'Preparing', 'AwaitingDelivery', 'Completed'];

  constructor(
    private readonly realtime: RealtimeClientService,
    private readonly httpClient: HttpClient) {

    }

  async ngOnInit() {
    // this.realtime.connect();
    let existingOrders = await firstValueFrom(
      this.httpClient.get<Array<Order>>('http://localhost:4200/api/Kitchen/GetExistingOrders'));
    this.orders.set([...existingOrders]);
    this.orderSubscription = this.realtime.ordersUpdated.subscribe(x => this.orders.set([...x]));
  }

  async updateState(id: number, $event: Event) {
    let value = ($event.target as HTMLSelectElement)?.value; // Get the text from the control
    await this.realtime.updateFoodItem(id, value as OrderState); // Set the new enum value
  }

}
