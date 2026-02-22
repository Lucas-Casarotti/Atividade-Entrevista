$(document).ready(function () {
    var idCliente = document.getElementById("IdCliente").value;
    var idClienteElement = document.getElementById("IdCliente");

    var nomeCliente          = document.getElementById("Nome");
    var sobrenomeCliente     = document.getElementById("Sobrenome");
    var cpfCliente           = document.getElementById("CPF");
    var nacionalidadeCliente = document.getElementById("Nacionalidade");
    var cepCliente           = document.getElementById("CEP");
    var estadoCliente        = document.getElementById("Estado");
    var cidadeCliente        = document.getElementById("Cidade");
    var logradouroCliente    = document.getElementById("Logradouro");
    var emailCliente         = document.getElementById("Email");
    var telefoneCliente      = document.getElementById("Telefone");

    var btnSalvarCliente = document.getElementById("btnSalvarCliente");

    var btnBeneficiarios = document.getElementById("btnBeneficiarios");
    
    btnBeneficiarios.disabled = !idCliente > 0;

    $('#formCadastro').submit(function (e) {
        e.preventDefault();        

        var CPF = $(this).find("#CPF").val();
        if (!validarCPF(CPF)) {
            ModalDialog("Ocorreu um erro", "Digite um CPF válido");
            return false;
        }
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "CPF": CPF,
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "CEP": $(this).find("#CEP").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Email": $(this).find("#Email").val(),
                "Telefone": $(this).find("#Telefone").val()
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    nomeCliente.disabled = true;
                    sobrenomeCliente.disabled = true;
                    cpfCliente.disabled = true;
                    nacionalidadeCliente.disabled = true;
                    cepCliente.disabled = true;
                    estadoCliente.disabled = true;
                    cidadeCliente.disabled = true;
                    logradouroCliente.disabled = true;
                    emailCliente.disabled = true;
                    telefoneCliente.disabled = true;
                    btnBeneficiarios.disabled = false;
                    btnSalvarCliente.disabled = true;

                    idClienteElement.value = r.idCliente;
                    ModalDialog("Sucesso!", r.mensagem)
                }

        });
    });

    $('#formCadastroBeneficiario').submit(function (e) {
        e.preventDefault();
        var CPF = $(this).find("#CPF_Beneficiario").val();
        if (!validarCPF(CPF)) {
            ModalDialog("Ocorreu um erro", "Digite um CPF válido");
            return false;
        }

        var idBeneficiario = $(this).find('#IdBeneficiario').val();
        var url = idBeneficiario ? urlAlterarBeneficiario: urlIncluirBeneficiario;

        var dados = {
            "NOME": $(this).find("#Nome_Beneficiario").val(),
            "CPF": CPF
        };

        // Só envia o Id se estiver alterando (não incluindo)
        if (idBeneficiario) {
            dados.Id = idBeneficiario;
        }

        $.ajax({
            url: url,
            method: "POST",
            data: dados,
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastroBeneficiario")[0].reset();
                    $('#IdBeneficiario').val('');
                    $('#btnIncluirBenef').text('Incluir');
                    carregarBeneficiarios();
                }
        });
    });

    // Limpa campos quando o modal é fechado e volta para modo inclusão
    $('#modalBenef').on('hidden.bs.modal', function () {
        $('#CPF_Beneficiario').val('');
        $('#Nome_Beneficiario').val('');
        $('#IdBeneficiario').val('');
        $('#btnIncluirBenef').text('Incluir');
    });

    // Quando abre o modal de beneficiários, carrega a lista
    $('#btnBeneficiarios').on('click', function () {
        carregarBeneficiarios();
    });

    function validarCPF(cpf) {
        if (!cpf) return false;
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        var soma = 0, resto;
        for (var i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11; if (resto === 10) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (var i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11; if (resto === 10) resto = 0;
        return resto === parseInt(cpf.substring(10, 11));
    }

    // ConfirmDialog (copiada de FI.ListClientes.js)
    function ConfirmDialog(titulo, texto, onConfirm) {
        var random = Math.random().toString().replace('.', '');
        var textoHtml = '<div id="' + random + '" class="modal fade">                                                               ' +
            '        <div class="modal-dialog">                                                                                 ' +
            '            <div class="modal-content">                                                                            ' +
            '                <div class="modal-header">                                                                         ' +
            '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
            '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
            '                </div>                                                                                             ' +
            '                <div class="modal-body">                                                                           ' +
            '                    <p>' + texto + '</p>                                                                           ' +
            '                </div>                                                                                             ' +
            '                <div class="modal-footer">                                                                         ' +
            '                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>           ' +
            '                    <button type="button" class="btn btn-danger btn-confirm">Confirmar</button>                    ' +
            '                </div>                                                                                             ' +
            '            </div><!-- /.modal-content -->                                                                         ' +
            '  </div><!-- /.modal-dialog -->                                                                                    ' +
            '</div> <!-- /.modal -->                                                                                        ';

        $('body').append(textoHtml);
        var $modal = $('#' + random);

        $modal.find('.btn-confirm').click(function () {
            $modal.modal('hide');
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
        });

        $modal.on('hidden.bs.modal', function () {
            $modal.remove();
        });

        $modal.modal('show');
    }

    function ModalDialog(titulo, texto) {
        var random = Math.random().toString().replace('.', '');
        var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
            '        <div class="modal-dialog">                                                                                 ' +
            '            <div class="modal-content">                                                                            ' +
            '                <div class="modal-header">                                                                         ' +
            '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
            '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
            '                </div>                                                                                             ' +
            '                <div class="modal-body">                                                                           ' +
            '                    <p>' + texto + '</p>                                                                           ' +
            '                </div>                                                                                             ' +
            '                <div class="modal-footer">                                                                         ' +
            '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
            '                                                                                                                   ' +
            '                </div>                                                                                             ' +
            '            </div><!-- /.modal-content -->                                                                         ' +
            '  </div><!-- /.modal-dialog -->                                                                                    ' +
            '</div> <!-- /.modal -->                                                                                        ';

        $('body').append(texto);
        $('#' + random).modal('show');
    }

    // Função para carregar beneficiários do banco
    function carregarBeneficiarios() { 
        var idCliente = idClienteElement.value;        
        
        $.ajax({
            url: urlListarBeneficiario,
            method: "POST",
            data: { id: idCliente },
            success: function (response) {
                if (response && response.Result === "OK") {
                    renderizarBeneficiarios(response.Records);
                }
            },
            error: function(xhr) {
                console.error('Erro ao carregar beneficiários:', xhr);
                $('#tblBeneficiarios tbody').html('<tr><td colspan="3" class="text-center text-danger">Erro ao carregar beneficiários</td></tr>');
            }
        });
    }
    
    // Função para renderizar beneficiários na tabela
    function renderizarBeneficiarios(beneficiarios) {
        var tbody = $('#tblBeneficiarios tbody');
        tbody.empty();
        
        if (!beneficiarios || beneficiarios.length === 0) {
            tbody.html('<tr><td colspan="3" class="text-center">Nenhum beneficiário cadastrado</td></tr>');
            return;
        }
        
        beneficiarios.forEach(function(benef) {
            var html = '<tr>' +
                '<td>' + (benef.CPF || '') + '</td>' +
                '<td>' + (benef.Nome || '') + '</td>' +
                '<td class="text-center">' +
                '<button type="button" class="btn btn-primary btn-sm btn-alterar-benef" data-id="' + benef.Id + '" data-cpf="' + (benef.CPF || '') + '" data-nome="' + (benef.Nome || '') + '" style="margin-right:4px;">Alterar</button>' +
                '<button type="button" class="btn btn-danger btn-sm btn-excluir-benef" data-id="' + benef.Id + '" data-nome="' + (benef.Nome || '') + '">Excluir</button>' +
                '</td>' +
                '</tr>';
            tbody.append(html);
        });
    }

    // Alterar beneficiário - preenche o formulário
    $(document).on('click', '.btn-alterar-benef', function () {
        var id = $(this).data('id');
        var cpf = $(this).data('cpf');
        var nome = $(this).data('nome');

        $('#IdBeneficiario').val(id);
        $('#CPF_Beneficiario').val(cpf);
        $('#Nome_Beneficiario').val(nome);
        $('#btnIncluirBenef').text('Salvar alterações');
    });

    // Excluir beneficiário (usando ConfirmDialog igual FI.ListClientes.js)
    $(document).on('click', '.btn-excluir-benef', function () {
        var id = $(this).data('id');
        var nome = $(this).data('nome');

        ConfirmDialog('Confirmar exclusão', 'Confirma a exclusão do beneficiário "' + nome + '"?', function () {
            if (typeof urlExcluirBeneficiario === 'undefined' || !urlExcluirBeneficiario) {
                ModalDialog("Erro", "URL de exclusão não configurada.");
                return;
            }

            $.ajax({
                url: urlExcluirBeneficiario,
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function (response) {
                    ModalDialog('Sucesso!', 'Beneficiário excluído com sucesso');
                    setTimeout(function () {
                        carregarBeneficiarios();
                    }, 500);
                },
                error: function (xhr) {
                    var errorMsg = 'Erro ao excluir beneficiário';
                    try {
                        var resp = JSON.parse(xhr.responseText);
                        errorMsg = resp.Message || errorMsg;
                    } catch (ex) {
                        errorMsg = xhr.responseText || errorMsg;
                    }
                    ModalDialog('Ocorreu um erro', errorMsg);
                }
            });
        });
    });
})