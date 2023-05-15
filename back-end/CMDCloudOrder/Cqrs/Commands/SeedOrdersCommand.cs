using Bogus;
using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Commands;

public record SeedOrdersCommand(int Amount = 10) : IRequest<int>;

internal class SeedOrdersCommandHandler : IRequestHandler<SeedOrdersCommand, int>
{
    private readonly OrderDbContext _db;

    public SeedOrdersCommandHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<int> Handle(SeedOrdersCommand request, CancellationToken ct)
    {
        var count = await _db.Set<Order>().CountAsync(ct);
        if (count >= request.Amount)
        {
            return 0;
        }

        var postFaker = new Faker<Order>()
            .RuleFor(p => p.OrderNumber, f => f.Commerce.Ean8())
            .RuleFor(p => p.Customer, f => f.Company.CompanyName());

        var orders = postFaker.Generate(request.Amount);

        for (var i = 0; i < orders.Count; i++)
        {
            var order = orders[i];
            _db.Set<Order>().Add(orders[i]);
            order.Customer = orders[i % 30].Customer; // generating multiple orders for same customer

            order.CuttingDate = new DateOnly(2023, 1, 10).AddDays(i);
            order.PreparationDate = new DateOnly(2023, 1, 11).AddDays(i);
            order.BendingDate = new DateOnly(2023, 1, 12).AddDays(i);
            order.AssemblyDate = new DateOnly(2023, 1, 13).AddDays(i);
        }

        return await _db.SaveChangesAsync(ct);
    }
}