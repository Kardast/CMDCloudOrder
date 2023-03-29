FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["CMDCloudOrder/CMDCloudOrder.csproj", "CMDCloudOrder/"]
RUN dotnet restore "CMDCloudOrder/CMDCloudOrder.csproj"
COPY . .
WORKDIR "/src/CMDCloudOrder"
RUN dotnet build "CMDCloudOrder.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CMDCloudOrder.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CMDCloudOrder.dll"]
