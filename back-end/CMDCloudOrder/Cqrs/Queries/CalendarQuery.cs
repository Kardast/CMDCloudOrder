using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;

namespace CMDCloudOrder.Cqrs.Queries;

public record CalendarQuery(int? Month) : IRequest<PagedCalendar<Order>>;

public record PagedCalendar<T>(IEnumerable<T> Items);

internal class CalendarQueryHandler : IRequestHandler<CalendarQuery, PagedCalendar<Order>>
{
    private readonly OrderDbContext _db;


    public CalendarQueryHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<PagedCalendar<Order>> Handle(CalendarQuery request, CancellationToken ct)
    {
        var queryable = _db.Orders.AsEnumerable();

        if (request.Month is not null)
        {
            queryable = queryable
                .Where(or =>
                    or.CuttingDate.HasValue && or.CuttingDate.Value.Month == request.Month
                    || or.PreparationDate.HasValue &&
                    or.PreparationDate.Value.Month == request.Month
                    || or.BendingDate.HasValue && or.BendingDate.Value.Month == request.Month
                    || or.AssemblyDate.HasValue &&
                    or.AssemblyDate.Value.Month == request.Month);
        }

        var items = queryable;
        return Task.FromResult(new PagedCalendar<Order>(items));
    }
}