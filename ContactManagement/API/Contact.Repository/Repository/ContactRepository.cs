using Contact.Data.Models;
using Contact.Repository.Interface;
using ContactsApp.Service;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Contact.Repository.Repository
{
    public class ContactRepository: IContactRepository
    {
        private readonly ILogger<ContactRepository> _logger;
        private readonly IDataProviderService _dataProvider;
        public static int Id = 0;
        public ContactRepository(ILogger<ContactRepository> logger, IDataProviderService dataProvider)
        {
            _logger= logger;
            _dataProvider = dataProvider;
        }

        public ResponseModel Create(ContactData contactData)
        {
            ResponseModel responseModel = new ResponseModel();
            responseModel.RequestTime = DateTime.Now;
            List<string> errors = new List<string>();
          
            try
            {
                var allContacts = _dataProvider.FetchData();
                //var filterData = allContacts.SingleOrDefault(x => x.FirstName.ToUpper().Equals(contactData.FirstName.ToUpper()) && 
                //                 x.LastName.ToUpper().Equals(contactData.LastName.ToUpper()) && x.Email.ToUpper().Equals(contactData.Email));
                var filterData = allContacts.SingleOrDefault(x => x.Email.ToUpper().Equals(contactData.Email.ToUpper()));
                if (filterData == null)
                {
                    contactData.Id = GenId(allContacts);
                    allContacts.Add(contactData);
                    _dataProvider.CreateData(allContacts);
                }
                else
                {
                    errors.Add($"{contactData.Email} is already exists");
                }
                responseModel.Status = filterData == null;
                responseModel.ResponseTime = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException?.Message ?? ex.Message);
                errors.Add(ex.InnerException?.Message ?? ex.Message);
                responseModel.Status = false;
            }
            responseModel.Errors = errors;
            return responseModel;
        }

        public ResponseModel Delete(int id)
        {
            ResponseModel responseModel = new ResponseModel();
            responseModel.RequestTime = DateTime.Now;
            List<string> errors = new List<string>();

            try
            {
                var allContacts = _dataProvider.FetchData();
                var filterData = allContacts.SingleOrDefault(x => x.Id ==id);
                if (filterData != null)
                {
                    allContacts.Remove(filterData);
                   _dataProvider.CreateData(allContacts);
                }
                else
                {
                    errors.Add($"Contact doesn't exists");
                }
                responseModel.Status = filterData != null;
                responseModel.ResponseTime = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException?.Message ?? ex.Message);
                errors.Add(ex.InnerException?.Message ?? ex.Message);
                responseModel.Status = false;
            }
            responseModel.Errors = errors;
            return responseModel;
        }

        public ResponseModel Get()
        {
            ResponseModel responseModel = new ResponseModel();
            responseModel.RequestTime = DateTime.Now;
            List<string> errors = new List<string>();
            List<ContactData> contacts = new();
            try
            {
                contacts = _dataProvider.FetchData().OrderBy(x=>x.Id).ToList();
                responseModel.Status = true;
                responseModel.ResponseTime = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException?.Message ?? ex.Message);
                errors.Add(ex.InnerException?.Message ?? ex.Message);
                responseModel.Status = false;
            }
            responseModel.Errors = errors;
            responseModel.Result = contacts;
            return responseModel;
        }

        public ResponseModel Update(ContactData contactData)
        {
            ResponseModel responseModel = new ResponseModel();
            responseModel.RequestTime = DateTime.Now;
            List<string> errors = new List<string>();

            try
            {
                var allContacts = _dataProvider.FetchData();
                var filterData = allContacts.SingleOrDefault(x => x.Id == contactData.Id);
                if (filterData != null)
                {
                    allContacts.Remove(filterData);
                    var status = allContacts.Any(x => x.Email.ToUpper().Equals(contactData.Email.ToUpper()));
                    responseModel.Status = !status;
                    if (!status)
                    {
                        //allContacts.Remove(filterData);
                        allContacts.Add(contactData);
                        _dataProvider.CreateData(allContacts);
                    }
                    else
                    {
                        errors.Add($"{contactData.Email} is already exists");
                    }
                }
                else
                {
                    errors.Add($"{contactData.Email} doesn't exists");
                }
                responseModel.Status &= filterData != null;
                responseModel.ResponseTime = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException?.Message ?? ex.Message);
                errors.Add(ex.InnerException?.Message ?? ex.Message);
                responseModel.Status = false;
            }
            responseModel.Errors = errors;
            return responseModel;
        }


        private int GenId(List<ContactData> contacts)
        {
            if (contacts.Any())
            {
                Id = contacts.OrderByDescending(x => x.Id).First().Id + 1;
            }
            else
            {
                Id = 1;
            }
            return Id;
        }
    }
}
