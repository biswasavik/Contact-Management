using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contact.Data.Models
{
    public class ContactData
    {
        //[Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "FirstName is Required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "LastName is Required")]
        public string LastName { get; set; }
        [Required(ErrorMessage ="Email Address is required")]
        [EmailAddress(ErrorMessage = "Email format is wrong")]
        public string Email { get; set; }

    }
}
