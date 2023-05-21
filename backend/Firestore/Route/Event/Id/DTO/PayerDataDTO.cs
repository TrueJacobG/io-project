namespace Firestore.Route.Event.Id.DTO
{
    public class PayerDataDTO
    {
        public string payer;
        public List<Dictionary<string, string>> debtors;


        public PayerDataDTO()
        {
            this.payer = string.Empty;
            this.debtors = new List<Dictionary<string, string>>();
        }
        public PayerDataDTO(string payer)
        {
            this.payer = payer;
            this.debtors = new List<Dictionary<string, string>>();
        }
        public PayerDataDTO(string payer, List<Dictionary<string, string>> data)
        {
            this.payer = payer;
            this.debtors = data;
        }
    }
}
