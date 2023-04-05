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

    [HttpGet]
    [Route("[action]")]
    [ProducesResponseType(typeof(List<Order>), 200)]
    public async Task<IActionResult> List([FromQuery] string? customer, [FromQuery] string? orderNumber, [FromQuery] int? ordersPerPage)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var query = new GetAllOrderQuery(customer, orderNumber, ordersPerPage);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

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
}