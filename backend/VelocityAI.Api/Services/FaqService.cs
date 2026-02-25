using Velobiz.Api.Models;
using Velobiz.Api.Repositories;

namespace Velobiz.Api.Services;

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
