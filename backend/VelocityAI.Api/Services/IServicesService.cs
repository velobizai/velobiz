using VelocityAI.Api.Models;

namespace VelocityAI.Api.Services;

public interface IServicesService
{
    Task<IEnumerable<Service>> GetAllActiveServicesAsync();
}
