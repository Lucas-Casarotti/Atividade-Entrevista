CREATE OR ALTER PROC FI_SP_VerificaBeneficiario @CPF       VARCHAR(14)
                                               ,@Id        BIGINT = NULL
                                               ,@IdCliente BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM CLIENTES WHERE Id = @IdCliente AND CPF = @CPF)
    BEGIN
        SELECT 1 RETURN
    END

    IF (@ID IS NULL)
    BEGIN
        -- Validação para inclusão
        SELECT 1
        FROM BENEFICIARIOS
        WHERE CPF = @CPF
          AND IdCliente = @IdCliente
    END
    ELSE
    BEGIN
        -- Validação para alteração
        SELECT 1
        FROM BENEFICIARIOS
        WHERE CPF = @CPF
          AND IdCliente = @IdCliente
          AND Id <> @Id
    END
END