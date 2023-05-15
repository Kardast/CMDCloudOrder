using CMDCloudOrder.Data;
using CMDCloudOrder.Dto;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetAllOrderQuery(string? Customer, string? OrderNumber, int PageIndex, int PageSize) : IRequest<PagedResultDto<Order>>;

internal class GetAllOrdersHandler : IRequestHandler<GetAllOrderQuery, PagedResultDto<Order>>
{
    private readonly OrderDbContext _db;

    public GetAllOrdersHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResultDto<Order>> Handle(GetAllOrderQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Customer))
        {
            orders = orders.Where(order => order.Customer.ToLower().Contains(request.Customer.ToLower()));
        }

        if (!string.IsNullOrWhiteSpace(request.OrderNumber))
        {
            orders = orders.Where(order => order.OrderNumber.ToLower().Contains(request.OrderNumber.ToLower()));
        }

        var totalCount = await orders.CountAsync(ct);
        var items = await orders
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize).ToArrayAsync(ct);

        return new PagedResultDto<Order>(items, totalCount);
    }
}