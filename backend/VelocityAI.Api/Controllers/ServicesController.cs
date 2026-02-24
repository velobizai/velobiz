using Microsoft.AspNetCore.Mvc;
using VelocityAI.Api.DTOs;
using VelocityAI.Api.Models;
using VelocityAI.Api.Services;

namespace VelocityAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ServicesController : ControllerBase
{
    private readonly IServicesService _service;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(IServicesService service, ILogger<ServicesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all active services ordered by display order
    /// </summary>
    /// <returns>List of active services</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Service>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Service>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Service>>>> GetAll()
    {
        try
        {
            var services = await _service.GetAllActiveServicesAsync();
            return Ok(ApiResponse<IEnumerable<Service>>.SuccessResponse(services, "Services retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving services");
            return StatusCode(500, ApiResponse<IEnumerable<Service>>.ErrorResponse(
                "An error occurred while retrieving services. Please try again later.",
                new List<string> { ex.Message }
            ));
        }
    }
}
