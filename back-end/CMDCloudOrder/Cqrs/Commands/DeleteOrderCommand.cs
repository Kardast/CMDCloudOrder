using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Commands;

public record DeleteOrderCommand(Order Order) : IRequest<Order>;

internal class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, Order>
{
    private readonly OrderDbContext _db;

    public DeleteOrderCommandHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<Order> Handle(DeleteOrderCommand request, CancellationToken ct)
    {
        var order = await GetById(request.Order.Id);

        if (order != null) _db.Remove(order);
        await _db.SaveChangesAsync(ct);
        return order!;
    }
    
    private Task<Order?> GetById(int id) => _db.Orders.FirstOrDefaultAsync(or => or.Id == id);
}
