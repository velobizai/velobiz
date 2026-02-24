# Skill: MySQL Database Schema Generation

## Purpose
Generate MySQL database schemas via EF Core Code-First following project conventions.

## Template: Base Entity
```csharp
namespace {{ServiceName}}.Domain.Entities;

public abstract class BaseEntity
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
```

## Template: Domain Entity
```csharp
namespace {{ServiceName}}.Domain.Entities;

public class {{Entity}} : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public {{EntityStatus}} Status { get; set; } = {{EntityStatus}}.Active;

    // Navigation properties
    public long {{Parent}}Id { get; set; }
    public {{Parent}} {{Parent}} { get; set; } = default!;
    public ICollection<{{Child}}> {{ChildPlural}} { get; set; } = new List<{{Child}}>();
}
```

## Template: EF Core Configuration
```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace {{ServiceName}}.Infrastructure.Persistence.Configurations;

public class {{Entity}}Configuration : IEntityTypeConfiguration<{{Entity}}>
{
    public void Configure(EntityTypeBuilder<{{Entity}}> builder)
    {
        // Table
        builder.ToTable("{{table_name}}");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasColumnType("bigint unsigned")
            .ValueGeneratedOnAdd();

        // Properties
        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(2000);

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        // Audit columns
        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("datetime(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
            .ValueGeneratedOnAddOrUpdate();

        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .HasDefaultValue(false);

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at")
            .HasColumnType("datetime(6)");

        // Indexes
        builder.HasIndex(e => e.Name).HasDatabaseName("idx_{{table_name}}_name");
        builder.HasIndex(e => e.Status).HasDatabaseName("idx_{{table_name}}_status");
        builder.HasIndex(e => e.IsDeleted).HasDatabaseName("idx_{{table_name}}_is_deleted");

        // Soft delete global filter
        builder.HasQueryFilter(e => !e.IsDeleted);

        // Relationships
        builder.HasOne(e => e.{{Parent}})
            .WithMany(p => p.{{EntityPlural}})
            .HasForeignKey(e => e.{{Parent}}Id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
```

## Template: Connection String (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database={{db_name}};User=root;Password=;CharSet=utf8mb4;SslMode=Preferred;"
  }
}
```

## Template: DbContext Registration (Program.cs)
```csharp
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
            mySqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
        }));
```

## MySQL Data Type Mapping
| C# Type | MySQL Type | EF Configuration |
|---------|-----------|-----------------|
| `long` | `BIGINT UNSIGNED` | `.HasColumnType("bigint unsigned")` |
| `int` | `INT` | default |
| `string` (short) | `VARCHAR(N)` | `.HasMaxLength(N)` |
| `string` (long) | `TEXT` | `.HasColumnType("text")` |
| `decimal` | `DECIMAL(18,2)` | `.HasColumnType("decimal(18,2)")` |
| `bool` | `TINYINT(1)` | default |
| `DateTime` | `DATETIME(6)` | `.HasColumnType("datetime(6)")` |
| `Guid` | `CHAR(36)` | `.HasColumnType("char(36)")` |
| `enum` | `VARCHAR(50)` | `.HasConversion<string>().HasMaxLength(50)` |
| `byte[]` | `LONGBLOB` | `.HasColumnType("longblob")` |
