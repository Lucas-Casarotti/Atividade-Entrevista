using System.ComponentModel.DataAnnotations; 
using System.Linq;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Cliente
    /// </summary>
    public class ClienteModel
    {
        /// <summary>
        /// Identificador do cliente
        /// </summary>
        public long Id { get; set; }
        
        /// <summary>
        /// CEP
        /// </summary>
        [Required]
        public string CEP { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [MaxLength(14)]
        [Cpf(ErrorMessage = "CPF inválido")]
        public string CPF { get; set; }

        /// <summary>
        /// Cidade
        /// </summary>
        [Required]
        public string Cidade { get; set; }

        /// <summary>
        /// E-mail
        /// </summary>
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage = "Digite um e-mail válido")]
        public string Email { get; set; }

        /// <summary>
        /// Estado
        /// </summary>
        [Required]
        [MaxLength(2)]
        public string Estado { get; set; }

        /// <summary>
        /// Logradouro
        /// </summary>
        [Required]
        public string Logradouro { get; set; }

        /// <summary>
        /// Nacionalidade
        /// </summary>
        [Required]
        public string Nacionalidade { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// Sobrenome
        /// </summary>
        [Required]
        public string Sobrenome { get; set; }

        /// <summary>
        /// Telefone
        /// </summary>
        public string Telefone { get; set; }

    }

    /// <summary>
    /// Validação customizada de CPF.
    /// </summary>
    public class CpfAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var cpf = value as string;

            // Deixe o [Required] tratar valores nulos/vazios
            if (string.IsNullOrWhiteSpace(cpf))
                return ValidationResult.Success;

            // Extrai apenas dígitos
            var digits = new string(cpf.Where(char.IsDigit).ToArray());
            if (digits.Length != 11)
                return new ValidationResult(ErrorMessage ?? "CPF inválido");

            // Rejeita sequências repetidas (ex.: 00000000000)
            if (new string(digits[0], 11) == digits)
                return new ValidationResult(ErrorMessage ?? "CPF inválido");

            int[] nums = digits.Select(c => c - '0').ToArray();

            int soma = 0;
            for (int i = 0; i < 9; i++) soma += nums[i] * (10 - i);
            int rev = (soma * 10) % 11; if (rev == 10) rev = 0;
            if (rev != nums[9]) return new ValidationResult(ErrorMessage ?? "CPF inválido");

            soma = 0;
            for (int i = 0; i < 10; i++) soma += nums[i] * (11 - i);
            rev = (soma * 10) % 11; if (rev == 10) rev = 0;
            if (rev != nums[10]) return new ValidationResult(ErrorMessage ?? "CPF inválido");

            return ValidationResult.Success;
        }
    }
}
