namespace FinAnalysisBackend.Entities
{
    /// <summary>
    /// Expense.
    /// </summary>
    public class Expense
    {
        /// <summary>
        /// Expense sum.
        /// </summary>
        public decimal Sum { get; set; }

        /// <summary>
        /// Expense description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Expense date.
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// User Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Sms id if applicable.
        /// </summary>
        public int Id { get; set; }
    }
}
