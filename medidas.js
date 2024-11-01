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
    document.getElementById(`receita_${fase}`).value = "";
    document.getElementById(`orcamento_${fase}`).value = "";
    
    document.getElementById(`medidanova_${fase}`).style.display = "block";
    document.getElementById(`medidasA_${fase}`).style.display = "none";
    document.getElementById(`criarmedidabtn_${fase}`).style.display = "inline-block";
    document.getElementById(`atualizarmedidabtn_${fase}`).value = -1;
    document.getElementById(`atualizarmedidabtn_${fase}`).style.display = "none";
    document.getElementById('btnvoltar').style.display = "none";
    document.getElementById('btnpfase').style.display = "none";
    document.getElementById("gerarPdfBtn").style.display = "none";

}

// Cncelar a medida atual
function cancelar(fase)
{
    // Restaura o valor inicial antes de qualquer modificação
    atualizarTitulo(fase, false);

    // Esconde o formulário de nova medida e exibe a lista de medidas
    document.getElementById(`medidanova_${fase}`).style.display = "none";
    document.getElementById(`medidasA_${fase}`).style.display = "block";
    document.getElementById('btnvoltar').style.display = "block";

    if(fase == 4) document.getElementById('btnpfase').style.display = "block";
    if(fase == 5) document.getElementById("gerarPdfBtn").style.display = "block";
}

function editarmedida(fase, index)
{
    document.getElementById(`medidanova_${fase}`).style.display = "block";
    document.getElementById(`medidasA_${fase}`).style.display = "none";
    document.getElementById(`criarmedidabtn_${fase}`).style.display = "none";
    document.getElementById(`atualizarmedidabtn_${fase}`).style.display = "inline-block";

    document.getElementById(`titulo_${fase}`).value = fases[fase].medidas[index].titulo;
    document.getElementById(`explicacao_${fase}`).value = fases[fase].medidas[index].explicacao;
    document.getElementById(`receita_${fase}`).value = fases[fase].medidas[index].receita;
    document.getElementById(`receita_${fase}`).value = document.getElementById(`receita_${fase}`).value.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById(`orcamento_${fase}`).value = fases[fase].medidas[index].orcamento;
    document.getElementById(`orcamento_${fase}`).value = document.getElementById(`orcamento_${fase}`).value.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById(`atualizarmedidabtn_${fase}`).value = index;
    document.getElementById('btnvoltar').style.display = "none";
    document.getElementById('btnpfase').style.display = "none";
    document.getElementById("gerarPdfBtn").style.display = "block";
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

//Atualiza a medida que está a ser editada
function atualizarmedida(fase)
{
    // Identifica a medida sendo editada
    let index = document.getElementById(`atualizarmedidabtn_${fase}`).value;

    // Obtém os novos valores do formulário
    const titulo = document.getElementById(`titulo_${fase}`).value;
    const explicacao = document.getElementById(`explicacao_${fase}`).value;
    const receita = parseFloat(document.getElementById(`receita_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;
    const orcamento = parseFloat(document.getElementById(`orcamento_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;
    //console.log(orcamento);

    // Verifica se todos os campos estão preenchidos corretamente
    if (!titulo || !explicacao || !orcamento || !receita) {
        alert("Insira todos os parâmetros corretamente.");
        return;
    }
    
    
    // Atualiza a medida no array com os novos valores
    fases[fase].medidas[index] = {
        titulo,
        explicacao,
        receita,
        orcamento
    };

    // Recalcula o valor inicial, se necessário
    let valorInicialAtual = parseFloat(sessionStorage.getItem(`valorInicial_${fase}`)) || 0;

    // Soma todas as receitas das medidas, incluindo o novo valor atualizado
    fases[fase].medidas.forEach(medida => {
        valorInicialAtual += parseFloat(medida.receita) || 0;
    });

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
    const receita = parseFloat(document.getElementById(`receita_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;
    const orcamento = parseFloat(document.getElementById(`orcamento_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;

    if (!titulo || !explicacao || !orcamento || !receita) {
        alert("Insira todos os parâmetros corretamente.");
        return;
    }
        fases[fase].medidas.push({
            titulo,
            explicacao,
            receita,
            orcamento
        });

        let orçamento = 0;
    
        if(fase == 4)
        {
            orçamento = parseFloat(document.getElementById("saude").value.replace(/\./g, '').replace(',', '.')) || 0;
    
        }else if(fase == 5)
        {
            // Seleciona todos os inputs dentro da seção "fase3"
        const inputs = document.querySelectorAll('#fase3 input[type="text"]');
        let temp = Infinity;    // Inicia com o maior valor possível

        for (let input of inputs) 
        {
            const valor = parseFloat(input.value.replace(/\./g, '').replace(',', '.'));
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
            valorInicialAtual += parseFloat(medida.receita) || 0;
        });
        
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

// Adiciona as medidas a tabela
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
    orcamentoTd.textContent = (`-${medida.orcamento}M € / +${medida.receita}M €`).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
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
    document.getElementById("btnpfase").style.display = "block";
    document.getElementById('btnvoltar').style.display = "block";
    document.getElementById("gerarPdfBtn").style.display = "block";
}

function mostrarDetalhesMedida(index, fase) {

    const medida = fases[fase].medidas[index];

    // Atualiza o título do modal com o título da medida
    document.querySelector(`#myModal${fase} .modal-title`).textContent = medida.titulo;

    // Formata o valor da receita
    const receitaFormatada = medida.receita
    .toString()
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Formata o valor do orçamento
    const orcamentoFormatado = medida.orcamento
    .toString()
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Atualiza o corpo do modal com a explicação da medida
    document.querySelector(`#myModal${fase} .modal-body`).innerHTML =`
        <p><strong>Receita:</strong> +${receitaFormatada}M €</p>
        <p><strong>Despesa:</strong> -${orcamentoFormatado}M €</p>
        <p><strong>Explicação:</strong> ${medida.explicacao}</p>
    `;
}

// Define as medidas predefinidas feitas em html em medidas iguais as criadas (Acho que nao vai ser usada)
/*function carregarMedidasPredefinidas(fase) 
{
    // Identifica o tbody onde as medidas predefinidas estão
    const tabela = document.getElementById(`medidasTabela_${fase}`).querySelector("tbody");

    // Itera pelas linhas da tabela e adiciona as medidas à estrutura de medidas
    Array.from(tabela.querySelectorAll("tr")).forEach(linha => {
        const titulo = linha.querySelector("td:nth-child(1)").textContent.trim();
        const receita = linha.querySelector("td:nth-child(2)").textContent.replace('M €', '').trim();
        const orcamento = linha.querySelector("td:nth-child(3)").textContent.replace('M €', '').trim();
        const explicacao = linha.querySelector("td:nth-child(4)").textContent.trim();

        // Adiciona a medida predefinida à estrutura de medidas
        fases[fase].medidas.push({
            titulo: titulo,
            explicacao: explicacao,  // Pode adicionar mais informações se necessário
            receita: parseFloat(receita),
            orcamento: parseFloat(orcamento)
        });
    });
    salvarMedidas(fase);
    first = true;

}*/

// Define as medidas predefinidas feitas em html dependendo do ministerio que foi escolhido
function carregarMedidasPredefinidas(ministerioId) 
{
    console.log(ministerioId);
    console.log(`Medidas_${ministerioId}`);
    
    const medida = document.getElementById(`Medidas_${ministerioId}`);
    if (medida) {
        medida.hidden = false; // Define 'hidden' como falso
    } else {
        console.error(`Elemento com ID "Medidas_${ministerioId}" não encontrado.`);
    }}

// Função para salvar as medidas no sessionStorage
function salvarMedidas(fase) {
    sessionStorage.setItem(`fases_${fase}`, JSON.stringify(fases[fase]));  // Salva o estado da fase
    //console.log(fases[fase]);
}

// Função para restaurar as medidas do sessionStorage
function restaurarMedidas(fase) {
    const faseSalva  = sessionStorage.getItem(`fases_${fase}`);
    //console.log(faseSalva);  // Debug: Verifica se as medidas estão sendo salvas corretamente

    if (faseSalva) {
        fases[fase] = JSON.parse(faseSalva);  // Restaura as medidas e medida ativa
    } else {
        fases[fase] = {
            medidas: [],
        };     
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
