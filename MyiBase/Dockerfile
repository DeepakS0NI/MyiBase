FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["MyiBase/MyiBase.csproj", "MyiBase/"]

RUN dotnet restore "MyiBase/MyiBase.csproj"

COPY . .

WORKDIR "/src/MyiBase"

RUN dotnet publish "MyiBase.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "MyiBase.dll"]
