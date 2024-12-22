using Contact.Data.Models;

namespace ContactsApp.Service
{
    public interface IDataProviderService
    {
        List<ContactData> FetchData();
        void CreateData(List<ContactData> contacts);
    }
}
