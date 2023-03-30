using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;

namespace CMDCloudOrder.Cqrs.Commands;

public record CreateOrderCommand(Order Order) : IRequest<Order>;

internal class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Order>
{
    private readonly OrderDbContext _db;

    public CreateOrderCommandHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<Order> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        _db.Add(request.Order);
        await _db.SaveChangesAsync(cancellationToken);

        return request.Order;
    }
};