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
        var filterExpressions = new Expression<Func<Order, bool>>[]
        {
            or => or.CuttingDate.HasValue && or.CuttingDate.Value.Month == request.Month,
            or => or.PreparationDate.HasValue && or.PreparationDate.Value.Month == request.Month,
            or => or.BendingDate.HasValue && or.BendingDate.Value.Month == request.Month,
            or => or.AssemblyDate.HasValue && or.AssemblyDate.Value.Month == request.Month
        };

        var yearExpressions = new Expression<Func<Order, bool>>[]
        {
            or => or.CuttingDate.HasValue && or.CuttingDate.Value.Year == request.Year,
            or => or.PreparationDate.HasValue && or.PreparationDate.Value.Year == request.Year,
            or => or.BendingDate.HasValue && or.BendingDate.Value.Year == request.Year,
            or => or.AssemblyDate.HasValue && or.AssemblyDate.Value.Year == request.Year
        };

        return _db.Orders
            .Where(filterExpressions.Or())
            .Where(yearExpressions.Or())
            .ToArrayAsync(ct);
    }
}