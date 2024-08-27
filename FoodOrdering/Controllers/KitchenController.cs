using FoodOrdering.Contexts;
using FoodOrdering.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class KitchenController : ControllerBase
{
    private readonly DataContext _context;

    public KitchenController(DataContext context)
    {
        _context = context;
    }

    // [HttpGet]
    // public async Task<List<Order>> GetExistingOrders()
    // {
    //     return await _context.Orders
    //         .Include(o => o.FoodItem)
    //         .Where(o => o.OrderState !=  OrderState.Completed)
    //         .ToListAsync();
    // }

    [HttpGet]
    public List<Order> GetExistingOrders()
    {
        return _context.Orders
            .Include(o => o.FoodItem)
            .Where(o => o.OrderState !=  OrderState.Completed)
            .ToList();
    }
}