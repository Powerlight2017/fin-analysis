using FinAnalysisBackend.Entities;
using FinAnalysisBackend.Services;
using FinAnalysisBackend.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly UsersService _usersService;

    public AuthController(IConfiguration configuration, UsersService usersService)
    {
        _configuration = configuration;
        _usersService = usersService;
    }

    [HttpPost("register")]
    public ActionResult<User> Register(RegisterDto registerDto)
    {
        User user = null;

        user = _usersService.GetByUserName(registerDto.Username);

        if (user != null)
        {
            return StatusCode(500, new OperationResult<User>("Username is taken", false));
        }

        try
        {
            user = _usersService.Register(registerDto.Username, registerDto.Password);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new OperationResult<User>(ex.Message, false));
        }

        return Ok(new OperationResult<User>("", true, user));
    }

    [HttpPost("login")]
    public ActionResult<string> Login(RegisterDto loginDto)
    {
        var user = _usersService.GetByUserName(loginDto.Username);

        if (user == null)
            return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(Convert.FromBase64String(user.PasswordSalt));

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        if (Convert.ToBase64String(computedHash) != user.PasswordHash)
            return Unauthorized("Invalid password");

        var jwtSettings = new JwtSettings();
        _configuration.Bind(nameof(jwtSettings), jwtSettings);

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.ASCII.GetBytes(jwtSettings.Key);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddMinutes(jwtSettings.DurationInMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings.Issuer,
            Audience = jwtSettings.Audience
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new { token = tokenHandler.WriteToken(token) });
    }
}
