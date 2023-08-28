namespace FinAnalysisBackend.Entities
{
    public class OperationResult<T>
    {
        public string Message { get; set; }
        public bool Success { get; set; }

        public T Data { get; set; }

        public OperationResult(string message, bool success, T data)
        {
            Message = message;
            Success = success;
            Data = data;
        }

        public OperationResult(string message, bool success)
        {
            Message = message;
            Success = success;
        }
    }
}
