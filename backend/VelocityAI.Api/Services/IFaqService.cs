using VelocityAI.Api.Models;

namespace VelocityAI.Api.Services;

public interface IFaqService
{
    Task<IEnumerable<Faq>> GetAllActiveFaqsAsync();
}
