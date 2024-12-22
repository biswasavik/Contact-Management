using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contact.Data.Models
{
    public class CustomExceptionData
    {
        public string ErrorMessage { get; set; }
        public string InnerException { get; set; }
        public string Path { get; set; }
        public string MethodType {  get; set; }
    }
}
