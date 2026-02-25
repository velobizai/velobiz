using Velobiz.Api.Models;

namespace Velobiz.Api.Repositories;

public interface IServicesRepository
{
    Task<Service?> GetByIdAsync(int id);
    Task<IEnumerable<Service>> GetAllActiveAsync();
    Task<Service> AddAsync(Service service);
    Task UpdateAsync(Service service);
    Task DeleteAsync(int id);
}
