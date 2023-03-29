using Microsoft.OpenApi.Writers;
using NSwag;
using NSwag.Generation;
using Swashbuckle.AspNetCore.Swagger;

namespace CMDCloudOrder.Configurations;

public static class NSwagConfiguration
{
    public static readonly bool IsOpenApiSchemeGenerationRuntime = Environment.StackTrace.Contains("NSwag.Commands");

    public static IServiceCollection AddNSwag(this IServiceCollection source)
    {
        source.AddTransient<IOpenApiDocumentGenerator, OpenApiDocumentGenerator>();
        return source;
    }

    public class OpenApiDocumentGenerator : IOpenApiDocumentGenerator
    {
        private readonly ISwaggerProvider _provider;

        public OpenApiDocumentGenerator(ISwaggerProvider provider)
        {
            _provider = provider;
        }

        public Task<OpenApiDocument?> GenerateAsync(string documentName)
        {
            _provider.GetSwagger(SwaggerConfiguration.ApiVersion, null, "/"); // first execution is faulty
            var doc = _provider.GetSwagger(SwaggerConfiguration.ApiVersion, null, "/");
            using var streamWriter = new StringWriter();
            var writer = new OpenApiJsonWriter(streamWriter);
            doc.SerializeAsV3(writer);
            var json = streamWriter.ToString();
            return OpenApiDocument.FromJsonAsync(json);
        }
    }
}