using Microsoft.AspNetCore.Mvc;
using VelocityAI.Api.DTOs;
using VelocityAI.Api.Models;
using VelocityAI.Api.Services;

namespace VelocityAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FaqsController : ControllerBase
{
    private readonly IFaqService _service;
    private readonly ILogger<FaqsController> _logger;

    public FaqsController(IFaqService service, ILogger<FaqsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all active FAQs ordered by display order
    /// </summary>
    /// <returns>List of active FAQs</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Faq>>>> GetAll()
    {
        try
        {
            var faqs = await _service.GetAllActiveFaqsAsync();
            return Ok(ApiResponse<IEnumerable<Faq>>.SuccessResponse(faqs, "FAQs retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving FAQs");
            return StatusCode(500, ApiResponse<IEnumerable<Faq>>.ErrorResponse(
                "An error occurred while retrieving FAQs. Please try again later.",
                new List<string> { ex.Message }
            ));
        }
    }
}
