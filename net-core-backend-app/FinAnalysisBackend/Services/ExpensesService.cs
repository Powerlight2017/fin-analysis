using FinAnalysisBackend.Entities;
using FinAnalysisBackend.Utilities;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace FinAnalysisBackend.Services
{
    public class ExpensesService
    {
        private static readonly object FileLock = new object();

        private static string DataFilePath
        {
            get
            {
                return System.IO.Path.Combine(Constants.DataDirectory, Constants.ExpensesFile);
            }
        }

        public IEnumerable<Expense> FilterExpenses(IEnumerable<Expense> expenses, DateTime? startDate, DateTime? endDate, string searchString, int userId)
        {
            var query = expenses.AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(exp => exp.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(exp => exp.Date <= endDate.Value);
            }

            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(exp => exp.Description.Contains(searchString, StringComparison.OrdinalIgnoreCase));
            }

            query = query.Where(x => x.UserId == userId);

            return query.ToList();
        }

        public Expense[] GetExpenses(DateTime? startDate, DateTime? endDate, string? searchString, int userId)
        {
            lock (FileLock)
            {
                string data = System.IO.File.ReadAllText(DataFilePath);
                Expense[] expenses = JsonConvert.DeserializeObject<Expense[]>(data);

                expenses = FilterExpenses(expenses, startDate, endDate, searchString, userId).ToArray();

                return expenses.OrderBy(x => x.Date).ToArray();
            }
        }

        public Expense CreateOrUpdate(Expense expense)
        {
            lock (FileLock)
            {
                string data = System.IO.File.ReadAllText(DataFilePath);
                Expense[] expenses = JsonConvert.DeserializeObject<Expense[]>(data);

                if (expense.Id == 0)
                {
                    expense.Id = GetLastId(expenses);
                    Array.Resize(ref expenses, expenses.Length + 1);
                    expenses[expenses.Length - 1] = expense;
                }
                else
                {
                    for (int i = 0; i < expenses.Length; i++)
                    {
                        if (expenses[i].Id == expense.Id)
                        {
                            expenses[i] = expense;
                        }
                    }
                }

                string updatedData = JsonConvert.SerializeObject(expenses);
                System.IO.File.WriteAllText(DataFilePath, updatedData);
                return expense;
            }
        }

        public void Delete(int id, int userId)
        {
            lock (FileLock)
            {
                string data = System.IO.File.ReadAllText(DataFilePath);
                List<Expense> expenses = JsonConvert.DeserializeObject<Expense[]>(data).ToList();

                Expense expense = expenses.FirstOrDefault(x => x.Id == id);

                if (expense.UserId != userId)
                {
                    throw new Exception("You cannot delete this expense!");
                }

                expenses.RemoveAll(x => x.Id == id);

                string updatedData = JsonConvert.SerializeObject(expenses.ToArray());
                System.IO.File.WriteAllText(DataFilePath, updatedData);
            }
        }

        private int GetLastId(IEnumerable<Expense> expenses)
        {
            return expenses.Count() > 0 ? expenses.Max(r => r.Id) + 1 : 1;
        }
    }
}
