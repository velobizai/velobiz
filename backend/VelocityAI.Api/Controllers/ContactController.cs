using Microsoft.AspNetCore.Mvc;
using VelocityAI.Api.DTOs;
using VelocityAI.Api.Models;
using VelocityAI.Api.Services;

namespace VelocityAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ContactController : ControllerBase
{
    private readonly IContactService _service;

    public ContactController(IContactService service)
    {
        _service = service;
    }

    /// <summary>
    /// Submit a contact form
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Contact>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<Contact>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<Contact>>> Submit([FromBody] ContactRequestDto dto)
    {
        var contact = await _service.SubmitContactFormAsync(dto);

        var response = ApiResponse<Contact>.SuccessResponse(
            contact,
            "Thank you for contacting us! We'll respond within 24 hours."
        );

        return CreatedAtAction(nameof(Submit), new { id = contact.Id }, response);
    }
}
