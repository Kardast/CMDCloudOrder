using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetOrdersByMonthQuery(int? CuttingMonth, int? PreparationMonth, int? BendingMonth, int? AssemblyMonth) : IRequest<MonthResult<Order>>;

public record MonthResult<T>(IEnumerable<Order> Items);

internal class GetOrdersByMonthQueryHandler : IRequestHandler<GetOrdersByMonthQuery, MonthResult<Order>>
{
    private readonly OrderDbContext _db;

    public GetOrdersByMonthQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<MonthResult<Order>> Handle(GetOrdersByMonthQuery request, CancellationToken ct)
    {
        var items = _db.Orders.AsEnumerable();

        if (request.CuttingMonth is not null)
        {
            items = items.Where(or => or.CuttingDate.HasValue && or.CuttingDate.Value.Month == request.CuttingMonth);
        }

        if (request.PreparationMonth is not null)
        {
            items = items.Where(or => or.PreparationDate.HasValue && or.PreparationDate.Value.Month == request.PreparationMonth);
        }

        if (request.BendingMonth is not null)
        {
            items = items.Where(or => or.BendingDate.HasValue && or.BendingDate.Value.Month == request.BendingMonth);
        }

        if (request.AssemblyMonth is not null)
        {
            items = items.Where(or => or.AssemblyDate.HasValue && or.AssemblyDate.Value.Month == request.AssemblyMonth);
        }
        
        return Task.FromResult(new MonthResult<Order>(items));
    }
};