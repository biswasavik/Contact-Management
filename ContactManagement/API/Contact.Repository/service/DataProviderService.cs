using Contact.Data.Models;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using System.Security.Principal;
using System.Xml.Linq;


namespace ContactsApp.Service
{
    public class DataProviderService: IDataProviderService
    {
        private readonly string filePath;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private static int generatedId = 1;
        public DataProviderService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            filePath = Path.Combine(webHostEnvironment.WebRootPath, "contactData.json");
        }

        public void CreateData(List<ContactData> contacts)
        {    
            string json = JsonConvert.SerializeObject(contacts);
            File.WriteAllText(filePath, json);
            
        }

        public List<ContactData> FetchData()
        {
            var Data = ReadJsonFile(filePath);
            return Data;
        }

        public static List<ContactData> ReadJsonFile(string filePath)
        {
            List<ContactData> contactDatas = new();
            try
            {

                var jsonData = File.ReadAllText(filePath);

                if(string.IsNullOrWhiteSpace(jsonData)) return contactDatas;

                contactDatas = JsonConvert.DeserializeObject<List<ContactData>>(jsonData) ?? new();
               
            }
            catch (Exception ex) 
            {
                throw ex;
            }
            return contactDatas;
        }
    }
}
