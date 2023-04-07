using CMDCloudOrder.Cqrs.Commands;
using CMDCloudOrder.Cqrs.Queries;
using CMDCloudOrder.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CMDCloudOrder.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("[action]")]
    public Task<PagedResult<Order>> List([FromQuery] string? customer, [FromQuery] string? orderNumber, int pageIndex,
        int pageSize) =>
        _mediator.Send(new GetAllOrderQuery(customer, orderNumber, pageIndex, pageSize));

    [HttpGet("[action]")]
    public Task<MonthResult<Order>> GetOrdersByMonth([FromQuery] int? cuttingMonth, [FromQuery] int? preparationMonth,
        [FromQuery] int? bendingMonth, [FromQuery] int? assemblyMonth) =>
        _mediator.Send(new GetOrdersByMonthQuery(cuttingMonth, preparationMonth, bendingMonth, assemblyMonth));
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Order order)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var model = new CreateOrderCommand(order);
        var result = await _mediator.Send(model);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Order data)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var model = new UpdateOrderCommand(data);
        var result = await _mediator.Send(model);
        return Ok(result);
    }

    [HttpDelete]
    [Route("[action]/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var command = new DeleteOrderCommand(id);
        await _mediator.Send(command);
        return Ok("File removed");
    }

    [HttpGet]
    [Route("[action]")]
    [ProducesResponseType(typeof(List<GetDateQueryHandler.OrderTime>), 200)]
    public async Task<IActionResult> DateList()
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var query = new GetDateQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    
    [HttpGet]
    [Route("[action]")]
    public Task<PagedCalendar<Order>> CalendarPagination([FromQuery]int? month) =>
        _mediator.Send(new CalendarQuery(month));
}