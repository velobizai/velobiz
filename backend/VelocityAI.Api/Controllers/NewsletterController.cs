using Microsoft.AspNetCore.Mvc;
using Velobiz.Api.DTOs;
using Velobiz.Api.Models;
using Velobiz.Api.Repositories;

namespace Velobiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class NewsletterController : ControllerBase
{
    private readonly INewsletterRepository _repository;

    public NewsletterController(INewsletterRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Subscribe to newsletter
    /// </summary>
    [HttpPost("subscribe")]
    [ProducesResponseType(typeof(ApiResponse<NewsletterSubscriber>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<NewsletterSubscriber>), StatusCodes.Status400BadRequest)]
    public ActionResult<ApiResponse<NewsletterSubscriber>> Subscribe([FromBody] NewsletterSubscriber subscriber)
    {
        return StatusCode(501, ApiResponse<NewsletterSubscriber>.ErrorResponse("Not implemented yet - will be completed in FEATURE 7"));
    }
}
