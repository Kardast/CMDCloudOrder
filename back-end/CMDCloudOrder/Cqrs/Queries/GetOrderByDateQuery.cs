using System.Linq.Expressions;
using CMDCloudOrder.Data;
using CMDCloudOrder.Extensions;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetOrderByDateQuery(int Month, int Year) : IRequest<Order[]>;

internal class GetOrderByDateQueryHandler : IRequestHandler<GetOrderByDateQuery, Order[]>
{
    private readonly OrderDbContext _db;

    public GetOrderByDateQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<Order[]> Handle(GetOrderByDateQuery request, CancellationToken ct)
    {
        var start = new DateOnly(request.Year, request.Month, 1);
        var end = start.AddMonths(1).AddDays(-1);
        var filterExpressions = new Expression<Func<Order, bool>>[]
        {
            or => or.CuttingDate!.Value >= start && or.CuttingDate!.Value <= end,
            or => or.PreparationDate!.Value >= start && or.PreparationDate!.Value <= end,
            or => or.BendingDate!.Value >= start && or.BendingDate!.Value <= end,
            or => or.AssemblyDate!.Value >= start && or.AssemblyDate!.Value <= end
        };

        return _db.Orders
            .Where(filterExpressions.Or())
            .ToArrayAsync(ct);
    }
}