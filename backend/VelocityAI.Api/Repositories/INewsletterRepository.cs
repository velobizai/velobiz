using VelocityAI.Api.Models;

namespace VelocityAI.Api.Repositories;

public interface INewsletterRepository
{
    Task<NewsletterSubscriber?> GetByEmailAsync(string email);
    Task<IEnumerable<NewsletterSubscriber>> GetAllActiveAsync();
    Task<NewsletterSubscriber> AddAsync(NewsletterSubscriber subscriber);
    Task UpdateAsync(NewsletterSubscriber subscriber);
    Task DeleteAsync(int id);
}
