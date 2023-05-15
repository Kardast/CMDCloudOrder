using CMDCloudOrder.Data;
using CMDCloudOrder.Dto;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetDateQuery() : IRequest<OrderTimeDto?>;

internal class GetDateQueryHandler : IRequestHandler<GetDateQuery, OrderTimeDto?>
{
    private readonly OrderDbContext _db;

    public GetDateQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<OrderTimeDto?> Handle(GetDateQuery request, CancellationToken ct)
    {
        var orders = await _db.Orders.ToArrayAsync(ct);
        var result = new OrderTimeDto();
        foreach (var order in orders)
        {
            result.AssemblyTotal++;
            result.BendingTotal += ComputeTotal(order.AssemblyDate, order.BendingDate, order.AssemblyDate);
            result.PreparationTotal += ComputeTotal(order.BendingDate, order.PreparationDate, order.AssemblyDate);
            result.CuttingTotal += ComputeTotal(order.PreparationDate, order.CuttingDate, order.AssemblyDate);
        }

        return result;
    }

    private static int ComputeTotal(DateOnly? date, DateOnly? reference, DateOnly? defaultDate)
    {
        if (date is null || reference is null || defaultDate is null)
        {
            return 0;
        }

        return date.Value.DayNumber - reference.GetValueOrDefault(defaultDate.Value).DayNumber;
    }
}