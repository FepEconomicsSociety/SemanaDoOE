let fases = {
    4: {
        medidas: [],
        medidaAtiva: 0
    },
    5: {
        medidas: [],
        medidaAtiva: 0
    }
};

// Função para salvar as medidas no sessionStorage
function salvarMedidas(fase) {
    sessionStorage.setItem(`fases_${fase}`, JSON.stringify(fases[fase]));  // Salva o estado da fase
}


// Função para restaurar as medidas do sessionStorage
function restaurarMedidas(fase) {
    const faseSalva  = sessionStorage.getItem(`fases_${fase}`);
    if (faseSalva) {
        fases[fase] = JSON.parse(faseSalva);  // Restaura as medidas e medida ativa
    } else {
        fases[fase] = {
            medidas: [],
            medidaAtiva: 0
        };     
    }
}

function criarMedida(fase, titulo = "", explicacao = "", orcamento = "") {

    fases[fase].medidas.push({
        titulo,
        explicacao,
        orcamento
    });

    fases[fase].medidaAtiva = fases[fase].medidas.length - 1;  // Define a nova medida como a ativa
    salvarMedidas(fase);  // Salva as medidas após a criação
    atualizarInterfaceMedidas(fase);  // Exibe a nova medida
    atualizarAbas(fase);  // Atualiza as abas
    atualizarTitulo(fase);  // Atualiza o valor inicial
}

// Função para salvar automaticamente os dados da medida ativa
function salvarMedidaAtual(fase) {
    const medidaAtiva = fases[fase].medidaAtiva;

    // Verifica se os elementos existem no DOM antes de tentar acessá-los
    const tituloElement = document.getElementById(`titulo_${fase}`);
    const explicacaoElement = document.getElementById(`explicacao_${fase}`);
    const orcamentoElement = document.getElementById(`numeroInput_${fase}`);

    if (tituloElement && explicacaoElement && orcamentoElement) {
        fases[fase].medidas[medidaAtiva].titulo = tituloElement.value;
        fases[fase].medidas[medidaAtiva].explicacao = explicacaoElement.value;
        fases[fase].medidas[medidaAtiva].orcamento = orcamentoElement.value;
        salvarMedidas(fase);  // Salva as medidas após qualquer alteração
        atualizarTitulo(fase);  // Atualiza o valor inicial
    } else {
        console.error(`Erro: Elementos de entrada não encontrados para a fase ${fase}`);
    }
}


// Função para atualizar a interface e mostrar a medida ativa
function atualizarInterfaceMedidas(fase) {
    const medidasContainer = document.getElementById(`medidasContainer${fase}`);
    medidasContainer.innerHTML = "";  // Limpa o container

    const medidaAtiva = fases[fase].medidaAtiva;
    const medida = fases[fase].medidas[medidaAtiva];

    // Rótulo e campo de título
    const labelTitulo = document.createElement("p");
    labelTitulo.textContent = "Insira o título:";
    medidasContainer.appendChild(labelTitulo);

    const titulo = document.createElement("textarea");
    titulo.id = `titulo_${fase}`;
    titulo.rows = 1;
    titulo.cols = 50;
    titulo.placeholder = "Escreva o título da sua medida aqui...";
    titulo.value = medida.titulo;
    titulo.oninput = () => salvarMedidaAtual(fase);  // Associa a função oninput para salvar automaticamente
    medidasContainer.appendChild(titulo);

    // Rótulo e campo de explicação
    const labelExplicacao = document.createElement("p");
    labelExplicacao.textContent = "Insira a explicação:";
    medidasContainer.appendChild(labelExplicacao);

    const explicacao = document.createElement("textarea");
    explicacao.id = `explicacao_${fase}`;
    explicacao.rows = 10;
    explicacao.cols = 50;
    explicacao.placeholder = "Escreva a explicação da medida aqui...";
    explicacao.value = medida.explicacao;
    explicacao.oninput = () => salvarMedidaAtual(fase);  // Associa a função oninput para salvar automaticamente
    medidasContainer.appendChild(explicacao);

    // Rótulo e campo de orçamento
    const labelOrcamento = document.createElement("p");
    labelOrcamento.textContent = "Insira o orçamento:";
    medidasContainer.appendChild(labelOrcamento);

    const orcamento = document.createElement("input");
    orcamento.type = "number";
    orcamento.id = `numeroInput_${fase}`;
    orcamento.placeholder = "Digite o orçamento";
    orcamento.value = medida.orcamento;
    orcamento.oninput = () => salvarMedidaAtual(fase);  // Associa a função oninput para salvar automaticamente
    medidasContainer.appendChild(orcamento);

    // Adiciona um botão para apagar a medida
    const btnApagar = document.createElement("button");
    btnApagar.textContent = "Apagar Medida";
    btnApagar.onclick = () => apagarMedida(fase, medidaAtiva);
    medidasContainer.appendChild(btnApagar);
}



// Função para criar as abas para todas as medidas
function atualizarAbas(fase) {
    const abasContainer = document.getElementById(`abasContainer${fase}`);
    abasContainer.innerHTML = "";  // Limpa todas as abas existentes

    fases[fase].medidas.forEach((_, index) => {
        const aba = document.createElement("button");
        aba.textContent = `Medida ${index + 1}`;
        aba.style.marginRight = "5px";  // Adiciona espaçamento entre os botões das abas
        aba.onclick = () => {
            fases[fase].medidaAtiva = index;  // Define a medida clicada como ativa
            atualizarInterfaceMedidas(fase);  // Exibe a medida ativa
        };
        abasContainer.appendChild(aba);
    });
}

// Função para apagar uma medida
function apagarMedida(fase, index) {
    if (fases[fase].medidas.length > 1) {
        fases[fase].medidas.splice(index, 1);  // Remove a medida da lista
        fases[fase].medidaAtiva = Math.max(0, fases[fase].medidas.length - 1);  // Define a última medida como ativa
        salvarMedidas(fase);  // Salva as medidas após a remoção
        atualizarInterfaceMedidas(fase);  // Atualiza a interface
        atualizarAbas(fase);  // Atualiza as abas para refletir as mudanças
        atualizarTitulo(fase);  // Atualiza o valor inicial
    } else {
        alert("Não é possível apagar todas as medidas. Deve haver pelo menos uma.");
    }
}

// Função para inicializar a fase 4 com a primeira medida
function inicializarFase(fase) {
    // Exibe a caixa de valor inicial da fase 4
    if (fase === 4) {
        document.getElementById('caixaValorInicial4').style.display = 'block';  // Exibe a caixa de valor inicial
    }else if(fase === 5)
    {
        document.getElementById('caixaValorInicial5').style.display = 'block';  // Exibe a caixa de valor inicial
    }

    restaurarMedidas(fase);  // Restaura as medidas ao carregar a página

    if (fases[fase].medidas.length === 0) {
        criarMedida(fase);  // Cria a primeira medida automaticamente se não houver nenhuma
    }

    atualizarAbas(fase);  // Atualiza as abas com base nas medidas restauradas
    atualizarInterfaceMedidas(fase);  // Exibe a medida ativa
    atualizarTitulo(fase);  // Atualiza o valor inicial
}
