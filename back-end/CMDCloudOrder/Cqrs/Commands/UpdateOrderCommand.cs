using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Commands;

public record UpdateOrderCommand(Order Order) : IRequest<Order>;

internal class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, Order>
{
    private readonly OrderDbContext _db;

    public UpdateOrderCommandHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<Order> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(or => or.Id == request.Order.Id, cancellationToken);
        if (order is null)
        {
            throw new InvalidOperationException();
        }

        _db.Entry(order).CurrentValues.SetValues(request.Order);
        await _db.SaveChangesAsync(cancellationToken);

        return order;
    }
}