using VelocityAI.Api.Models;
using VelocityAI.Api.Repositories;

namespace VelocityAI.Api.Services;

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
