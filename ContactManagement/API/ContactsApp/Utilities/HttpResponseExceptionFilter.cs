using Contact.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Web.Http;


namespace ContactsApp.Utilities
{
    public class HttpResponseExceptionFilter: ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is HttpResponseException exception)
            {
                CustomExceptionData exceptionData = new CustomExceptionData
                {
                    ErrorMessage = exception.Message,
                    InnerException = exception.InnerException?.Message ?? "",
                    Path = Convert.ToString(context.RouteData.Values)
                };

                context.Result = new ObjectResult(exceptionData)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
                context.ExceptionHandled = true;
            }
        }
    }
}
