using CMDCloudOrder.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetDateQuery() : IRequest<GetDateQueryHandler.OrderTime?>;

internal class GetDateQueryHandler : IRequestHandler<GetDateQuery, GetDateQueryHandler.OrderTime?>
{
    private readonly OrderDbContext _db;

    public class OrderTime
    {
        public int AssemblyTotal { get; set; }
        public int CuttingTotal { get; set; }
        public int PreparationTotal { get; set; }
        public int BendingTotal { get; set; }
    }

    public GetDateQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<OrderTime?> Handle(GetDateQuery request, CancellationToken ct)
    {
        var orders = await _db.Orders.AsQueryable().ToArrayAsync(ct);
        var result = new OrderTime();
        foreach (var order in orders)
        {
            if (!order.AssemblyDate.HasValue)
            {
                continue;
            }

            result.AssemblyTotal++;
            result.BendingTotal += order.AssemblyDate.Value.DayNumber - order.BendingDate.GetValueOrDefault(order.AssemblyDate.Value).DayNumber;
            if (order.BendingDate != null)
                result.PreparationTotal += order.BendingDate.Value.DayNumber - order.PreparationDate.GetValueOrDefault(order.BendingDate.Value).DayNumber;
            if (order.PreparationDate != null)
                result.CuttingTotal += order.PreparationDate.Value.DayNumber - order.CuttingDate.GetValueOrDefault(order.PreparationDate.Value).DayNumber;
        }

        return result;
    }
}