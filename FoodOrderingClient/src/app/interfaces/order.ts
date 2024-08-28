import { OrderState } from "../order-state";
import { FoodItem } from "./food-item";

export interface Order {
    id: number;
    tableNumber: number;
    foodItemId: number;
    foodItem: FoodItem
    orderDate: Date;
    orderState: OrderState
}
