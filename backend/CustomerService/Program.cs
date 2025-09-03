using CustomerService.BusinessLayer;
using CustomerService.DAL.Interfaces;
using CustomerService.DAL.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace CustomerService
{
    public class Program
    {

 
        public static void Main(string[] args)
        {
 var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
            builder.Services.AddScoped<CustomerBO>();

            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowAll",
            //        policy => policy.AllowAnyOrigin()
            //                        .AllowAnyMethod()
            //                        .AllowAnyHeader());
            //});

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
                //app.UseCors("AllowFrontend");

            }
            
            app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
            app.UseAuthorization();


            app.MapControllers();

            app.Run();


        }
    }
}
