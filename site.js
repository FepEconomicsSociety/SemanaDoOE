let valorInicialTemporario = {}; // Para armazenar o valor inicial temporário para cada fase
let first = true;
var a;
const avisoTimers = {}; // Objeto para armazenar os timers de cada input
// Armazenar valores anteriores dos inputs
const valoresAnteriores = {};

// Função para verificar a senha
function verificarSenha() 
{
    const senhaDigitada = document.getElementById('senhaInput').value;
    const mensagemErro = document.getElementById('mensagemErro');
    const senhaCaixa = document.querySelector('.senha-caixa'); // Seleciona a caixa da senha
    const loading = document.getElementById('loading'); // Seleciona o círculo de carregamento

    // Remove a classe 'incorreta' se já estiver presente
    senhaCaixa.classList.remove('incorreta');
    mensagemErro.textContent = '';
    loading.style.display = 'block'; // Exibe o círculo de carregamento

    fetch("https://server-jvxz.onrender.com/auth/login",{ 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: senhaDigitada })
    })
    .then(response => {
        if (response.ok) 
        {
            first = false;
            return response.json();
        } 
        else 
        {
         // Exibe a fitinha de erro
            senhaCaixa.classList.add('incorreta');     
            // Remove a fitinha após 3 segundos
            setTimeout(() => {
                senhaCaixa.classList.remove('incorreta');

            }, 3000);
            throw new Error(''); 
        }
    })
    .then(data => {
        // Salva o token no sessionStorage  para manter a autenticação
        sessionStorage .setItem('token', data.token); // Armazena o token JWT

        first = false;
        // Salva o estado de login para evitar novo pedido de senha após refresh
        sessionStorage .setItem('autenticado', 'true');
        // Armazena a hora de autenticação quando o login é bem-sucedido
        sessionStorage.setItem('horaInicio', Date.now());  // Define o timestamp no momento da autenticação
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
    
        // Exibir o footer após o login
        document.getElementById('footer').style.display = 'block';
    })
    .catch(error => {
        loading.style.display = 'none'; // Esconde o círculo de carregamento em caso de erro

        mensagemErro.textContent = error.message;
    });
    
}

function pass()
{
    if(a==1)
    {
        document.getElementById('senhaInput').type='password';
        document.getElementById('pass-icon').src='https://FepEconomicsSociety.github.io/SemanaDoOE/images/hide-pass.png';
        a=0;
    }
    else
    {
        document.getElementById('senhaInput').type='text';
        document.getElementById('pass-icon').src='https://FepEconomicsSociety.github.io/SemanaDoOE/images/show-pass.png';
        a=1;
    }
}

// Função para verificar se os campos de nome e e-mail estão preenchidos
function verificarCampos(event) 
{
    event.preventDefault(); // Evita o refresh da página

    const nome = document.getElementById('nome').value.trim();

    if (nome === '') 
    {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Se tudo estiver correto, navega para a próxima fase
    navigateTo('fase1');
}

// Função para validar o formato do e-mail - Sem uso, mas pode ser útil no futuro
function validarEmail(email) 
{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para navegação entre as fases
function navigateTo(faseId) 
{ 
    // Esconder todas as fases
    const fases = document.querySelectorAll('.fase');
    fases.forEach(fase => fase.classList.add('hidden'));

    // Mostrar a fase selecionada
    document.getElementById(faseId).classList.remove('hidden');
    
    // Armazena a fase atual no sessionStorage
    sessionStorage.setItem('faseAtual', faseId);    

    const caixaValorInicial = document.getElementById('caixaValorInicial');

    if (faseId === 'fase3' ) {
        caixaValorInicial.style.display = 'block'; // Exibe a caixa
        diferenca_anual("admint");
    }
    else if (faseId === 'fase4') {
        document.getElementById('caixaValorInicial4').style.display = 'block';  // Exibe a caixa de valor inicial da fase 4
        document.getElementById("btnpfase").style.display = "block";
        inicializarFase(4);
        atualizarTitulo(4,false);  // Atualiza o valor inicial da fase 4
    }
    else if (faseId === 'fase5')
    {
        document.getElementById('caixaValorInicial5').style.display = 'block';  // Exibe a caixa de valor inicial da fase 4
        document.getElementById("gerarPdfBtn").style.display = "block";
        inicializarFase(5);
        atualizarTitulo(5,false);  // Atualiza o valor inicial da fase 4
    }

}

// Inicializa o estado da navegação
function init() 
{
    verificarExpiracao();  // Verifica se os dados devem ser expirados
    restaurarDadosInput();
    //inicializarFase4();
    salvarDadosInput();


    // Verifica se o usuário já está autenticado
    const autenticado = sessionStorage .getItem('autenticado');
    
    if (autenticado === 'true') {
        // Se já estiver autenticado, mostra o conteúdo do site
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
        document.getElementById('footer').style.display = 'block';        // Exibir o footer após o login
        inicializarFase(4);  // Inicializa a fase 4 e garante que o valor inicial será exibido corretamente
        inicializarFase(5);
        
        // Verifica se há uma fase armazenada no sessionStorage
        const faseAtual = sessionStorage.getItem('faseAtual') || 'fase0';  // Se não houver fase armazenada, comece na fase1
        navigateTo(faseAtual);// Navega para a fase armazenada

        diferenca_anual("admint");        // Chama a função para calcular a diferença dos orçamentos depois de inicializar as fases
        
         
    } else {
        // Caso contrário, exibe a página de senha
        document.getElementById('senhaPage').style.display = 'block';
        document.getElementById('conteudoSite').style.display = 'none';
    }
    
    //restaurarValores();

}

/*function diferença_anual()
{
    const numeroInicialElemento = document.getElementById('numeroInicial');

    // Define o valor inicial (100) ou o valor armazenado no sessionStorage
    const valorInicial = 93646.9;
    let totalOrcamentos = 0;



    // Subtrai o total dos orçamentos do valor inicial
    const resultado = totalOrcamentos - valorInicial;

    // Atualiza o valor no título
    numeroInicialElemento.textContent = resultado.toFixed(2);

    // Salva o novo valor no sessionStorage
    sessionStorage.setItem('valorInicial', valorInicial);  // Mantém o valor inicial intacto

}*/

/*function diferenca_anual() {
    const numeroInicialElemento = document.getElementById('numeroInicial');
    let totalOrcamentosFornecidos = 0;

    const inputIds = ['admint', 'agral', 'ambal', 'tecs', 'cterr', 'cult', 'dn', 'ecm', 'educ', 'encge', 
                      'fin', 'hab', 'infa', 'just', 'negest', 'precom', 'saude', 'tsss'];

    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        const valorInput = parseFloat(inputElement.value.replace(/\./g, '').replace(',', '.')) || 0;
        totalOrcamentosFornecidos += valorInput;
    });

    const diferenca = totalOrcamentosFornecidos;
    numeroInicialElemento.textContent = diferenca.toFixed(1).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}*/

function diferenca_anual(id_atual) {
    const numeroInicialElemento = document.getElementById('numeroInicial');
    let totalOrcamentosFornecidos = 0;

    const inputIds = ['admint', 'agral', 'ambal', 'tecs', 'cterr', 'cult', 'dn', 'ecm', 'educ', 'encge', 
                      'fin', 'hab', 'infa', 'just', 'negest', 'precom', 'saude', 'tsss'];

    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        const valorInput = parseFloat(inputElement.value.replace(/\./g, '').replace(',', '.')) || 0;
        totalOrcamentosFornecidos += valorInput;
    });

    const diferenca = totalOrcamentosFornecidos;
    // Verifica se a soma dos orçamentos é maior que 100
    if (diferenca > 100) {
        alert("A soma dos orçamentos não pode ser maior que 100%. O valor será definido como 0.");
        
        // Define o valor de cada input como 0
            const inputElement = document.getElementById(id_atual);
            inputElement.value = '0'; // Define o valor do input como 0
            totalOrcamentosFornecidos = 0;
            inputIds.forEach(id => {
                const inputElement = document.getElementById(id);
                const valorInput = parseFloat(inputElement.value.replace(/\./g, '').replace(',', '.')) || 0;
                totalOrcamentosFornecidos += valorInput;
            });
        
            const resultado = totalOrcamentosFornecidos;
            numeroInicialElemento.textContent = resultado.toFixed(1).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
        // Atualiza o texto se não exceder 100%
        numeroInicialElemento.textContent = diferenca.toFixed(1).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    // Altera a cor da borda com base no total
    const caixaValorInicial = document.querySelector('.caixa-valor-inicial');
    if (parseFloat(totalOrcamentosFornecidos) < 100) {
        document.getElementById("caixaValorInicial").style.color = "red";
        numeroInicialElemento.style.color = "red";
        caixaValorInicial.style.borderColor = 'red'; // Vermelho
    } else if (parseFloat(totalOrcamentosFornecidos) === 100) {
        document.getElementById("caixaValorInicial").style.color = "green";
        numeroInicialElemento.style.color = "green";
        caixaValorInicial.style.borderColor = 'green'; // Verde
    }
}

function formatarpercentagem(input) {
    // Pega a posição inicial do cursor
    const posicaoCursorInicial = input.selectionStart;
    const valorAntigo = input.value.replace('.','');
    input.value = input.value.replace('.','');
    // Remove qualquer caractere que não seja número, vírgula, ou ponto
    input.value = input.value.replace(/[^0-9.,]/g, '');

    // Converte a vírgula em ponto para que o número seja reconhecido como decimal
    let valorNumerico = parseFloat(input.value.replace(',', '.'));

    // Limita o valor entre 0 e 100
    if (valorNumerico - 100 > 0) {
        input.value = 100;
        mostrarAviso(input, "Valor máximo é 100%");
        
    }else {
        removerAviso(input);
    }

    // Formata o valor de volta para o input, com a vírgula como separador decimal
    //input.value = valorNumerico.toString().replace('.', ',');

    // Calcula a nova posição do cursor ajustando pela diferença de tamanho
    let diferencaTamanho = input.value.length - valorAntigo.length;
    let novaPosicao = posicaoCursorInicial + diferencaTamanho;

    // Ajusta a posição do cursor para mantê-lo próximo da posição inicial
    if (novaPosicao < 0) novaPosicao = 0;
    if (novaPosicao > input.value.length) novaPosicao = input.value.length;

    // Restaura a posição do cursor
    input.setSelectionRange(novaPosicao, novaPosicao);
}

function mostrarAviso(input, mensagem) {
    // Verifica se o aviso já existe
    let aviso = input.parentNode.querySelector(".aviso-porcentagem");
    if (!aviso) {
        // Cria um novo elemento de aviso
        aviso = document.createElement("span");
        aviso.className = "aviso-porcentagem";
        aviso.style.color = "red";
        aviso.style.fontSize = "0.9em";
        aviso.style.marginLeft = "8px";
        aviso.textContent = mensagem;

        // Adiciona o aviso ao lado do input
        input.parentNode.appendChild(aviso);
    } else {
        // Se o aviso já existe, apenas atualiza a mensagem
        aviso.textContent = mensagem;
    }

    // Limpa o timer anterior se existir
    const inputId = input.id || input.name; // Use o ID ou nome do input como chave
    clearTimeout(avisoTimers[inputId]);

    // Remove o aviso automaticamente após 3 segundos
    avisoTimers[inputId] = setTimeout(() => {
        removerAviso(input);
        delete avisoTimers[inputId]; // Remove o timer do objeto
    }, 3000);
}

function removerAviso(input) {
    const aviso = input.parentNode.querySelector(".aviso-porcentagem");
    if (aviso) {
        aviso.remove();
    }
}

function formatarNumero(input) {
    // Pega a posição inicial do cursor
    const posicaoCursorInicial = input.selectionStart;
    const valorAntigo = input.value;

    // Remove qualquer caractere que não seja número, vírgula, ponto ou "-" apenas no início
    input.value = input.value.replace(/(?!^-)[^0-9.,]/g, '');

    // Garante que o "-" só esteja no início do valor
    if (input.value.indexOf('-') > 0) {
        input.value = input.value.replace(/-/g, ''); // Remove o sinal se não estiver no início
    }

    // Remove todos os pontos e converte vírgula para ponto (temporariamente)
    let valor = input.value.replace(/\./g, '').replace(',', '.');

    // Formata a parte inteira com pontos nos milhares e vírgula na parte decimal
    const partes = valor.split('.');
    const sinalNegativo = partes[0][0] === '-' ? '-' : ''; // Verifica o sinal
    partes[0] = partes[0].replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formata a parte inteira sem o sinal
    input.value = sinalNegativo + partes.join(',');

    // Calcula a nova posição do cursor ajustando pela diferença de tamanho
    let diferencaTamanho = input.value.length - valorAntigo.length;
    let novaPosicao = posicaoCursorInicial + diferencaTamanho;

    // Se o cursor está depois do "-" e estamos a apagar um dígito que não é o sinal, mantemos a posição
    if (posicaoCursorInicial > 0 && input.value[posicaoCursorInicial - 1] === '-') {
        novaPosicao = Math.max(novaPosicao - 1, 1); // Ajusta para não ir antes do sinal
    }
    else if (input.value[novaPosicao - 1] === '.' && diferencaTamanho > 0) {
        novaPosicao -= 1; // Ajusta para ficar antes do ponto adicionado
    }

    // Ajusta a posição do cursor para mantê-lo próximo da posição inicial
    if (novaPosicao < 0) novaPosicao = 0;
    if (novaPosicao > input.value.length) novaPosicao = input.value.length;

    // Restaura a posição do cursor
    input.setSelectionRange(novaPosicao, novaPosicao);
}

/*Verifica se todos os dados na fase 2 e 3 foram preenchidos antes de continuar*/ 
function finalizarFase(fase) {
    // Seleciona todos os inputs dentro da seção "fase3"
    const inputs = document.querySelectorAll(`#fase${fase} input[type="text"]`);
    const percentagemtotal = parseFloat(document.getElementById('numeroInicial').textContent.replace(',','.'));
    let orcamento_fase;
    if(fase ===4 || fase ===5){ orcamento_fase = parseFloat(document.getElementById(`numeroInicial_${fase}`).textContent.replace('.','').replace(',','.'))}; 

    // Verifica se todos os inputs têm um valor
    let todosPreenchidos = true; // Inicializa como verdadeiro

    for (let input of inputs) {
        if (input.value === '' || input.value === null) {
            todosPreenchidos = false; // Define como falso se algum campo estiver vazio
            break; // Sai do loop se encontrar um campo vazio
        }
    }
    if((fase === 4 && orcamento_fase <0 || fase === 5 && orcamento_fase < 0))
    {
        alert("O orçamento para o ministério nao pode ser negativo!");
    } 
    else if(fase === 4){navigateTo(`fase${fase+1}`);}
    else if (fase ===5){formulario();}
    
    if (todosPreenchidos && fase === 2 || fase === 3 && todosPreenchidos && percentagemtotal === 100) 
    {
        // Se todos os dados estiverem inseridos, permite a navegação
        navigateTo(`fase${fase+1}`); 
    }    
    else if (todosPreenchidos && fase === 3 && percentagemtotal != 100)
    {
        alert("A percentagem total tem que ser 100%.");
    }
    else if(fase === 2 || fase === 3)
    {
        // Se não, exibe uma mensagem de aviso
        alert("Por favor, preencha todos os campos antes de prosseguir.");
    }

}

// Função para atualizar o título do orçamento disponivel do ministerio
function atualizarTitulo(fase, previsualizar = false) 
{
    let orçamento = 0;
    
    if(fase == 4)
    {
        percentagem = parseFloat(document.getElementById("saude").value.replace(/\./g, '').replace(',', '.')) / 100 || 0;
        
        orçamento = 93646.9 * (1 + parseFloat(document.getElementById("pib").value.replace(/\./g, '').replace(',', '.')) / 100) * (percentagem) - 15656.3;

    }else if(fase == 5)
    {
        // Seleciona todos os inputs dentro da seção "fase3"
        const inputs = document.querySelectorAll('#fase3 input[type="text"]');
        let temp = Infinity;    // Inicia com o maior valor possível
        let idMenorValor = "";  // Armazena o id do input com menor valor
        let Nomeministerio = "";  // Para armazenar o nome do ministério com o menor valor
        // Define os IDs que desejas incluir
        const ministeriosDesejados = ['cterr', 'cult', 'negest', 'mhab'];
        for (let input of inputs) 
        {
            if(ministeriosDesejados.includes(input.id))
            {
                const valor = parseFloat(input.value.replace(/\./g, '').replace(',', '.')) / 100;
                if (valor < temp && input.id != "saude") 
                {
                    temp = valor;     // Atualiza o menor valor encontrado
                    idMenorValor = input.id;    // Armazena o id do input com o menor valor
                }
            }
        }

        // Se encontrou um id de menor valor, busca o ministério correspondente
        if (idMenorValor) 
        {
            // Substitui o prefixo do input por "min_" para pegar o ID do ministério
            const ministerioId = `min_${idMenorValor}`;
            Nomeministerio = document.getElementById(ministerioId).textContent;

            // Atualiza o nome da fase 5 com o ministério de menor valor
            document.querySelector('#fase5 h2').textContent = `Fase 5 - Área de ${Nomeministerio}`;

            carregarMedidasPredefinidas(idMenorValor);
            const valoranterior_ministerio = document.getElementById(`v${idMenorValor}`).textContent;
            let valorinicialarea = parseFloat(valoranterior_ministerio.replace(/\./g, '').replace(',', '.').replace("%", "")) / 100 * 93646.9;
            orçamento = 93646.9 * (1 + parseFloat(document.getElementById("pib").value.replace(/\./g, '').replace(',', '.')) / 100) * (temp) - valorinicialarea;
        }
        // document.getElementById("teste").textContent = "Valor inicial: " + valorinicialarea + "; Valor novo: " + 93646.9 * (1 + parseFloat(document.getElementById("pib").value.replace(/\./g, '').replace(',', '.')) / 100) * (temp);
    }

    const numeroInicialElemento = document.getElementById(`numeroInicial_${fase}`);
    const receitaInput = parseFloat(document.getElementById(`receita_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;
    const orcamentoInput = parseFloat(document.getElementById(`orcamento_${fase}`).value.replace(/\./g, '').replace(',', '.')) || 0;

    // Recupera o valor inicial base 
    let valorInicial = parseFloat(document.getElementById(`numeroInicial_${fase}`).value) || orçamento;
  
    // Soma a receita de todas as medidas já adicionadas
    fases[fase].medidas.forEach(medida => {
        valorInicial += parseFloat(medida.receita) || 0;
    });

    // Subtrai o orçamento de todas as medidas já adicionadas
    fases[fase].medidas.forEach(medida => {
        valorInicial -= parseFloat(medida.orcamento) || 0;
    });

 // Durante a pré-visualização, adiciona de volta o valor antigo da medida antes de subtrair o novo
 if (previsualizar && document.getElementById(`atualizarmedidabtn_${fase}`).value >= 0) 
    {
        let index = document.getElementById(`atualizarmedidabtn_${fase}`).value;
        const medidaAtual = fases[fase].medidas[index];
        if (medidaAtual && medidaAtual.orcamento) {  // Verifica se a medida existe
            valorInicial += parseFloat(medidaAtual.orcamento) || 0;  // Adiciona de volta o orçamento antigo
        }
        if (medidaAtual && medidaAtual.receita) {  // Verifica se a medida existe
            valorInicial -= parseFloat(medidaAtual.receita) || 0;  // Adiciona de volta o orçamento antigo
        }
    }
    // Se for pré-visualização, subtrai o valor do orçamento que está sendo digitado
    if (previsualizar) {
        valorInicial -= orcamentoInput;
        valorInicial += receitaInput;
    }
    // Ajusta o valor para zero caso esteja muito próximo de zero
    if (Math.abs(valorInicial) < 0.01) {
        valorInicial = 0;
    }
    // Atualiza o valor exibido na interface    
    numeroInicialElemento.textContent = valorInicial.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
}

// Função para salvar o valor de qualquer campo de input no sessionStorage 
function salvarDadosInput() 
{
    // Seleciona todos os campos de input e textarea
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Salva cada campo no sessionStorage  com a chave sendo o seu id
            sessionStorage .setItem(input.id, input.value);
        });
    });
    
}

// Função para restaurar o valor dos inputs ao carregar a página
function restaurarDadosInput() 
{
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        const valorSalvo = sessionStorage .getItem(input.id);
        if (valorSalvo) 
        {
            input.value = valorSalvo;  // Restaura o valor salvo
        }
    });
}

function verificarExpiracao() 
{
    const horaInicio = sessionStorage .getItem('horaInicio');
    const tresHoras = 3 * 60 * 60 * 1000; // 3 horas em milissegundos 

    // Se a hora de início não existir, significa que é a primeira visita, então definimos a hora de início
    if (!horaInicio) 
    {
        sessionStorage.setItem('horaInicio', Date.now());
    } 
    else 
    {
        // Se já passaram 3 horas, limpar os dados e mostrar o alerta
        if (Date.now() - parseInt(horaInicio) > tresHoras) 
        {
            sessionStorage.clear();
            alert("Os dados expiraram.");
        }
    }
}

function coletarDadosFases() {
    const dados = {
        fase2: {
            pib: document.getElementById('pib').value,
            vcpriv: document.getElementById('vcpriv').value,
            vcpub: document.getElementById('vcpub').value,
            fbcf: document.getElementById('fbcf').value,
            vexp: document.getElementById('vexp').value,
            vimp: document.getElementById('vimp').value,
            infl: document.getElementById('infl').value,
            tdes: document.getElementById('tdes').value,
        },
        fase3: {
            diferencaAnual: document.getElementById('numeroInicial').innerText || 'Não inserido', // Adiciona a diferença anual
            orcamentos: [
                { ministerio: 'Administração Interna', valor: document.getElementById('admint').value || 'Não inserido' },
                { ministerio: 'Agricultura e Alimentação', valor: document.getElementById('agral').value || 'Não inserido' },
                { ministerio: 'Ambiente e Ação Climática', valor: document.getElementById('ambal').value || 'Não inserido' },
                { ministerio: 'Ciência Tecnologia e Ensino Superior', valor: document.getElementById('tecs').value || 'Não inserido' },
                { ministerio: 'Coesão Territorial', valor: document.getElementById('cterr').value || 'Não inserido' },
                { ministerio: 'Cultura', valor: document.getElementById('cult').value || 'Não inserido' },
                { ministerio: 'Defesa Nacional', valor: document.getElementById('dn').value || 'Não inserido' },
                { ministerio: 'Economia e Mar', valor: document.getElementById('ecm').value || 'Não inserido' },
                { ministerio: 'Educação', valor: document.getElementById('educ').value || 'Não inserido' },
                { ministerio: 'Encargos Gerais do Estado', valor: document.getElementById('encge').value || 'Não inserido' },
                { ministerio: 'Finanças', valor: document.getElementById('fin').value || 'Não inserido' },
                { ministerio: 'Habitação', valor: document.getElementById('hab').value || 'Não inserido' },
                { ministerio: 'Infraestruturas', valor: document.getElementById('infa').value || 'Não inserido' },
                { ministerio: 'Justiça', valor: document.getElementById('just').value || 'Não inserido' },
                { ministerio: 'Negócios Estrangeiros', valor: document.getElementById('negest').value || 'Não inserido' },
                { ministerio: 'Presidência do Conselho de Ministros', valor: document.getElementById('precom').value || 'Não inserido' },
                { ministerio: 'Saúde', valor: document.getElementById('saude').value || 'Não inserido' },
                { ministerio: 'Trabalho, Solidariedade e Segurança Social', valor: document.getElementById('tsss').value || 'Não inserido' }
            ]
        },
        fase4: {
            saldoDisponivel: document.getElementById('numeroInicial_4').innerText || 'Não inserido', // Adiciona o saldo disponível da fase 4
            medidas: fases[4].medidas.map(medida => ({
                titulo: medida.titulo,
                receita: medida.receita,
                orcamento: medida.orcamento,
                explicacao: medida.explicacao 
            })),
        },
        fase5: {
            saldoDisponivel: document.getElementById('numeroInicial_5').innerText || 'Não inserido', // Adiciona o saldo disponível da fase 5
            medidas: fases[5].medidas.map(medida => ({
                titulo: medida.titulo,
                receita: medida.receita,
                orcamento: medida.orcamento,
                explicacao: medida.explicacao 
            })),
            //comentarioExtra: document.getElementById('projecaoText').value,
        },
    };
    return dados;
}

function formulario() 
{
    gerarPDF()
        .then((pdfGerado) => {
            if (pdfGerado) 
            {
                // Mostra o botão de confirmação para o usuário
                document.getElementById('confirmarBtn').style.display = 'block';
            } 
            else 
            {
                alert("Erro: O PDF não foi gerado. Por favor, tente novamente.");
            }
        })
        .catch((error) => {
            console.error("Erro ao gerar o PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        });
}

function gerarPDF() {
    return new Promise((resolve, reject) => {
        
        const dados = coletarDadosFases(); // Coleta os dados de todas as fases

        const nomeGrupo = document.getElementById('nome').value;  // Captura o nome do grupo
        // Verifica se o nome do grupo está vazio
        if (!nomeGrupo.trim()) {
            alert("Por favor, insira o nome do grupo.");
            resolve(false);  // Retorna false se o nome do grupo estiver vazio
            navigateTo("fase0");
            return;
        }

        // Cria um elemento temporário para o conteúdo do PDF
        const elementoTemporario = document.createElement('div');
        
        // Criação do conteúdo para o PDF
        let conteudoPDF = `<div class="fase">
                    <h2>Semana do Orçamento de Estado</h2>
                    <p>Grupo: ${nomeGrupo}</p>
                    <h3>Fase 2</h3>
                    <p>Crescimento do PIB real: ${dados.fase2.pib}%</p>
                    <p>Variação do consumo privado: ${dados.fase2.vcpriv}%</p>
                    <p>Variação do consumo público: ${dados.fase2.vcpub}%</p>
                    <p>Variação do investimento (FBCF): ${dados.fase2.fbcf}%</p>
                    <p>Variação das exportações: ${dados.fase2.vexp}%</p>
                    <p>Variação das importações: ${dados.fase2.vimp}%</p>
                    <p>Inflação: ${dados.fase2.infl}%</p>
                    <p>Taxa de desemprego: ${dados.fase2.tdes}%</p>
                   </div>`;

            conteudoPDF +=  `<div class="fase">
                            <h3>Fase 3 - Orçamentação dos ministérios</h3>
                            <h4>Percentagem total: ${dados.fase3.diferencaAnual}%</h4>`; // Adiciona a diferença anual
            dados.fase3.orcamentos.forEach(orcamento => {
                conteudoPDF += `<div class="orcamento-container"> 
                <h4>${orcamento.ministerio}:</h4>
                <p>Percentagem da despesa: ${orcamento.valor}%</p>
            </div>`;
            });
        
        conteudoPDF +=  `</div>
                        <div class="fase">
                        <h3>Fase 4 - Medidas</h3>
                        <h4>Saldo disponível: ${dados.fase4.saldoDisponivel}M €</h4>`; // Adiciona saldo disponível da fase 4


        if (dados.fase4.medidas.length === 0) 
        {
            conteudoPDF += `<p>Nenhuma medida foi adicionada!</p>`;
        } 
        else 
        {
            
            dados.fase4.medidas.forEach(medida => {
                const receitaFormatada = medida.receita
                .toString()
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                const orcamentoFormatado = medida.orcamento
                .toString()
                .replace('.', ',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                conteudoPDF += `<div class="medidas-container"> 
                                <h4>${medida.titulo}:</h4>
                                <p>Receita: +${receitaFormatada}M €</p>
                                <p>Despesa: -${orcamentoFormatado}M €</p>
                                <p>Explicação: ${medida.explicacao}</p>
                                </div>`;            
            });
        }
        conteudoPDF += `</div>
                <div class="fase">
                    <h3>Fase 5</h3>
                    <h4>Saldo disponível: ${dados.fase5.saldoDisponivel}M €</h4>`; // Adiciona saldo disponível da fase 4

                if (dados.fase5.medidas.length === 0) 
                    {
                        conteudoPDF += `<p>Nenhuma medida foi adicionada!</p>
                        </div>`; 
                    } 
                    else 
                    {
                        dados.fase5.medidas.forEach(medida => {
                            const receitaFormatada = medida.receita
                            .toString()
                            .replace('.', ',')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            const orcamentoFormatado = medida.orcamento
                            .toString()
                            .replace('.', ',')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            conteudoPDF += `<h4>${medida.titulo}:</h4>
                                            <p>Receita: +${receitaFormatada}M €</p>
                                            <p>Despesa: -${orcamentoFormatado}M €</p>
                                            <p>Explicação: ${medida.explicacao}</p>`;            
                        });
                    }
        //conteudoPDF += `<h3>Comentários adicionais</h3>`;         
        /*if(dados.fase5.comentarioExtra.length === 0)
        {
            conteudoPDF += `<p>Comentário Extra: Nenhuma explicação foi adicionada!</p>
                            </div>`;
        }
        else
        {
            conteudoPDF +=`<p>Comentário Extra: ${dados.fase5.comentarioExtra}</p>
                        </div>`; 
        }*/
                        
        elementoTemporario.innerHTML = conteudoPDF; // Define o conteúdo gerado no elemento temporário


        // Configurações para o html2pdf
        const opt = {
            margin: 1,
            filename: `SOE_2025_${nomeGrupo}.pdf`,  // Substitui "nomedogrupo" pelo valor inserido
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        // Gera o PDF e retorna uma Promise
            html2pdf().from(elementoTemporario).set(opt).save()
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
// Função para confirmar o envio e limpar os dados após a confirmação do usuário
function confirmarEnvio() {
    const confirmar = confirm("Tem a certeza que deseja terminar? Cetifique-se de que gerou o pdf corretamente antes de finalizar! Esta ação não poderá ser desfeita.");
    
    if (confirmar) {
        sessionStorage.clear();
        alert("Formulário terminado com sucesso. Os dados foram limpos.");
        location.reload();  // Recarrega a página
    } else {
        // Se o usuário escolher cancelar, a função apenas termina sem limpar os dados
        alert("Pode continuar a editar os dados.");
    }
}

window.onload = init;
