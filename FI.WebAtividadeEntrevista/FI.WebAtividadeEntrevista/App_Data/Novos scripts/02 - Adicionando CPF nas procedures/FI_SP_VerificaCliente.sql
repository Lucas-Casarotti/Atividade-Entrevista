CREATE OR ALTER PROC FI_SP_VerificaCliente @CPF VARCHAR(14)
                                          ,@Id  BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF (@ID IS NULL)
    BEGIN
        -- Validação para inclusão
        SELECT 1 
        FROM CLIENTES 
        WHERE CPF = @CPF
    END
    ELSE
    BEGIN
        -- Validação para alteração
        SELECT 1 
        FROM CLIENTES 
        WHERE CPF = @CPF
          AND ID <> @ID
    END
END