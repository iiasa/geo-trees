FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
RUN apt-get update && apt-get install -y --no-install-recommends libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
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
RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm && rm -rf /var/lib/apt/lists/*
RUN dotnet tool install -g Volo.Abp.Cli
ENV PATH="$PATH:/root/.dotnet/tools"
RUN abp install-libs
RUN dotnet publish "IIASA.GeoTrees.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
USER root
WORKDIR /app
COPY --from=publish /app/publish .
RUN chown -R app:app /app
USER app

COPY --chmod=755 <<'EOF' /app/entrypoint.sh
#!/bin/sh
if [ ! -f openiddict.pfx ]; then
  openssl req -x509 -newkey rsa:2048 -keyout /tmp/openiddict.key -out /tmp/openiddict.crt \
    -days 1825 -nodes -subj "/CN=GeoTrees OpenIddict" && \
  openssl pkcs12 -export -out openiddict.pfx -inkey /tmp/openiddict.key -in /tmp/openiddict.crt \
    -passout pass:"$AuthServer__CertificatePassPhrase" && \
  rm /tmp/openiddict.key /tmp/openiddict.crt && \
  chmod 400 openiddict.pfx
fi
dotnet IIASA.GeoTrees.dll --migrate-database
exec dotnet IIASA.GeoTrees.dll
EOF

ENTRYPOINT ["/app/entrypoint.sh"]
