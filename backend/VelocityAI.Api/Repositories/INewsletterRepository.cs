using Velobiz.Api.Models;

namespace Velobiz.Api.Repositories;

public interface INewsletterRepository
{
    Task<NewsletterSubscriber?> GetByEmailAsync(string email);
    Task<IEnumerable<NewsletterSubscriber>> GetAllActiveAsync();
    Task<NewsletterSubscriber> AddAsync(NewsletterSubscriber subscriber);
    Task UpdateAsync(NewsletterSubscriber subscriber);
    Task DeleteAsync(int id);
}
