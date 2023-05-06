using FirebaseAdmin;

Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "Config/keys.json");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSingleton(FirebaseApp.Create());

builder.Services.AddCors(options =>
{
    options.AddPolicy("Policy1",
        policy =>
        {
            policy.WithOrigins("http://192.168.50.81:5173", "http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.50.171:5173").AllowAnyHeader().AllowAnyMethod();
        }) ;
});


builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseRouting();
app.UseHttpsRedirection();

app.UseCors("Policy1");

app.UseAuthorization();

app.MapControllers();

app.Run();
