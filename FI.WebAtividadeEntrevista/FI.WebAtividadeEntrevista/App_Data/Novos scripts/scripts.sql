ALTER TABLE CLIENTES
ADD CPF VARCHAR(14) NOT NULL;

GO

ALTER TABLE CLIENTES
ADD CONSTRAINT UQ_Clientes_CPF UNIQUE (CPF);

GO

ALTER TABLE BENEFICIARIOS
ALTER COLUMN CPF VARCHAR(14) NOT NULL;

GO

CREATE OR ALTER PROC FI_SP_AltCliente @NOME          VARCHAR (50)
                                     ,@SOBRENOME     VARCHAR (255)
                                     ,@CPF           VARCHAR (14)
                                     ,@NACIONALIDADE VARCHAR (50)
                                     ,@CEP           VARCHAR (9)
                                     ,@ESTADO        VARCHAR (2)
                                     ,@CIDADE        VARCHAR (50)
                                     ,@LOGRADOURO    VARCHAR (500)
                                     ,@EMAIL         VARCHAR (2079)
                                     ,@TELEFONE      VARCHAR (15)
                                     ,@Id            BIGINT
AS
BEGIN
  UPDATE CLIENTES
  SET NOME          = @NOME
     ,SOBRENOME     = @SOBRENOME
     ,CPF           = @CPF
     ,NACIONALIDADE = @NACIONALIDADE
     ,CEP           = @CEP
     ,ESTADO        = @ESTADO
     ,CIDADE        = @CIDADE
     ,LOGRADOURO    = @LOGRADOURO
     ,EMAIL         = @EMAIL
     ,TELEFONE      = @TELEFONE
  WHERE Id = @Id
END

GO

CREATE OR ALTER PROC FI_SP_ConsCliente @ID BIGINT
AS
BEGIN
  IF(ISNULL(@ID,0) = 0)
      SELECT NOME, SOBRENOME, CPF, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, ID FROM CLIENTES WITH(NOLOCK)
  ELSE
      SELECT NOME, SOBRENOME, CPF, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE, ID FROM CLIENTES WITH(NOLOCK) WHERE ID = @ID
END

GO

CREATE OR ALTER PROC FI_SP_DelCliente @ID BIGINT
AS
BEGIN
  -- REMOVENDO OS BENEFICIÁRIOS DO CLIENTE
  DELETE FROM BENEFICIARIOS
  WHERE IDCLIENTE = @ID

  DELETE FROM CLIENTES
  WHERE ID = @ID
END

GO

CREATE OR ALTER PROC FI_SP_IncClienteV2 @NOME          VARCHAR (50)
                                       ,@SOBRENOME     VARCHAR (255)
                                       ,@CPF           VARCHAR (14)
                                       ,@NACIONALIDADE VARCHAR (50)
                                       ,@CEP           VARCHAR (9)
                                       ,@ESTADO        VARCHAR (2)
                                       ,@CIDADE        VARCHAR (50)
                                       ,@LOGRADOURO    VARCHAR (500)
                                       ,@EMAIL         VARCHAR (2079)
                                       ,@TELEFONE      VARCHAR (15)
AS
BEGIN
  INSERT INTO CLIENTES (NOME, SOBRENOME, CPF, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE)
  VALUES (@NOME, @SOBRENOME, @CPF, @NACIONALIDADE,@CEP,@ESTADO,@CIDADE,@LOGRADOURO,@EMAIL,@TELEFONE)

  SELECT SCOPE_IDENTITY()
END

GO

CREATE OR ALTER PROC FI_SP_PesqCliente @iniciarEm      int
                                      ,@quantidade     int
                                      ,@campoOrdenacao varchar(200)
                                      ,@crescente      bit
AS
BEGIN
  DECLARE @SCRIPT NVARCHAR(MAX)
  DECLARE @CAMPOS NVARCHAR(MAX)
  DECLARE @ORDER VARCHAR(50)

  IF(@campoOrdenacao = 'EMAIL')
      SET @ORDER =  ' EMAIL '
  ELSE
      SET @ORDER = ' NOME '

  IF(@crescente = 0)
      SET @ORDER = @ORDER + ' DESC'
  ELSE
      SET @ORDER = @ORDER + ' ASC'

  SET @CAMPOS = '@iniciarEm int,@quantidade int'
  SET @SCRIPT =
  'SELECT ID, NOME, SOBRENOME, CPF, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE FROM
      (SELECT ROW_NUMBER() OVER (ORDER BY ' + @ORDER + ') AS Row, ID, NOME, SOBRENOME, CPF, NACIONALIDADE, CEP, ESTADO, CIDADE, LOGRADOURO, EMAIL, TELEFONE FROM CLIENTES WITH(NOLOCK))
      AS ClientesWithRowNumbers
  WHERE Row > @iniciarEm AND Row <= (@iniciarEm+@quantidade) ORDER BY'

  SET @SCRIPT = @SCRIPT + @ORDER

  EXECUTE SP_EXECUTESQL @SCRIPT, @CAMPOS, @iniciarEm, @quantidade

  SELECT COUNT(1) FROM CLIENTES WITH(NOLOCK)
END

GO

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

GO

CREATE OR ALTER PROC FI_SP_AltBeneficiario @NOME VARCHAR (50)
                                          ,@CPF  VARCHAR (14)
                                          ,@Id   BIGINT
AS
BEGIN
  UPDATE BENEFICIARIOS
  SET NOME          = @NOME
     ,CPF           = @CPF
  WHERE Id = @Id
END

GO

CREATE OR ALTER PROC FI_SP_ConsBeneficiario @ID BIGINT
AS
BEGIN
  SELECT ID, CPF, NOME, IDCLIENTE FROM BENEFICIARIOS WITH(NOLOCK) WHERE IDCLIENTE = @ID
END

GO

CREATE OR ALTER PROC FI_SP_DelBeneficiario @ID BIGINT
AS
BEGIN
  DELETE BENEFICIARIOS WHERE ID = @ID
END

GO

CREATE OR ALTER PROC FI_SP_IncBeneficiarioV2 @CPF       VARCHAR (14)
                                            ,@NOME      VARCHAR (50)
                                            ,@IDCLIENTE BIGINT
AS
BEGIN
  INSERT INTO BENEFICIARIOS (CPF, NOME, IDCLIENTE)
  VALUES (@CPF, @NOME, @IDCLIENTE)

  SELECT SCOPE_IDENTITY()
END

GO

CREATE OR ALTER PROC FI_SP_PesqBeneficiario @iniciarEm      int
                                           ,@quantidade     int
                                           ,@campoOrdenacao varchar(200)
                                           ,@crescente      bit
AS
BEGIN
  DECLARE @SCRIPT NVARCHAR(MAX)
  DECLARE @CAMPOS NVARCHAR(MAX)
  DECLARE @ORDER VARCHAR(50)

  IF(@campoOrdenacao = 'NOME')
      SET @ORDER =  ' NOME '
  ELSE
      SET @ORDER = ' CPF '

  IF(@crescente = 0)
      SET @ORDER = @ORDER + ' DESC'
  ELSE
      SET @ORDER = @ORDER + ' ASC'

  SET @CAMPOS = '@iniciarEm int,@quantidade int'
  SET @SCRIPT =
  'SELECT ID, CPF, NOME FROM
      (SELECT ROW_NUMBER() OVER (ORDER BY ' + @ORDER + ') AS Row, ID, NOME, FROM BENEFICIARIOS WITH(NOLOCK))
      AS BeneficiariosWithRowNumbers
  WHERE Row > @iniciarEm AND Row <= (@iniciarEm+@quantidade) ORDER BY'

  SET @SCRIPT = @SCRIPT + @ORDER

  EXECUTE SP_EXECUTESQL @SCRIPT, @CAMPOS, @iniciarEm, @quantidade

  SELECT COUNT(1) FROM BENEFICIARIOS WITH(NOLOCK)
END

GO

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