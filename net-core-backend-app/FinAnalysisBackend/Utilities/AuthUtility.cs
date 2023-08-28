using FinAnalysisBackend.Entities;
using System.Security.Claims;

namespace FinAnalysisBackend.Utilities
{
    public static class AuthUtility
    {
        public static int? GetUserId(this ClaimsPrincipal claimsPrincipal)
        {
            string userIdString = claimsPrincipal.FindFirst("Id")?.Value;

            if (userIdString != null)
            {
                return int.Parse(userIdString);
            }

            return null;
        }
    }
}
