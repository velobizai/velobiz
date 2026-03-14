using Velobiz.Api.Models;

namespace Velobiz.Api.Services;

public interface IFaqService
{
    Task<IEnumerable<Faq>> GetAllActiveFaqsAsync();
}
