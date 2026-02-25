using Velobiz.Api.Models;

namespace Velobiz.Api.Services;

public interface IServicesService
{
    Task<IEnumerable<Service>> GetAllActiveServicesAsync();
}
