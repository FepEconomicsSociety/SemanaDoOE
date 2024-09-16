let medidas = [];  // Array para armazenar todas as medidas
let medidaAtiva = 0;  // Sempre começa na primeira medida

// Função para criar uma nova medida
function criarMedida() 
{
    medidas.push({
        titulo: "",
        explicacao: "",
        orcamento: ""
    });
    
    medidaAtiva = medidas.length - 1;  // Define a nova medida como a ativa
    atualizarInterfaceMedidas();  // Exibe a nova medida
    atualizarAbas();  // Atualiza as abas
    atualizarTitulo();  // Atualiza o valor inicial

}

// Função para salvar automaticamente os dados da medida ativa
function salvarMedidaAtual()
{
    medidas[medidaAtiva].titulo = document.getElementById(`titulo`).value;
    medidas[medidaAtiva].explicacao = document.getElementById(`explicacao`).value;
    medidas[medidaAtiva].orcamento = document.getElementById(`numeroInput`).value;
    atualizarTitulo();  // Atualiza o valor inicial

}

// Função para atualizar a interface e mostrar a medida ativa
function atualizarInterfaceMedidas() 
{
    const medidasContainer = document.getElementById("medidasContainer");
    medidasContainer.innerHTML = "";  // Limpa o container

    // Rótulo e campo de título
    const labelTitulo = document.createElement("p");
    labelTitulo.textContent = "Insira o título:";
    medidasContainer.appendChild(labelTitulo);

    const titulo = document.createElement("textarea");
    titulo.id = `titulo`;
    titulo.rows = 1;
    titulo.cols = 50;
    titulo.placeholder = "Escreva o título da sua medida aqui...";
    titulo.value = medidas[medidaAtiva].titulo;
    titulo.style.minHeight = "30px";
    titulo.style.maxHeight = "30px";
    titulo.oninput = salvarMedidaAtual;  // Salva automaticamente ao digitar
    medidasContainer.appendChild(titulo);

    // Rótulo e campo de explicação
    const labelExplicacao = document.createElement("p");
    labelExplicacao.textContent = "Insira a explicação:";
    medidasContainer.appendChild(labelExplicacao);

    const explicacao = document.createElement("textarea");
    explicacao.id = `explicacao`;
    explicacao.rows = 10;
    explicacao.cols = 50;
    explicacao.placeholder = "Escreva a explicação da medida aqui...";
    explicacao.value = medidas[medidaAtiva].explicacao;
    explicacao.style.minHeight = "100px";
    explicacao.style.maxHeight = "600px";
    explicacao.oninput = salvarMedidaAtual;  // Salva automaticamente ao digitar
    medidasContainer.appendChild(explicacao);

    // Rótulo e campo de orçamento
    const labelOrcamento = document.createElement("p");
    labelOrcamento.textContent = "Insira o orçamento:";
    medidasContainer.appendChild(labelOrcamento);

    const orcamento = document.createElement("input");
    orcamento.type = "number";
    orcamento.id = `numeroInput`;
    orcamento.placeholder = "Digite o orçamento";
    orcamento.value = medidas[medidaAtiva].orcamento;
    orcamento.oninput = salvarMedidaAtual;  // Salva automaticamente ao digitar
    medidasContainer.appendChild(orcamento);


    // Adiciona uma linha em branco antes do botão
    const linhaEmBranco = document.createElement("br");
    medidasContainer.appendChild(linhaEmBranco);

    // Adiciona um botão para apagar a medida atual
    const btnApagar = document.createElement("button");
    btnApagar.id = "btnApagar";
    btnApagar.textContent = "Apagar Medida";
    btnApagar.onclick = function() 
    {
        apagarMedida(medidaAtiva);
    };
    medidasContainer.appendChild(btnApagar);
}

// Função para criar as abas para todas as medidas
function atualizarAbas() {
    const abasContainer = document.getElementById("abasContainer");
    abasContainer.innerHTML = "";  // Limpa todas as abas existentes

    medidas.forEach((_, index) => {
        const aba = document.createElement("button");
        aba.textContent = `Medida ${index + 1}`;
        aba.style.marginRight = "5px";  // Adiciona espaçamento entre os botões das abas
        aba.onclick = function() {
            medidaAtiva = index;  // Define a medida clicada como ativa
            atualizarInterfaceMedidas();  // Exibe a medida ativa
        };
        abasContainer.appendChild(aba);
    });
}

// Função para adicionar uma nova medida
function adicionarMedida() {
    criarMedida();  // Cria a nova medida
    salvarMedidaAtual();  // Salva a medida atual antes de criar uma nova
}

// Função para apagar uma medida
function apagarMedida(index) {
    if (medidas.length > 1) {
        medidas.splice(index, 1);  // Remove a medida da lista
        medidaAtiva = medidas.length - 1;  // Define a última medida como ativa
        atualizarInterfaceMedidas();  // Atualiza a interface
        atualizarAbas();  // Atualiza as abas para refletir as mudanças
        atualizarTitulo();  // Atualiza o valor inicial
    } 
    else 
    {
        alert("Não é possível apagar todas as medidas. Deve haver pelo menos uma.");
    }
}

// Função para inicializar a fase 4 com a primeira medida
function inicializarFase4() {
    if (medidas.length === 0) {
        criarMedida();  // Cria a primeira medida automaticamente
        atualizarAbas();  // Atualiza a aba para refletir a primeira medida
    }
    atualizarInterfaceMedidas();  // Exibe a primeira medida na interface
    atualizarTitulo();  // Atualiza o valor inicial
}

