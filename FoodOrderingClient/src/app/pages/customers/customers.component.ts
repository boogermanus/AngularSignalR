import { Component, OnInit, signal } from '@angular/core';
import { FoodItem } from '../../interfaces/food-item';
import { Order } from '../../interfaces/order';
import { firstValueFrom, Subscription } from 'rxjs';
import { RealtimeClientService } from '../../services/realtime-client.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  public availableFood = signal<Array<FoodItem>>([]);
  public activeOrders = signal<Array<Order>>([]);
  public activeOrdersSubscription?: Subscription;
  public tableNumber?: number;
  public showActiveOrders: boolean = false;


  constructor(
    private readonly realtime: RealtimeClientService,
    private readonly httpClient: HttpClient) {

  }

  async ngOnInit() {
    let food =
      await firstValueFrom<Array<FoodItem>>(
        this.httpClient.get<Array<FoodItem>>('http://localhost:5215/api/FoodItems/GetFoodItems')
      );

    this.availableFood.set([...food]);

    let orders =
      await firstValueFrom<Array<Order>>(
        this.httpClient.get<Array<Order>>('http://localhost:5215/api/Kitchen/GetExistingOrders')
      );

    this.activeOrders.set([...orders]);

    this.activeOrdersSubscription = this.realtime.ordersUpdated.subscribe(orders => {
      this.activeOrders.set([...orders])
    })
  }

  async sendOrder(foodId: number, tableNumber: number) {
    await this.realtime.orderFoodItem(foodId, tableNumber);
  }

  showActiveOrdersToggle() {
    this.showActiveOrders = !this.showActiveOrders;
  }
}
