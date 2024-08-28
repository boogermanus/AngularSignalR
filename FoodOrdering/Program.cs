using System.Text.Json.Serialization;
using FoodOrdering.BackgroundServices;
using FoodOrdering.Contexts;
using FoodOrdering.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Data Source=foodordering.db"));
builder.Services.AddHostedService<SeedingWorker>();
builder.Services.AddMvc()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseRouting();
app.MapControllers();
app.MapHub<FoodHub>("/foodhub");

app.Run();

