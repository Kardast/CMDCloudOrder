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
    public async Task<IActionResult> List([FromQuery]string? customer, [FromQuery]string? orderNumber)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var query = new GetAllOrderQuery(customer, orderNumber);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody]Order order)
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
    public async Task<IActionResult> Update(Order data)
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
    public async Task<IActionResult> Delete(Order data)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var model = new DeleteOrderCommand(data);
        var result = await _mediator.Send(model);
        return Ok(result);
    }
}