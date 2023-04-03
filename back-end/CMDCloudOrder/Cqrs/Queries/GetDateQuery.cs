using CMDCloudOrder.Data;
using MediatR;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetDateQuery() : IRequest<GetDateQueryHandler.OrderTime>;

internal class GetDateQueryHandler : IRequestHandler<GetDateQuery, GetDateQueryHandler.OrderTime>
{
    private readonly OrderDbContext _db;

    public class OrderTime
    {
        public int Assembly { get; set; }
        public int AssemblyCutSum { get; set; }
        public int AssemblyPrepSum { get; set; }
        public int AssemblyBendingSum { get; set; }
    }

    public GetDateQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<OrderTime> Handle(GetDateQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();
        var days = new List<OrderTime>();
        var assembly = 0;
        var assemblyCutSum = 0;
        var assemblyPrepSum = 0;
        var assemblyBendingSum = 0;
        foreach (var order in orders)
        {
            if (order.AssemblyDate is not null && order.CuttingDate is not null && order.PreparationDate is not null &&
                order.BendingDate is not null)
            {
                var assemblyCutDiff = order.AssemblyDate.Value.DayNumber - order.CuttingDate.Value.DayNumber;
                var assemblyPrepDiff = order.AssemblyDate.Value.DayNumber - order.PreparationDate.Value.DayNumber;
                var assemblyBendingDiff = order.AssemblyDate.Value.DayNumber - order.BendingDate.Value.DayNumber;

                assembly++;
                assemblyCutSum += assemblyCutDiff;
                assemblyPrepSum += assemblyPrepDiff;
                assemblyBendingSum += assemblyBendingDiff;

                days.Add(new OrderTime()
                {
                    Assembly = assembly,
                    AssemblyCutSum = assemblyCutSum,
                    AssemblyPrepSum = assemblyPrepSum,
                    AssemblyBendingSum = assemblyBendingSum
                });
            }
        }

        return Task.FromResult(days.ToArray().LastOrDefault())!;
    }
}