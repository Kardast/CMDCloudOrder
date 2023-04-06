using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetAllOrderQuery(string? Customer, string? OrderNumber, int PageIndex, int PageSize) : IRequest<PagedResult<Order>>;

public record PagedResult<T>(T[] Items, int TotalCount);

internal class GetAllOrdersHandler : IRequestHandler<GetAllOrderQuery, PagedResult<Order>>
{
    private readonly OrderDbContext _db;

    public GetAllOrdersHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<Order>> Handle(GetAllOrderQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();
        if (request.Customer is not null)
        {
            orders = orders.Where(order => order.Customer.ToLower().Contains(request.Customer.ToLower()));
        }

        if (request.OrderNumber is not null)
        {
            orders = orders.Where(order => order.OrderNumber.ToLower().Contains(request.OrderNumber.ToLower()));
        }

        int totalCount = await orders.CountAsync(ct);

        orders = orders
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize);

        var items = await orders.ToArrayAsync(ct);

        return new PagedResult<Order>(items, totalCount);
    }
}