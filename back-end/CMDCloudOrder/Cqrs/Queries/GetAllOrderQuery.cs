using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetAllOrderQuery
    (string? Customer, string? OrderNumber, PaginationFilter? OrdersPerPage) : IRequest<Order[]>;

internal class GetAllOrdersHandler : IRequestHandler<GetAllOrderQuery, Order[]>
{
    private readonly OrderDbContext _db;

    public GetAllOrdersHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<Order[]> Handle(GetAllOrderQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();
        if (request.OrdersPerPage != null)
        {
            var validFilter = new PaginationFilter(request.OrdersPerPage.PageNumber, request.OrdersPerPage.PageSize);
            orders = orders.Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize);
            var totalRecords = await _db.Orders.CountAsync();
        }

        if (request.Customer is not null)
        {
            orders = orders.Where(order => order.Customer.ToLower().Contains(request.Customer.ToLower()));
        }

        if (request.OrderNumber is not null)
        {
            orders = orders.Where(order => order.OrderNumber.ToLower().Contains(request.OrderNumber.ToLower()));
        }

        return await orders.ToArrayAsync(ct);
    }
}