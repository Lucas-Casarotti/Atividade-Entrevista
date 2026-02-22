$(document).ready(function () {

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true,
            pageSize: 5,
            sorting: true,
            defaultSorting: 'Nome ASC',
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Nome: {
                    title: 'Nome',
                    width: '50%'
                },
                Email: {
                    title: 'Email',
                    width: '30%'
                },
                Acoes: {
                    title: 'Ações',
                    width: '20%',
                    sorting: false,
                    display: function (data) {
                        var clienteId = data.record.Id;
                        var clienteNome = data.record.Nome;

                        return '<button class="btn btn-primary btn-sm btn-alterar-cliente" data-id="' + clienteId + '" style="margin-right:4px;">Alterar</button>' +
                               '<button class="btn btn-danger btn-sm btn-excluir-cliente" data-id="' + clienteId + '" data-nome="' + clienteNome + '">Excluir</button>';
                    }
                }
            }
        });

    // Delegação de evento para botão Alterar
    $(document).on('click', '.btn-alterar-cliente', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).data('id');
        window.location.href = urlAlteracao + '/' + id;
        return false;
    });

    // Delegação de evento para botão Excluir
    $(document).on('click', '.btn-excluir-cliente', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).data('id');
        var nome = $(this).data('nome');

        ConfirmDialog('Confirmar exclusão', 'Confirma a exclusão do cliente "' + nome + '"?', function() {
            $.ajax({
                url: urlExcluir,
                type: 'POST',
                data: { id: id },
                dataType: 'json',
                success: function (response) {
                    ModalDialog('Sucesso!', 'Cliente excluído com sucesso');
                    setTimeout(function() {
                        $('#gridClientes').jtable('load');
                    }, 500);
                },
                error: function (xhr) {
                    var errorMsg = 'Erro ao excluir cliente';
                    try {
                        var resp = JSON.parse(xhr.responseText);
                        errorMsg = resp.Message || errorMsg;
                    } catch(ex) {
                        errorMsg = xhr.responseText || errorMsg;
                    }
                    ModalDialog('Ocorreu um erro', errorMsg);
                }
            });
        });
        return false;
    });

    // Load grid
    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable('load');
});

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
    
    $modal.find('.btn-confirm').click(function() {
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
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(textoHtml);
    $('#' + random).modal('show');
}