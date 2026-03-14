using System.Net.Http.Headers;
using System.Reflection;
using Velobiz.Api.Airtable;
using Velobiz.Api.Middleware;
using Velobiz.Api.Repositories;
using Velobiz.Api.Services;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Configure Airtable
builder.Services.Configure<AirtableOptions>(
    builder.Configuration.GetSection(AirtableOptions.SectionName));

builder.Services.AddHttpClient<AirtableClient>((serviceProvider, client) =>
{
    var config = builder.Configuration
        .GetSection(AirtableOptions.SectionName)
        .Get<AirtableOptions>()!;

    client.BaseAddress = new Uri("https://api.airtable.com/v0/");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", config.PersonalAccessToken);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register Repositories
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<IFaqRepository, FaqRepository>();
builder.Services.AddScoped<IServicesRepository, ServicesRepository>();
builder.Services.AddScoped<INewsletterRepository, NewsletterRepository>();

// Register Services
builder.Services.AddScoped<IFaqService, FaqService>();
builder.Services.AddScoped<IServicesService, ServicesService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IEmailService, MailKitEmailService>();

// Add Controllers
builder.Services.AddControllers();

// Register FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Velobiz API",
        Version = "v1",
        Description = "Backend API for Velobiz agency website"
    });

    // Enable XML documentation
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// Global exception handler (must be first)
app.UseMiddleware<ExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Velobiz API v1");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularDev");

app.UseAuthorization();

app.MapControllers();

app.Run();
