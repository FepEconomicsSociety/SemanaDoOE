let fases = {
    4: {
        medidas: [],
        //medidaAtiva: 0
    },
    5: {
        medidas: [],
        //medidaAtiva: 0
    }
};

// Mostrar zona para definir medida
function novamedida(fase)
{
    document.getElementById(`titulo_${fase}`).value = "";
    document.getElementById(`explicacao_${fase}`).value = "";
    document.getElementById(`orcamento_${fase}`).value = "";
    
    document.getElementById(`medidanova_${fase}`).style.display = "block";
    document.getElementById(`medidasA_${fase}`).style.display = "none";
    document.getElementById(`criarmedidabtn_${fase}`).style.display = "inline-block";
    document.getElementById(`atualizarmedidabtn_${fase}`).value = -1;
    document.getElementById(`atualizarmedidabtn_${fase}`).style.display = "none";

}

// Cncelar a medida atual
function cancelar(fase)
{
    // Restaura o valor inicial antes de qualquer modificação
    atualizarTitulo(fase, false);

    // Esconde o formulário de nova medida e exibe a lista de medidas
    document.getElementById(`medidanova_${fase}`).style.display = "none";
    document.getElementById(`medidasA_${fase}`).style.display = "block";
       
}

function editarmedida(fase, index)
{
    document.getElementById(`medidanova_${fase}`).style.display = "block";
    document.getElementById(`medidasA_${fase}`).style.display = "none";
    document.getElementById(`criarmedidabtn_${fase}`).style.display = "none";
    document.getElementById(`atualizarmedidabtn_${fase}`).style.display = "inline-block";

    document.getElementById(`titulo_${fase}`).value = fases[fase].medidas[index].titulo;
    document.getElementById(`explicacao_${fase}`).value = fases[fase].medidas[index].explicacao;
    document.getElementById(`orcamento_${fase}`).value = fases[fase].medidas[index].orcamento;
    document.getElementById(`atualizarmedidabtn_${fase}`).value = index;
}

// Função para apagar uma medida
function apagarMedida(fase, index) 
{
    if (fases[fase].medidas.length > 0) {
        fases[fase].medidas.splice(index, 1);  // Remove a medida da lista
        salvarMedidas(fase);  // Salva as medidas após a remoção
        adicionarMedidaATabela(fase);
        atualizarTitulo(fase, false);  // Atualiza o valor inicial
    } else {
        alert("Não é possível apagar todas as medidas. Deve haver pelo menos uma.");
    }
}

//Atualiza a medida que esta a ser editada
function atualizarmedida(fase)
{
    // Identifica a medida sendo editada
    let index = document.getElementById(`atualizarmedidabtn_${fase}`).value;

    // Obtém os novos valores do formulário
    const titulo = document.getElementById(`titulo_${fase}`).value;
    const explicacao = document.getElementById(`explicacao_${fase}`).value;
    const orcamento = parseFloat(document.getElementById(`orcamento_${fase}`).value) || 0;
    //console.log(orcamento);

    // Verifica se todos os campos estão preenchidos corretamente
    if (!titulo || !explicacao || !orcamento) {
        alert("Insira todos os parâmetros corretamente.");
        return;
    }

    
    // Atualiza a medida no array com os novos valores
    fases[fase].medidas[index] = {
        titulo,
        explicacao,
        orcamento
    };

    // Recalcula o valor inicial, se necessário
    let valorInicialAtual = parseFloat(sessionStorage.getItem(`valorInicial_${fase}`)) || 0;

    // Subtrai todos os orçamentos das medidas, incluindo o novo valor atualizado
    fases[fase].medidas.forEach(medida => {
        valorInicialAtual -= parseFloat(medida.orcamento) || 0;
    });
    //console.log(valorInicialAtual);


    // Atualiza o valor no sessionStorage
    sessionStorage.setItem(`valorInicial_${fase}`, valorInicialAtual);

    // Atualiza o valor inicial na interface
    atualizarTitulo(fase, false);

    // Salva as medidas após a atualização
    salvarMedidas(fase);

    // Atualiza a tabela de medidas e esconde o formulário de edição
    adicionarMedidaATabela(fase);
    document.getElementById(`medidanova_${fase}`).style.display = "none";
    document.getElementById(`medidasA_${fase}`).style.display = "block";
}

// Função para criar as medidas
function criarMedida(fase) 
{

    const titulo = document.getElementById(`titulo_${fase}`).value;
    const explicacao = document.getElementById(`explicacao_${fase}`).value;
    const orcamento = parseFloat(document.getElementById(`orcamento_${fase}`).value) || 0;

    if (!titulo || !explicacao || !orcamento) {
        alert("Insira todos os parâmetros corretamente.");
        return;
    }
        fases[fase].medidas.push({
            titulo,
            explicacao,
            orcamento
        });

        let orçamento = 0;
    
        if(fase == 4)
        {
            orçamento = parseFloat(document.getElementById("saude").value) || 0;
    
        }else if(fase == 5)
        {
            // Seleciona todos os inputs dentro da seção "fase3"
        const inputs = document.querySelectorAll('#fase3 input[type="number"]');
        let temp = Infinity;    // Inicia com o maior valor possível

        for (let input of inputs) 
        {
            const valor = parseFloat(input.value);
            if (valor < temp) 
            {
                temp = valor;     // Atualiza o menor valor encontrado
            }
        }
        orçamento = temp;
        }
       // Recalcula o valor inicial subtraindo o orçamento da nova medida
       let valorInicialAtual = parseFloat(sessionStorage.getItem(`valorInicial_${fase}`)) || orçamento;
    
       // Subtrai todos os orçamentos das medidas, incluindo a nova medida
       fases[fase].medidas.forEach(medida => {
           valorInicialAtual -= parseFloat(medida.orcamento) || 0;
       });
   
       // Atualiza o valor no sessionStorage com o valor final
       sessionStorage.setItem(`valorInicial_${fase}`, valorInicialAtual);
       atualizarTitulo(fase, false);
       salvarMedidas(fase);
   
       // Esconde o formulário de nova medida e volta para a lista de medidas
       document.getElementById(`medidanova_${fase}`).style.display = "none";
       document.getElementById(`medidasA_${fase}`).style.display = "block";
       
       adicionarMedidaATabela(fase);
}

// A diciona as medidas a tabela
function adicionarMedidaATabela(fase) {
    // Identifica o tbody onde as medidas serão inseridas
    const tabela = document.getElementById(`medidasTabela_${fase}`).querySelector("tbody");

    // Limpa apenas o corpo da tabela (as medidas), mantendo o cabeçalho intacto
    tabela.innerHTML = "";  // Limpa apenas o tbody onde as medidas estão

    fases[fase].medidas.forEach((medida, index) => {
    // Cria uma nova linha (tr)
    const novaLinha = document.createElement("tr");
    
    // Cria as células (td) para o título, orçamento e botão de detalhes
    const tituloTd = document.createElement("td");
    tituloTd.textContent = medida.titulo;

    const orcamentoTd = document.createElement("td");
    orcamentoTd.style.textAlign = "center";
    orcamentoTd.textContent = `${medida.orcamento}M €`;
    
    const detalhesTd = document.createElement("td");
    detalhesTd.style.textAlign = "center";
    const detalhesBtn = document.createElement("button");
    detalhesBtn.textContent = "Detalhes";
    detalhesBtn.classList.add("btn", "btn-outline-primary");
    detalhesBtn.setAttribute("data-toggle", "modal");
    detalhesBtn.setAttribute("data-target", `#myModal${fase}`);
    detalhesBtn.onclick = () => mostrarDetalhesMedida(index, fase);  // Chama a função para exibir os detalhes
    detalhesTd.appendChild(detalhesBtn);

    const editarTd = document.createElement("td");
    editarTd.style.textAlign = "center";
    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.onclick = () => editarmedida(fase, index);
    editarBtn.classList.add("btn", "btn-outline-primary");
    editarTd.appendChild(editarBtn);
    
    const apagarTd = document.createElement("td");
    apagarTd.style.textAlign = "center";
    const apagarBtn = document.createElement("button");
    apagarBtn.textContent = "Apagar";
    apagarBtn.onclick = () => apagarMedida(fase, index);
    apagarBtn.classList.add("btn", "btn-outline-primary");
    apagarTd.appendChild(apagarBtn);

    // Adiciona as células à nova linha
    novaLinha.appendChild(tituloTd);
    novaLinha.appendChild(orcamentoTd);
    novaLinha.appendChild(detalhesTd);  
    novaLinha.appendChild(editarTd);  
    novaLinha.appendChild(apagarTd);  


    // Adiciona a nova linha à tabela
    tabela.appendChild(novaLinha);
    });
}

function mostrarDetalhesMedida(index, fase) {

    const medida = fases[fase].medidas[index];

    // Atualiza o título do modal com o título da medida
    document.querySelector(`#myModal${fase} .modal-title`).textContent = medida.titulo;

    // Atualiza o corpo do modal com a explicação da medida
    document.querySelector(`#myModal${fase} .modal-body`).innerHTML = `
        <p><strong>Orçamento:</strong> ${medida.orcamento}M €</p>
        <p><strong>Explicação:</strong> ${medida.explicacao}</p>
    `;
}

// Define as medidas predefinidas feitas em html em medidas iguais as criadas
function carregarMedidasPredefinidas(fase) 
{
    // Identifica o tbody onde as medidas predefinidas estão
    const tabela = document.getElementById(`medidasTabela_${fase}`).querySelector("tbody");

    // Itera pelas linhas da tabela e adiciona as medidas à estrutura de medidas
    Array.from(tabela.querySelectorAll("tr")).forEach(linha => {
        const titulo = linha.querySelector("td:nth-child(1)").textContent.trim();
        const orcamento = linha.querySelector("td:nth-child(2)").textContent.replace('M €', '').trim();
        console.log(titulo);
        console.log(orcamento);

        // Adiciona a medida predefinida à estrutura de medidas
        fases[fase].medidas.push({
            titulo: titulo,
            explicacao: "Medida já existente",  // Pode adicionar mais informações se necessário
            orcamento: parseFloat(orcamento)
        });
    });
    salvarMedidas(fase);
    first = true;

}

// Função para salvar as medidas no sessionStorage
function salvarMedidas(fase) {
    sessionStorage.setItem(`fases_${fase}`, JSON.stringify(fases[fase]));  // Salva o estado da fase
    console.log(fases[fase]);
}

// Função para atualizar a interface e mostrar a medida ativa (NAO ESTA A SER USADA)
function atualizarInterfaceMedidas(fase) {
/*    const medidasContainer = document.getElementById(`medidasContainer${fase}`);
    medidasContainer.innerHTML = "";  // Limpa o container

    const medidaAtiva = fases[fase].medidaAtiva;
    const medida = fases[fase].medidas[medidaAtiva];

    // Rótulo e campo de título
    const labelTitulo = document.createElement("p");
    labelTitulo.textContent = "Diga-nos o título da sua medida";
    medidasContainer.appendChild(labelTitulo);

    const titulo = document.createElement("textarea");
    titulo.id = `titulo_${fase}`;
    titulo.rows = 1;
    titulo.cols = 50;
    titulo.placeholder = "Insira o título";
    titulo.value = medida.titulo;
    titulo.oninput = () => salvarMedidaAtual(fase);  // Associa a função oninput para salvar automaticamente
    medidasContainer.appendChild(titulo);

    // Rótulo e campo de explicação
    const labelExplicacao = document.createElement("p");
    labelExplicacao.textContent = "Deverá explicar-nos o objetivo da medida e como chegou ao valor orçado";
    medidasContainer.appendChild(labelExplicacao);

    const explicacao = document.createElement("textarea");
    explicacao.id = `explicacao_${fase}`;
    explicacao.rows = 10;
    explicacao.cols = 50;
    explicacao.placeholder = "Escreva a explicação aqui";
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
    medidasContainer.appendChild(orcamento);*/

    // Adiciona um botão para apagar a medida
   /* const btnApagar = document.createElement("button");
    btnApagar.textContent = "Apagar Medida";
    btnApagar.onclick = () => apagarMedida(fase, medidaAtiva);
    medidasContainer.appendChild(btnApagar);*/
}

// Função para criar as abas para todas as medidas (NAO ESTA A SER USADA)
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

// Função para restaurar as medidas do sessionStorage
function restaurarMedidas(fase) {
    const faseSalva  = sessionStorage.getItem(`fases_${fase}`);
    console.log(faseSalva);  // Debug: Verifica se as medidas estão sendo salvas corretamente

    if (faseSalva) {
        fases[fase] = JSON.parse(faseSalva);  // Restaura as medidas e medida ativa
    } else {
        fases[fase] = {
            medidas: [],
        };     
    }
}

// Função para salvar automaticamente os dados da medida ativa (NAO ESTA A SER USADA)
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
        atualizarTitulo(fase, false);  // Atualiza o valor inicial
    } else {
        console.error(`Erro: Elementos de entrada não encontrados para a fase ${fase}`);
    }
}

// Função para inicializar a fase 4 com a primeira medida
function inicializarFase(fase) {
    // Exibe a caixa de valor inicial da fase 4
    if (fase === 4) 
    {
        restaurarMedidas(fase);  // Restaura as medidas ao carregar a página
        document.getElementById('caixaValorInicial4').style.display = 'block';  // Exibe a caixa de valor inicial
        adicionarMedidaATabela(fase);
        atualizarTitulo(fase, false);  // Atualiza o valor inicial
    }else if(fase === 5)
    {
        restaurarMedidas(fase);  // Restaura as medidas ao carregar a página
        document.getElementById('caixaValorInicial5').style.display = 'block';  // Exibe a caixa de valor inicial
        adicionarMedidaATabela(fase);
        atualizarTitulo(fase, false);  // Atualiza o valor inicial
    }

}
