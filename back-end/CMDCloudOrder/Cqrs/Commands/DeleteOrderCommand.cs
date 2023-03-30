using CMDCloudOrder.Data;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CMDCloudOrder.Cqrs.Commands;

public record DeleteOrderCommand(int Id) : IRequest<int>;

internal class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, int>
{
    private readonly OrderDbContext _db;

    public DeleteOrderCommandHandler(OrderDbContext db)
    {
        _db = db;
    }

    public async Task<int> Handle(DeleteOrderCommand request, CancellationToken ct)
    {
        var orderToRemove = await GetById(request.Id);
        if (orderToRemove != null) _db.Remove(orderToRemove);
        await _db.SaveChangesAsync(ct);
        return request.Id;
    }

    private Task<Order?> GetById(int id) => _db.Orders.FirstOrDefaultAsync(or => or.Id == id);
}