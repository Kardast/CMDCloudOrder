using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetAllOrderQuery
    (string? Customer, string? OrderNumber, int PageIndex, int PageSize) : IRequest<GetAllOrdersHandler.PaginatedResult<Order>>;

internal class GetAllOrdersHandler : IRequestHandler<GetAllOrderQuery, GetAllOrdersHandler.PaginatedResult<Order>>
{
    private readonly OrderDbContext _db;

    public class PaginatedResult<T>
    {
        public List<T> Items { get; }
        public int PageIndex { get; }
        public int PageSize { get; }
        public int TotalCount { get; }

        public PaginatedResult(List<T> items, int totalCount, int pageIndex, int pageSize)
        {
            Items = items;
            TotalCount = totalCount;
            PageIndex = pageIndex;
            PageSize = pageSize;
        }
    }

    public GetAllOrdersHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<PaginatedResult<Order>> Handle(GetAllOrderQuery request, CancellationToken ct)
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

        var totalItems = await orders.CountAsync(ct);

        orders = orders.Skip((request.PageIndex - 1) * request.PageSize).Take(request.PageSize);

        return new PaginatedResult<Order>(orders.ToList(), totalItems, request.PageIndex, request.PageSize);
    }
}