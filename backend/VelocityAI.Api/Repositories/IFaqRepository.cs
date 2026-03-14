using Velobiz.Api.Models;

namespace Velobiz.Api.Repositories;

public interface IFaqRepository
{
    Task<Faq?> GetByIdAsync(int id);
    Task<IEnumerable<Faq>> GetAllActiveAsync();
    Task<Faq> AddAsync(Faq faq);
    Task UpdateAsync(Faq faq);
    Task DeleteAsync(int id);
}
