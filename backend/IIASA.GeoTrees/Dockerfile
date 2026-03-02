FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["backend/IIASA.GeoTrees/IIASA.GeoTrees.csproj", "backend/IIASA.GeoTrees/"]
RUN dotnet restore "backend/IIASA.GeoTrees/IIASA.GeoTrees.csproj"
COPY . .
WORKDIR "/src/backend/IIASA.GeoTrees"
RUN dotnet build "IIASA.GeoTrees.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "IIASA.GeoTrees.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IIASA.GeoTrees.dll"]
