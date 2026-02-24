using VelocityAI.Api.Models;
using VelocityAI.Api.Repositories;

namespace VelocityAI.Api.Services;

public class FaqService : IFaqService
{
    private readonly IFaqRepository _repository;

    public FaqService(IFaqRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Faq>> GetAllActiveFaqsAsync()
    {
        return await _repository.GetAllActiveAsync();
    }
}
