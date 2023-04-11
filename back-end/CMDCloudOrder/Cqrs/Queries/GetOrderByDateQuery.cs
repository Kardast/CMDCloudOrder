using CMDCloudOrder.Data;
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

    public Task<Order[]> Handle(GetOrderByDateQuery request, CancellationToken ct) =>
        _db.Orders
            .Where(or =>
                or.CuttingDate.HasValue && or.CuttingDate.Value.Month == request.Month
                || or.PreparationDate.HasValue &&
                or.PreparationDate.Value.Month == request.Month
                || or.BendingDate.HasValue && or.BendingDate.Value.Month == request.Month
                || or.AssemblyDate.HasValue &&
                or.AssemblyDate.Value.Month == request.Month)
            .Where(or =>
                or.CuttingDate.HasValue && or.CuttingDate.Value.Year == request.Year
                || or.PreparationDate.HasValue &&
                or.PreparationDate.Value.Year == request.Year
                || or.BendingDate.HasValue && or.BendingDate.Value.Year == request.Year
                || or.AssemblyDate.HasValue &&
                or.AssemblyDate.Value.Year == request.Year)
            .ToArrayAsync(ct);
}