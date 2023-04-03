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
        var order = await GetById(request.Order.Id);
        if (order is null)
        {
            throw new InvalidOperationException();
        }

        order.Customer = request.Order.Customer;
        order.OrderNumber = request.Order.OrderNumber;
        order.CuttingDate = request.Order.CuttingDate;
        order.PreparationDate = request.Order.PreparationDate;
        order.BendingDate = request.Order.BendingDate;
        order.AssemblyDate = request.Order.AssemblyDate;

        await _db.SaveChangesAsync(cancellationToken);
        return order;
    }

    private Task<Order?> GetById(int id) => _db.Orders.FirstOrDefaultAsync(or => or.Id == id);
}