using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Queries;

public record GetAllOrderQuery(string? Customer, string? OrderNumber, int? OrdersPerPage) : IRequest<Order[]>;

internal class GetAllOrdersHandler : IRequestHandler<GetAllOrderQuery, Order[]>
{
    private readonly OrderDbContext _db;

    public GetAllOrdersHandler(OrderDbContext db)
    {
        _db = db;
    }

    public Task<Order[]> Handle(GetAllOrderQuery request, CancellationToken ct)
    {
        var orders = _db.Orders.AsQueryable();
        if (request.OrdersPerPage is not null)
        {
            orders = orders.Take((int)request.OrdersPerPage);
        }

        if (request.Customer is not null)
        {
            orders = orders.Where(order => order.Customer.ToLower().Contains(request.Customer.ToLower()));
        }

        if (request.OrderNumber is not null)
        {
            orders = orders.Where(order => order.OrderNumber.ToLower().Contains(request.OrderNumber.ToLower()));
        }

        return orders.ToArrayAsync(ct);
    }
}