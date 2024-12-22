using Contact.Data.Models;
using Contact.Repository.Interface;
using Contact.Repository.Repository;
using ContactsApp.Service;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add(new ProducesResponseTypeAttribute(StatusCodes.Status500InternalServerError));
    options.Filters.Add(new ProducesResponseTypeAttribute(StatusCodes.Status400BadRequest));
    options.Filters.Add(new ProducesResponseTypeAttribute(StatusCodes.Status200OK));
})
//.ConfigureApiBehaviorOptions(options =>
//{
//    options.SuppressModelStateInvalidFilter = true;
//})
 .AddJsonOptions(options=>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowCorsPolicy",
        policy => policy.WithOrigins(builder.Configuration["CorsSetting:Origin"])
        .SetIsOriginAllowed(origin => true)
        .AllowAnyHeader().AllowAnyMethod().Build());
});


builder.Services.AddSingleton<IDataProviderService, DataProviderService>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(appBuilder =>
{
    appBuilder.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();
        var path = context.Response.HttpContext.Request.Path;

        if(exceptionHandlerFeature != null)
        {
            CustomExceptionData customExceptionData = new CustomExceptionData();
            customExceptionData.Path = context.Response.HttpContext.Request.Path;
            customExceptionData.ErrorMessage = "An unexpected fault happend. Try again later";
            customExceptionData.InnerException = exceptionHandlerFeature?.Error.ToString() ?? "";
            customExceptionData.MethodType = context.Response.HttpContext.Request.Method.ToString();

            context.Response.StatusCode = (int)StatusCodes.Status500InternalServerError;

            await context.Response.WriteAsync(JsonConvert.SerializeObject(customExceptionData));
        }

    });

});

app.UseCors("AllowCorsPolicy");
app.UseRouting();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
