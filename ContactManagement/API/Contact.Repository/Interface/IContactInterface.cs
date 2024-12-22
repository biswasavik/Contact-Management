using Contact.Data.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contact.Repository.Interface
{
    public interface IContactRepository
    {
        ResponseModel Get();
        ResponseModel Create(ContactData contactData);
        ResponseModel Update(ContactData contactData);
        ResponseModel Delete(int id);
    }
}
