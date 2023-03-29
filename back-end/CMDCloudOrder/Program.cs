using System.Reflection;
using CMDCloudOrder.Configurations;
using CMDCloudOrder.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwagger();
builder.Services.AddNSwag();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
// Dependency Injection
builder.Services.AddDbContext<OrderDbContext>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

var app = builder.Build();


app.Services.CreateScope().ServiceProvider.GetRequiredService<OrderDbContext>().Database.Migrate();

app.UseCors(b => b
    .WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowCredentials()
    .AllowAnyMethod());

// Configure the HTTP request pipeline.
app.UseApplicationSwagger();

app.UseAuthorization();

app.MapControllers();

app.Run();