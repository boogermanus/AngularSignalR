namespace FoodOrdering.Models;

public class FoodItem
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string ImageUrl { get; set; }
}