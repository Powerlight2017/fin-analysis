namespace FinAnalysisBackend.Entities
{
    public class ExpensesResponse
    {
        public string Filter { get; set; }
        public decimal Total { get; set; }
        public Expense[] Expenses { get; set; }
    }
}
