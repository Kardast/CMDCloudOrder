using CMDCloudOrder.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CMDCloudOrder.Data;

public class OrderDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; } = null!;

    public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(
            "data source=db5eb13a5470;initial catalog=cmd-db;user id=sa;password=yourStrong(!)Password;TrustServerCertificate=True;");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>()
            .Property(x => x.CuttingDate)
            .HasConversion<DateOnlyConverter>()
            .HasColumnType("date");

        modelBuilder.Entity<Order>()
            .Property(x => x.AssemblyDate)
            .HasConversion<DateOnlyConverter>()
            .HasColumnType("date");

        modelBuilder.Entity<Order>()
            .Property(x => x.BendingDate)
            .HasConversion<DateOnlyConverter>()
            .HasColumnType("date");

        modelBuilder.Entity<Order>()
            .Property(x => x.PreparationDate)
            .HasConversion<DateOnlyConverter>()
            .HasColumnType("date");
    }
}

/// <summary>
/// Converts <see cref="DateOnly" /> to <see cref="DateTime"/> and vice versa.
/// </summary>
public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
{
    /// <summary>
    /// Creates a new instance of this converter.
    /// </summary>
    public DateOnlyConverter() : base(
        d => d.ToDateTime(TimeOnly.MinValue),
        d => DateOnly.FromDateTime(d))
    {
    }
}