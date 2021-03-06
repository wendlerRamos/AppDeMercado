class Pessoa {
    constructor(nome, email) {
        this.nome = nome;
        this.email = email;
        this.total = 0;
    }
    validarDados() {
        //Verifica se o nome é nulo
        let verifica = localStorage.getItem(this.nome);
        if (!this.nome === null || !this.nome === "" || verifica === null) {
            return true;
        }
        else {
            return false;
        }
    }
    attValorTotal(valorProduto) {
        this.total = this.total + valorProduto;
    }
}
class Produto {
    constructor(descricao, qt, valorU, usuarios) {
        this.descricao = descricao;
        this.qt = qt;
        this.valorU = valorU;
        this.valorT = valorU * qt;
        this.usuarios = usuarios;
    }
    validarProduto() {
        if (this.usuarios.length === 0) {
            return false;
        }
        return Object.values(this).every((valor) => {
            if (!valor) {
                return false;
            }
            return true;
        })
    }
}
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0);
        }
        let usuarios = localStorage.getItem('usuarios');
        if (usuarios === null) {
            usuarios = [];
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId) + 1)
    }
    gravarUsuario(usuario) {
        localStorage.setItem(usuario.nome, JSON.stringify(usuario));
        let usuarios = JSON.parse(localStorage.getItem('usuarios')); //Info dos usuarios
        let nome = usuario.nome;
        usuarios.push(nome); //Lista de usuários
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    buscarUsuario(usuario) {
        usuario = JSON.parse(localStorage.getItem(usuario));
        return usuario;
    }
    alterarValorUsuario(usuario, valor, tipoOperacao) {
        if (tipoOperacao === 'soma') {
            let usuariobd = this.buscarUsuario(usuario);
            if (usuariobd.total === null || usuariobd.total == undefined) {
                usuariobd.total = valor;
            }
            else {
                usuariobd.total += valor;
            }
            localStorage.setItem(usuario, JSON.stringify(usuariobd));
        }
        else if (tipoOperacao === 'subtracao') {
            let usuariobd = this.buscarUsuario(usuario);
            usuariobd.total = usuariobd.total - valor;
            localStorage.setItem(usuario, JSON.stringify(usuariobd));
        }
    }
    buscarTodosNomesUsuarios() {
        let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
        return listaUsuarios;
    }
    gravarProduto(produto) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(produto));
        localStorage.setItem('id', id);
    }
    recuperarTodosRegistros() {
        let id = localStorage.getItem('id');
        let compras = [];
        for (let i = 0; i <= id; i++) {
            let compra = JSON.parse(localStorage.getItem(i));
            if (compra === null || compra == undefined) {
                continue;
            }
            compra.id = i;
            compras.push(compra);
        }
        return compras;
    }
    calcularTotal() {
        let id = localStorage.getItem('id');
        let valorTotal = 0;
        for (let i = 0; i <= id; i++) {
            let compra = JSON.parse(localStorage.getItem(i));
            if (compra === null || compra == undefined) {
                continue;
            }
            valorTotal = valorTotal + compra.valorT;
        }
        return valorTotal;
    }
    remover(id) {
        localStorage.removeItem(id)
    }
    removerCompra(idCompra) {
        let compra = JSON.parse(localStorage.getItem(idCompra));
        let pessoas = compra.usuarios;
        let quant = pessoas.length;
        let valorUser = compra.valorT / quant;
        pessoas.forEach(function blabla(pessoa) {
            bd.alterarValorUsuario(pessoa, valorUser, 'subtracao');
        });
        localStorage.removeItem(idCompra);
        mudarAlert('Sucesso !', 'Item removido da lista com sucesso !', 'success')
    }
}
//Limpa o local storage para cadastrar nova compra
function limparCompra() {
    localStorage.clear();
    sessionStorage.clear();
}
let bd = new Bd();
//Insere uma pessoa para adicionar a compra
function inserirPessoa() {
    let nome = document.getElementById('nome');
    let email = document.getElementById('email');
    let usuario = new Pessoa(nome.value, email.value);
    if (usuario.validarDados()) {
        bd.gravarUsuario(usuario);
        limparCamposUsuario();
        let texto = "Pessoa cadastrada com sucesso !";
        let titulo = "Sucesso";
        mudarAlert(titulo, texto, 'sucesso');
        //$('#modalAppMercado').modal('show');
    }
    else {
        let texto = "Falha na gravação dos dados, por favor, tente novamente com outro nome de usuário";
        let titulo = "Erro"
        mudarAlert(titulo, texto, "erro")
        //$('#modalAppMercado').modal('show')
    }
}
var limparCamposUsuario = function () {
    let nome = document.getElementById("nome");
    let email = document.getElementById("email");
    nome.value = "";
    email.value = "";
}
var limparCamposProduto = function () {
    let produto = document.getElementById("descricao");
    let qt = document.getElementById('qt');
    let valor = document.getElementById('valor');
    produto.value = "";
    qt.value = "";
    valor.value = "";
}

function carregaPessoas() {
    let usuarios = bd.buscarTodosNomesUsuarios();
    let divdeusers = document.getElementById('listadepessoas');
    let elemento = "";
    usuarios.forEach(function bla(usuario) {
        elemento = elemento.concat(`
    <tr>
        <td class='text-center'><p style='font-size: 1.2rem'>${usuario}</p> </td>
        <td  class='text-center'>
            <input id="${usuario}" type='checkbox' checked='true' style= 'width: 50px ;height: 50px'>
        </td>
    </tr>
        `);
    });
    divdeusers.innerHTML = (elemento);
};

function carregaPessoasOld() {
    let usuarios = bd.buscarTodosNomesUsuarios();
    let divdeusers = document.getElementById('listadepessoas');
    let elemento = "";
    usuarios.forEach(function bla(usuario) {
        elemento = elemento.concat(`
    <div class='card' style='width: 12rem'>
        <div class='card-body'>
            <h5 class='card-title'> ${usuario} </h5>
             <input id="${usuario}" type='checkbox' checked='true' style= 'width: 80px ;height: 80px'>
         </div>
     </div>`);
    });
    divdeusers.innerHTML = (elemento);
};

function inserirProduto() {
    let descricao = document.getElementById("descricao");
    let qt = document.getElementById("qt");
    let valor = document.getElementById("valor");
    let usuarios = [];
    let usuariosBd = bd.buscarTodosNomesUsuarios();
    for (let i = 0; i < usuariosBd.length; i++) {
        usuario = usuariosBd[i];
        let check = document.getElementById(usuario);
        if (check.checked) {
            usuarios.push(usuario);
        }
    }
    let produto = new Produto(descricao.value, qt.value, valor.value, usuarios);
    if (produto.validarProduto()) {
        bd.gravarProduto(produto);
        //Alterar valor dos users
        let j = usuarios.length;
        let valorUnitario = ((valor.value * qt.value) / (j));
        for (let i = 0; i < usuarios.length; i++) {
            let aux = usuarios[i];
            bd.alterarValorUsuario(aux, valorUnitario, 'soma');
        }
        let texto = "Produto cadastrado com sucesso !";
        let titulo = "Sucesso";
        mudarAlert(titulo, texto, 'sucesso');
        //$('#modalInserirProduto').modal('show');
    }
    else {
        let texto = "Falha na gravação dos dados, por favor, tente novamente!";
        let titulo = "Erro"
        mudarAlert(titulo, texto, "erro")
        //$('#modalInserirProduto').modal('show')
    }
    limparCamposProduto();
}
//Remove um ítem da lista
function removerItem() {
    localStorage.clear();
    let texto = "Dados removidos com sucesso !";
    let titulo = "Dados Removidos";
    mudarModal(titulo, texto, "erro");
    $('#modalAppMercado').modal('show');
}
var mudarModal = function (titulo, texto, type) {
    $('#tituloModal').removeClass('text-danger');
    $('#botaoModal').removeClass('btn-danger');
    if (type == "erro") {
        document.getElementById("tituloModal").classList.add("text-danger")
        document.getElementById("botaoModal").classList.add("btn-danger")
    }
    else {
        document.getElementById("tituloModal").classList.add("text-success")
        document.getElementById("botaoModal").classList.add("btn-success")
    }
    document.getElementById('tituloModal').innerText = titulo
    document.getElementById('textoDoModal').innerText = texto
}

var mudarAlert = function (titulo, texto, type) {
    $('#notificacaoAlert').removeClass('alert-success')
    $('#notificacaoAlert').removeClass('alert-danger')
    $('#tituloAlert').removeClass('text-danger');
    if (type == "erro") {
        $('#notificacaoAlert').addClass('alert-danger')
        document.getElementById("tituloAlert").classList.add("text-danger")
    }
    else {
        $('#notificacaoAlert').addClass('alert-success')
        document.getElementById("tituloAlert").classList.add("text-success")
    }
    document.getElementById('tituloAlert').innerText = titulo
    document.getElementById('textoDoAlert').innerText = texto
    $("#notificacaoAlert").addClass('show')
    dismissAlert()
}

function dismissAlert(){
  window.setTimeout(function() {
      $(".alert").removeClass('show')
  }, 2000);
}


function listarCompra() {
    let compras = [];
    compras = bd.recuperarTodosRegistros();
    let listaDeCompras = document.getElementById('listaCompras');
    $("#dataTable > tbody").html("");
    compras.forEach(function (aux) {
        let linha = listaDeCompras.insertRow();
        linha.insertCell(0).innerHTML = aux.descricao;
        linha.insertCell(1).innerHTML = aux.qt;
        linha.insertCell(2).innerHTML = (1.0 * aux.valorU).toFixed(2).replace('.',',');
        linha.insertCell(3).innerHTML = aux.valorT.toFixed(2).replace('.',',');
        linha.insertCell(4).innerHTML = aux.usuarios;
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.type = 'button'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_despesa_${aux.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.removerCompra(id)
            //window.location.reload()
            listarCompra()
        }
        linha.insertCell(5).append(btn)
    })
}

function listarRelPessoas() {
    let usuarios = bd.buscarTodosNomesUsuarios();
    let divdeusers = document.getElementById('listadepessoas2');
    let elemento = "";
    usuarios.forEach(function bla(usuario) {
        let pessoa = bd.buscarUsuario(usuario);
        elemento = elemento.concat(`
    <div class='col marging-card'>
        <div class='card'>
            <div class='card-header'>
                <h3 class='text-center'><i class="fa fa-user-o" aria-hidden="true"></i></h3>
            </div>
            <div class='card-body'>
                <h5 class='card-title'>${pessoa.nome}</h5>
                <p class='card-text' style='font-size: 1.2rem'>Valor:<b> ${pessoa.total.toFixed(2).replace('.',',')}</b></p>
            </div>
        </div>
    </div>
    `);
    });
    let valTotal = bd.calcularTotal();
    elemento = elemento.concat(`
    <div class='col marging-card'>
        <div class='card'>
            <div class='card-header'>
                <h3 class='text-center'><i class="fa fa-credit-card" aria-hidden="true"></i></h3>
            </div>
            <div class='card-body'>
                <h5 class='card-title'><b>Total Geral</b></h5>
                <p class='card-text' style='font-size: 1.2rem'>Valor:<b> ${valTotal.toFixed(2).replace('.',',')}</b></p>
            </div>
        </div>
    </div>`);
    divdeusers.innerHTML = (elemento);
}

function listarRelPessoasOld() {
    let usuarios = bd.buscarTodosNomesUsuarios();
    let divdeusers = document.getElementById('listadepessoas');
    let elemento = "";
    usuarios.forEach(function bla(usuario) {
        let pessoa = bd.buscarUsuario(usuario);
        elemento = elemento.concat(`
        <div class='card' style='width: 18rem'>
            <div class='card-body'>
                <h5 class='card-title'> ${pessoa.nome}</h5>
                <p class='card-text'>Valor: ${pessoa.total}</p>
            </div>
        </div>`);
    });
    let valTotal = bd.calcularTotal();
    elemento = elemento.concat(`
        <div class='card' style='width: 18rem'>
            <div class='card-body'>
                <h5 class='card-title'>Total Geral</h5>
                <p class='card-text'>Valor:  ${valTotal}</p>
            </div>
        </div>`);
    divdeusers.innerHTML = (elemento);
}

$('#notificacaoAlert').on('closed.bs.alert', function () {
  // do something…
  console.log("close")
  $this.removeClass("show");
})
