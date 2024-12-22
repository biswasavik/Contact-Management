using Contact.Data.Models;
using Contact.Repository.Interface;
using Contact.Repository.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ContactsApp.Controllers
{
    [ApiController]
    [Route("api")]
    public class ContactController : ControllerBase
    {
        private readonly IContactRepository _repository;
        public ContactController(IContactRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetContacts")]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(_repository.Get());
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("CreateContact")]
        public async Task<IActionResult> Create(ContactData contact)
        {
            try
            {
                return Ok(_repository.Create(contact));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpPost]
        [Route("UpdateContact")]
        public async Task<IActionResult> Update(ContactData contactData)
        {
            try
            {
                return Ok(_repository.Update(contactData));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteContact/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                return Ok(_repository.Delete(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
