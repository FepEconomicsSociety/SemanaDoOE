let valorInicialTemporario = {}; // Para armazenar o valor inicial temporário para cada fase
let first;


// Função para verificar a senha
function verificarSenha() 
{
    const senhaDigitada = document.getElementById('senhaInput').value;
    const mensagemErro = document.getElementById('mensagemErro');

    fetch("https://server-jvxz.onrender.com/auth/login",{ 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: senhaDigitada })
    })
    .then(response => {
        if (response.ok) 
        {
            return response.json();
        } 
        else 
        {
            throw new Error('Senha incorreta');
        }
    })
    .then(data => {
        // Salva o token no sessionStorage  para manter a autenticação
        sessionStorage .setItem('token', data.token); // Armazena o token JWT

        first = false;
        // Armazena a hora de autenticação quando o login é bem-sucedido
        sessionStorage.setItem('horaInicio', Date.now());  // Define o timestamp no momento da autenticação

        // Salva o estado de login para evitar novo pedido de senha após refresh
        sessionStorage .setItem('autenticado', 'true');
        sessionStorage .setItem('horaAutenticacao', Date.now());  // Salva o timestamp da autenticação
        
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
    
        // Exibir o footer após o login
        document.getElementById('footer').style.display = 'block';
    })
    .catch(error => {
        mensagemErro.textContent = error.message;
    });
    
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
    
    // Verifica se todos os inputs têm um valor
    let todosPreenchidos = true; // Inicializa como verdadeiro

    for (let input of inputs) {
        if (input.value === '' || input.value === null) {
            todosPreenchidos = false; // Define como falso se algum campo estiver vazio
            break; // Sai do loop se encontrar um campo vazio
        }
    }

    if (todosPreenchidos) {
        // Se todos os dados estiverem inseridos, permite a navegação
        navigateTo('fase4'); // Altere para a próxima fase que deseja
    } else {
        // Se não, exibe uma mensagem de aviso
        alert("Por favor, preencha todos os campos antes de prosseguir.");
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
        const textoProjecao = document.getElementById('projecaoText');  // Seleciona o textarea correto
        const nomeGrupo = document.getElementById('nome').value;  // Captura o nome do grupo
        // Verifica se o nome do grupo está vazio
        if (!nomeGrupo.trim()) {
            alert("Por favor, insira o nome do grupo.");
            resolve(false);  // Retorna false se o nome do grupo estiver vazio
            navigateTo("fase0");
            return;
        }

        // Verifica se o campo de projeção está vazio
        if (!textoProjecao.value.trim()) {
            alert("Por favor, insira a um comentário extra.");
            resolve(false);  // Retorna false se o campo de projeção estiver vazio
            return;
        }

        // Cria um elemento temporário para o conteúdo do PDF
        const elementoTemporario = document.createElement('div');
        elementoTemporario.innerHTML = `<h2>Projeção Macroeconômica 2025</h2><p>${textoProjecao.value}</p>`;

        // Configurações para o html2pdf
        const opt = {
            margin: 1,
            filename: `SOE_2025_${nomeGrupo}.pdf`,  // Substitui "nomedogrupo" pelo valor inserido
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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


  /*  // Gera o PDF e converte para Base64
    html2pdf().from(elementoTemporario).set(opt).outputPdf('datauristring').then(function(pdfBase64) {
        // Remove o prefixo "data:application/pdf;base64," para enviar somente o Base64
        pdfBase64 = pdfBase64.split(',')[1];
        
        // Atualiza o campo de entrada oculto com o PDF em Base64
        document.getElementById('pdfBase64').value = pdfBase64;

        // Submete o formulário
        document.getElementById('emailForm').submit();
    });
*/

      /*  // Gera o PDF e converte para Data URL (base64)
        html2pdf().from(elementoTemporario).set(opt).outputPdf('dataurlstring').then(function(pdfBase64) {
            // Converte o Data URL para um Blob
            const pdfBlob = dataURLToBlob(pdfBase64);
    
            // Envia o PDF para o servidor
            enviarPDFParaServidor(pdfBlob);
        });*/
}

/*// Função para converter dataURL para Blob
function dataURLToBlob(dataURL) {
    const arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// Função para enviar o PDF para o servidor
function enviarPDFParaServidor(pdfBlob) {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'ProjecaoMacroeconomica2025.pdf');

    fetch('http://localhost:3000/enviar-email', {  // Substitua pela URL do seu servidor
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('PDF enviado por e-mail com sucesso!');
        console.log('Resposta do servidor:', data);
    })
    .catch(error => {
        console.error('Erro ao enviar o PDF:', error);
        alert('Erro ao enviar o PDF.');
    });
}
*/

window.onload = init;
