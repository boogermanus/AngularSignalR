using FoodOrdering.Models;

namespace FoodOrdering.Interfaces;

public interface IFoodOrderClient
{
    Task PendingFoodUpdated(List<Order> orders);
}