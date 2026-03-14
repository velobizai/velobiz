using Velobiz.Api.Models;
using Velobiz.Api.Repositories;

namespace Velobiz.Api.Services;

public class ServicesService : IServicesService
{
    private readonly IServicesRepository _repository;

    public ServicesService(IServicesRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Service>> GetAllActiveServicesAsync()
    {
        return await _repository.GetAllActiveAsync();
    }
}
