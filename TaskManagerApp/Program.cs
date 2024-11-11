var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    // beállítjuk, hogy a backend engedélyezze a kéréseket a localhost:4200-ról
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddSignalR();  // Add SignalR

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapControllers();
app.MapHub<TaskHub>("/taskHub");  // Hozzárendeljük a "/taskHub" path-hoz a mi TaskHub típusunkat

app.Run();
