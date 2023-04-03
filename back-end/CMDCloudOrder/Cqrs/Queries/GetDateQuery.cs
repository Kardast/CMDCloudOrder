using CMDCloudOrder.Data;
using MediatR;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetDateQuery() : IRequest<List<int>>;

internal class GetDateQueryHandler : IRequestHandler<GetDateQuery, List<int>>
{
    private readonly OrderDbContext _db;

    public GetDateQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<List<int>> Handle(GetDateQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();
        var days = new List<int>();
        var assembly = 0;
        foreach (var order in orders)
        {
            if (order.AssemblyDate is not null && order.CuttingDate is not null && order.PreparationDate is not null &&
                order.BendingDate is not null)
            {
                var assemblycutDiff = order.AssemblyDate.Value.DayNumber - order.CuttingDate.Value.DayNumber;
                var assemblyPrepDiff = order.AssemblyDate.Value.DayNumber - order.PreparationDate.Value.DayNumber;
                var asssemblyBendingDiff = order.AssemblyDate.Value.DayNumber - order.BendingDate.Value.DayNumber;
                assembly++;
                days.Add(assemblycutDiff);
                days.Add(assemblyPrepDiff);
                days.Add(asssemblyBendingDiff);
                days.Add(assembly);
            }
        }

        return Task.FromResult(days);
    }
}