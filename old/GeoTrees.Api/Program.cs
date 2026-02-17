using System.IO.Compression;
using GeoTrees.Api;
using GeoTrees.Api.Data;
using GeoTrees.Api.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;

Log.Information("Starting web application");

var builder = WebApplication.CreateBuilder(args);

// Check for seed data argument
var shouldSeedData = args.Contains("--seed-data");

// Add Serilog
Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();

builder.Services.AddSerilog();

builder.Services.AddOpenApi(opt =>
{
    opt.AddDocumentTransformer(
        (document, context, cancellationToken) =>
        {
            document.Info = new()
            {
                Title = "GeoTrees API",
                Version = "v1",
                Description =
                    @"# GeoTrees API Documentation

## Overview
API for GeoTrees data provides access to plot information and allows performing basic operations on forestry data.

## Features
- Query plot locations and attributes
- Filter plots by geographical boundaries
- Access detailed information about individual plots
- Support for GeoJSON format

## Authentication
This API uses JWT Bearer authentication. Some requests must include a valid token.

For more information, contact the IIASA GeoTrees Team.",
                Contact = new()
                {
                    Name = "IIASA GeoTrees Team",
                    Email = "geotrees@iiasa.ac.at",
                    Url = new Uri("https://iiasa.ac.at/geotrees"),
                },
            };
            return Task.CompletedTask;
        }
    );
    opt.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

// Add authentication
builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Jwt:Authority"];
        options.Audience = builder.Configuration["Jwt:Audience"];
        options.RequireHttpsMetadata = true;
        options.TokenValidationParameters =
            new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["Jwt:Authority"],
            };
    });

// Add authorization
builder.Services.AddAuthorization();

// Configure services
builder.Services.AddDbContext<GeoTreesDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("GeoTreesDatabase"),
        o => o.UseNetTopologySuite()
    )
);

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(
        new NetTopologySuite.IO.Converters.GeoJsonConverterFactory()
    );
});

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
        if (allowedOrigins?.Any() == true)
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
        else
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    });
});

builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder.Expire(TimeSpan.FromMinutes(10)));
});

builder.Services.AddResponseCaching();

builder.Services.AddResponseCompression();

builder.Services.AddHttpClient();

var app = builder.Build();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GeoTreesDbContext>();
    dbContext.Database.Migrate();
}

// Seed data if requested
if (shouldSeedData)
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<GeoTreesDbContext>();
        try
        {
            Log.Information("Seeding database...");
            // Ensure database is created
            // Add your seeding logic here
            // await DbInitializer.SeedAsync(dbContext);
            dbContext.Database.EnsureCreated();
            var seeder = new DataSeeder(dbContext, "Source/plot_data.xlsx");
            await seeder.SeedAsync();
            Log.Information("Database seeded successfully");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error occurred while seeding the database");
            throw;
        }
    }
}

app.MapOpenApi().CacheOutput();

app.MapScalarApiReference(
    (opt) =>
    {
        opt.Title = "GeoTrees API";
        opt.AddMetadata("version", "1.0");
        opt.AddMetadata("description", "API for GeoTrees data");
        opt.AddMetadata("contact", "IIASA GeoTrees Team");
    }
);

app.UseCors();

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.UseResponseCompression();
app.UseResponseCaching();
app.UseOutputCache();

// Register endpoint groups
app.MapPlotEndpoints();
app.MapExternalDataEndpoint();

// app.MapPlotDetailEndpoints();
// app.MapTreeDataEndpoints();
app.UseHsts();

app.MapGet("/", () => Results.Redirect("/scalar/v1")).ExcludeFromDescription();

app.Run();
