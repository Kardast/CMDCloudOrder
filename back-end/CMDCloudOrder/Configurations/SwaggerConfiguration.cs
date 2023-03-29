using System.Reflection;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using OpenApiInfo = Microsoft.OpenApi.Models.OpenApiInfo;
using OpenApiOperation = Microsoft.OpenApi.Models.OpenApiOperation;

namespace CMDCloudOrder.Configurations;

public static class SwaggerConfiguration
{
    public const string ApiTitle = "CMD Order Web API";
    public const string ApiVersion = "1.0.0";

    public static IServiceCollection AddSwagger(this IServiceCollection source)
    {
        return source
            //.AddSwaggerGenNewtonsoftSupport()
            .AddSwaggerGen(options =>
            {
                options.SwaggerDoc(ApiVersion, new OpenApiInfo { Title = ApiTitle, Version = ApiVersion });
                options.OperationFilter<SwaggerExcludeFilter>();
                options.SchemaFilter<XEnumNamesSchemaFilter>();
                options.MapType<TimeSpan>(() => new OpenApiSchema
                {
                    Type = "string",
                    Example = new OpenApiString("00:00:00")
                });
                options.MapType<DateOnly>(() => new OpenApiSchema
                {
                    Type = "string",
                    Example = new OpenApiString("yyyy-MM-dd")
                });
                options.CustomOperationIds(description => description.TryGetMethodInfo(out MethodInfo methodInfo) ? $"{methodInfo.DeclaringType!.Name.Replace("Controller", string.Empty)}_{methodInfo.Name}" : null);
            });
    }

    public static IApplicationBuilder UseApplicationSwagger(this IApplicationBuilder source)
    {
        source.UseSwagger(new Action<SwaggerOptions>(_ => { }));
        source.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint($"/swagger/{ApiVersion}/swagger.json", $"{ApiTitle} {ApiVersion}");
            c.DocExpansion(DocExpansion.None);
            c.ConfigObject.DisplayRequestDuration = true;
            c.DefaultModelExpandDepth(0);
            c.DefaultModelsExpandDepth(-1);
            c.DisplayOperationId();
        });

        // Activates filters before first server request
        source.ApplicationServices
            .GetRequiredService<ISwaggerProvider>()
            .GetSwagger(ApiVersion, null, "/");
        return source;
    }

    public class XEnumNamesSchemaFilter : ISchemaFilter
    {
        private const string Name = "x-enumNames";

        public void Apply(OpenApiSchema model, SchemaFilterContext context)
        {
            var typeInfo = context.Type;
            if (!typeInfo.IsEnum || model.Extensions.ContainsKey(Name))
            {
                return;
            }

            var names = Enum.GetNames(context.Type);
            var arr = new OpenApiArray();
            arr.AddRange(names.Select(name => new OpenApiString(name)));
            model.Extensions.Add(Name, arr);
        }
    }

    private class SwaggerExcludeFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var ignoredParameters = context
                .ApiDescription
                .ParameterDescriptions
                .Where(pd =>
                {
                    var info = pd.ParameterInfo();
                    if (info == null)
                    {
                        return false;
                    }

                    return info
                        .CustomAttributes
                        .Any(x => x.AttributeType == typeof(SwaggerExcludeAttribute));
                });

            foreach (var ignoredParameter in ignoredParameters)
            {
                var paramToRemove = operation.Parameters.SingleOrDefault(x => x.Name == ignoredParameter.Name);
                if (paramToRemove != null)
                {
                    operation.Parameters.Remove(paramToRemove);
                }
            }
        }
    }
}

[AttributeUsage(AttributeTargets.Parameter)]
public class SwaggerExcludeAttribute : Attribute
{
}