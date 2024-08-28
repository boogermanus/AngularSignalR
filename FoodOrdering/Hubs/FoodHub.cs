using FoodOrdering.Contexts;
using FoodOrdering.Interfaces;
using FoodOrdering.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Hubs;

public class FoodHub : Hub<IFoodOrderClient>
{
    private readonly DataContext _context;

    public FoodHub(DataContext context)
    {
        _context = context;
    }

    public async Task OrdderFoodItem(FoodRequest request)
    {
        _context.Orders.Add(new Order
        {
            FoodItemId = request.FoodId,
            OrderDate = DateTimeOffset.Now,
            TableNumber = request.TableNumber,
            OrderState = OrderState.Ordered
        });

        await _context.SaveChangesAsync();
        await EmitActiveOrders();
    }

    public async Task EmitActiveOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.FoodItem)
            .Where(o => o.OrderState != OrderState.Ordered)
            .ToListAsync();

        await Clients.All.PendingFoodUpdated(orders);
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Connection: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Disconnect: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdateFoodItem(int orderId, OrderState state)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if(order != null)
            order.OrderState = state;

        await _context.SaveChangesAsync();
        await EmitActiveOrders();
    }
}