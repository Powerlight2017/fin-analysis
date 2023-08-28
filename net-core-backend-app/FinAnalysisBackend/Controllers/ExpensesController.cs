using FinAnalysisBackend.Entities;
using FinAnalysisBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinAnalysisBackend.Utilities;

namespace FinAnalysisBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpensesService _expensesService;
        private readonly ILogger<ExpensesController> _logger;

        public ExpensesController(ILogger<ExpensesController> logger, ExpensesService expensesService)
        {
            _logger = logger;
            _expensesService = expensesService;
        }

        [HttpGet("GetExpenses", Name = "GetExpenses")]
        public Expense[] GetExpenses(DateTime? startDate, DateTime? endDate, string? filter)
        {
            return _expensesService.GetExpenses(startDate, endDate, filter, User.GetUserId().Value);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Expense newExpense)
        {
            try
            {
                newExpense.UserId = User.GetUserId().Value;

                Expense result = _expensesService.CreateOrUpdate(newExpense);

                return Ok(new OperationResult<Expense>(string.Empty, true, newExpense));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResult<Expense>(ex.Message, false));
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] Expense updatedExpense)
        {
            try
            {
                updatedExpense.UserId = User.GetUserId().Value;
                Expense result = _expensesService.CreateOrUpdate(updatedExpense);
                return Ok(new OperationResult<Expense>(string.Empty, true, result));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResult<Expense>(ex.Message, false));
            }
        }

        [HttpDelete("{Id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _expensesService.Delete(id, User.GetUserId().Value);
                return Ok(new OperationResult<Expense>(string.Empty, true));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResult<Expense>(ex.Message, false));
            }
        }
    }
}
