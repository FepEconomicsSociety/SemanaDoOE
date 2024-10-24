let valorInicialTemporario = {}; // Para armazenar o valor inicial temporário para cada fase
let first = true;
var a;

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
            carregarMedidasPredefinidas(4);
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
        diferenca_anual();
    }
    else if (faseId === 'fase4') {
        document.getElementById('caixaValorInicial4').style.display = 'block';  // Exibe a caixa de valor inicial da fase 4
        inicializarFase(4);
        atualizarTitulo(4,false);  // Atualiza o valor inicial da fase 4
    }
    else if (faseId === 'fase5')
    {
        document.getElementById('caixaValorInicial5').style.display = 'block';  // Exibe a caixa de valor inicial da fase 4
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

        diferenca_anual();        // Chama a função para calcular a diferença dos orçamentos depois de inicializar as fases
        
         
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

function diferenca_anual() {
    const numeroInicialElemento = document.getElementById('numeroInicial');

    // Variável para armazenar a soma dos valores já fornecidos (da primeira tabela)
   /* let totalOrcamentosExistentes = 0;*/

    // Variável para armazenar a soma dos valores inseridos nos inputs (da segunda tabela)
    let totalOrcamentosFornecidos = 0;

    // Obter todos os valores da primeira tabela (já fornecidos)
   /* const valoresExistentes = document.querySelectorAll('.valor');  // Pega todas as células com a classe "valor"
    valoresExistentes.forEach(valor => {
        // Remove caracteres não numéricos (exceto ponto e vírgula) e converte para float
        const valorNumerico = parseFloat(valor.textContent.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
        totalOrcamentosExistentes += valorNumerico;  // Soma o valor existente
    });
*/
    // IDs dos inputs que possuem os novos valores fornecidos
    const inputIds = ['admint', 'agral', 'ambal', 'tecs', 'cterr', 'cult', 'dn', 'ecm', 'educ', 'encge', 
                      'fin', 'hab', 'infa', 'just', 'negest', 'precom', 'saude', 'tsss'];

    // Somar os valores dos inputs fornecidos
    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        const valorInput = parseFloat(inputElement.value) || 0;  // Se o valor não for inserido, assume 0
        totalOrcamentosFornecidos += valorInput;  // Soma o valor fornecido
    });

    // Calcula a diferença entre a soma dos orçamentos fornecidos e os orçamentos existentes
    const diferenca = totalOrcamentosFornecidos - 93646.9;

    // Atualiza o valor da diferença na interface (elemento 'numeroInicial')
    numeroInicialElemento.textContent = diferenca.toFixed(2);
}

/*Verifica se todos os dados na fase 3 foram preenchidos antes de continuar*/ 
function finalizarFase3() {
    // Seleciona todos os inputs dentro da seção "fase3"
    const inputs = document.querySelectorAll('#fase3 input[type="number"]');
    const inputs2 = document.querySelectorAll('#fase2 input[type="number"]');
    // Verifica se todos os inputs têm um valor
    let todosPreenchidos = true; // Inicializa como verdadeiro
    let todosPreenchidos2 = true; // Inicializa como verdadeiro

    for (let input of inputs) {
        if (input.value === '' || input.value === null) {
            todosPreenchidos = false; // Define como falso se algum campo estiver vazio
            break; // Sai do loop se encontrar um campo vazio
        }
    }
    for (let input of inputs2) {
        if (input.value === '' || input.value === null) {
            todosPreenchidos2 = false; // Define como falso se algum campo estiver vazio
            break; // Sai do loop se encontrar um campo vazio
        }
    }

    if (todosPreenchidos && todosPreenchidos2) 
    {
        // Se todos os dados estiverem inseridos, permite a navegação
        navigateTo('fase4'); // Altere para a próxima fase que deseja
    } 
    else if(todosPreenchidos && !todosPreenchidos2)
    {
        // Se não, exibe uma mensagem de aviso
        alert("Por favor, preencha todos os campos da fase 2 antes de prosseguir.");
    }
    else if(!todosPreenchidos && todosPreenchidos2)
    {
        alert("Por favor, preencha todos os campos da fase 3 antes de prosseguir.");
    }
    else
    {
        alert("Por favor, preencha todos os campos das fases 2 e 3 antes de prosseguir.");
    }
}

/*function finalizarFase3() {
    
    const orcamentoFase3 = parseFloat(document.getElementById('saude').value);
    if(orcamentoFase3 === 0)
    {
        alert("insira o valor para a saude");
        return;
    }
    else
    {
        sessionStorage.setItem('orcamentoFase3', orcamentoFase3); // Armazena o valor no sessionStorage
        navigateTo('fase4');
    }
    
}*/
// Função para atualizar o título ao subtrair o número inserido do número inicial

function atualizarTitulo(fase, previsualizar = false) 
{
    let orçamento = 0;
    
    if(fase == 4)
    {
        orçamento = parseFloat(document.getElementById("saude").value) || 0;

    }else if(fase == 5)
    {
        // Seleciona todos os inputs dentro da seção "fase3"
        const inputs = document.querySelectorAll('#fase3 input[type="number"]');
        let temp = Infinity;    // Inicia com o maior valor possível
        let idMenorValor = "";  // Armazena o id do input com menor valor
        let Nomeministerio = "";  // Para armazenar o nome do ministério com o menor valor

        for (let input of inputs) 
        {
            const valor = parseFloat(input.value);
            if (valor < temp && input.id != "saude") 
            {
                temp = valor;     // Atualiza o menor valor encontrado
                idMenorValor = input.id;    // Armazena o id do input com o menor valor
            }
        }

        // Se encontrou um id de menor valor, busca o ministério correspondente
        if (idMenorValor) 
        {
            // Substitui o prefixo do input por "min_" para pegar o ID do ministério
            const ministerioId = `min_${idMenorValor}`;
            Nomeministerio = document.getElementById(ministerioId).textContent;

            // Atualiza o nome da fase 5 com o ministério de menor valor
            document.querySelector('#fase5 h2').textContent = `Fase 5 - Ministério de ${Nomeministerio}`;
        }
        orçamento = temp;
    }

    const numeroInicialElemento = document.getElementById(`numeroInicial_${fase}`);
    const orcamentoInput = parseFloat(document.getElementById(`orcamento_${fase}`).value) || 0;


    // Recupera o valor inicial base (armazenado ou default 100)
    let valorInicial = parseFloat(document.getElementById(`numeroInicial_${fase}`).value) || orçamento;
  
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
    }
    // Se for pré-visualização, subtrai o valor do orçamento que está sendo digitado
    if (previsualizar) {
        valorInicial -= orcamentoInput;
    }

    // Atualiza o valor exibido na interface
    numeroInicialElemento.textContent = valorInicial.toFixed(2);
    
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
            medidas: fases[4].medidas.map(medida => ({
                titulo: medida.titulo,
                orcamento: medida.orcamento,
                explicacao: medida.explicacao 
            })),
        },
        fase5: {
            medidas: fases[5].medidas.map(medida => ({
                titulo: medida.titulo,
                orcamento: medida.orcamento,
                explicacao: medida.explicacao 
            })),
            comentarioExtra: document.getElementById('projecaoText').value,
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
                            <h3>Fase 3 - Orçamentação dos ministérios</h3>`;
            dados.fase3.orcamentos.forEach(orcamento => {
                conteudoPDF += `<div class="orcamento-container"> 
                <h4>${orcamento.ministerio}:</h4>
                <p>Orçamento: ${orcamento.valor}M €</p>
            </div>`;
            });
        
        conteudoPDF +=  `</div>
                        <div class="fase">
                        <h3>Fase 4 - Medidas</h3>`;

        if (dados.fase4.medidas.length === 0) 
        {
            conteudoPDF += `<p>Nenhuma medida foi adicionada!</p>`;
        } 
        else 
        {
            dados.fase4.medidas.forEach(medida => {
                conteudoPDF += `<div class="medidas-container"> 
                                <h4>${medida.titulo}:</h4>
                                <p>Orçamento: ${medida.orcamento}M €</p>
                                <p>Explicação: ${medida.explicacao}</p>
                                </div>`;            
            });
        }
        conteudoPDF += `</div>
                <div class="fase">
                    <h3>Fase 5</h3>`;
                if (dados.fase5.medidas.length === 0) 
                    {
                        conteudoPDF += `<p>Nenhuma medida foi adicionada!</p>
                        </div>`; 
                    } 
                    else 
                    {
                        dados.fase5.medidas.forEach(medida => {
                            conteudoPDF += `<h4>${medida.titulo}:</h4>
                                            <p>Orçamento: ${medida.orcamento}M €</p>
                                            <p>Explicação: ${medida.explicacao}</p>`;            
                        });
                    }
        conteudoPDF += `<h3>Comentários adicionais</h3>`;         
        if(dados.fase5.comentarioExtra.length === 0)
        {
            conteudoPDF += `<p>Comentário Extra: Nenhuma explicação foi adicionada!</p>
                            </div>`;
        }
        else
        {
            conteudoPDF +=`<p>Comentário Extra: ${dados.fase5.comentarioExtra}</p>
                        </div>`; 
        }
                        
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
    sessionStorage.clear();
    alert("Dados enviados com sucesso. Os dados foram limpos.");
    location.reload();  // Recarrega a página

}

window.onload = init;
