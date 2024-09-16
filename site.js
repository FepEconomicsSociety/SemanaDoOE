// Função para verificar a senha
function verificarSenha() 
{
    const senhaDigitada = document.getElementById('senhaInput').value;
    const mensagemErro = document.getElementById('mensagemErro');

    fetch("https://server-jvxz.onrender.com/login",{ 
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
        sessionStorage .setItem('token', data.token); // Armazena o token JWT

        // Salva o token no sessionStorage  para manter a autenticação
        sessionStorage .setItem('token2', data.token2);

        // Armazena a hora de autenticação quando o login é bem-sucedido
        sessionStorage.setItem('horaInicio', Date.now());  // Define o timestamp no momento da autenticação

        // Salva o estado de login para evitar novo pedido de senha após refresh
        sessionStorage .setItem('autenticado', 'true');
        sessionStorage .setItem('horaAutenticacao', Date.now());  // Salva o timestamp da autenticação
        
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
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
}

// Inicializa o estado da navegação
function init() 
{
    verificarExpiracao();  // Verifica se os dados devem ser expirados
    restaurarDadosInput();
    inicializarFase4();

    salvarDadosInput();


    // Verifica se o usuário já está autenticado
    const autenticado = sessionStorage .getItem('autenticado');
    
    if (autenticado === 'true') {
        // Se já estiver autenticado, mostra o conteúdo do site
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
    } else {
        // Caso contrário, exibe a página de senha
        document.getElementById('senhaPage').style.display = 'block';
        document.getElementById('conteudoSite').style.display = 'none';
    }
    
    //restaurarValores();

}

// Função para atualizar o título ao subtrair o número inserido do número inicial
function atualizarTitulo() 
{
    const numeroInicialElemento = document.getElementById('numeroInicial');

    // Define o valor inicial (100) ou o valor armazenado no sessionStorage
    const valorInicial = parseFloat(sessionStorage.getItem('valorInicial')) || 100;
    let totalOrcamentos = 0;

    // Recalcula o total dos orçamentos, somando os valores mais recentes de cada medida
    medidas.forEach(medida => {
        totalOrcamentos += parseFloat(medida.orcamento) || 0;
    });

    // Subtrai o total dos orçamentos do valor inicial
    const resultado = valorInicial - totalOrcamentos;

    // Atualiza o valor no título
    numeroInicialElemento.textContent = resultado;

    // Salva o novo valor no sessionStorage
    sessionStorage.setItem('valorInicial', valorInicial);  // Mantém o valor inicial intacto


   /* const numeroInicialElemento = document.getElementById('numeroInicial');
    const numeroInput = document.getElementById('numeroInput').value;

    //const numeroInicial = 100; // Valor inicial definido no título
    const numeroInicial = parseFloat(sessionStorage .getItem('valorInicial')) || 100;
    const numeroSubtrair = parseFloat(numeroInput) || 0; // Converte o input para número ou 0 se vazio

    // Subtrai o número inserido do número inicial
    const resultado = numeroInicial + numeroSubtrair;

    // Atualiza o valor no título
    numeroInicialElemento.textContent = resultado;


    // Salva o novo valor e o valor inserido no sessionStorage 
    sessionStorage .setItem('valorInicial', novoValor);
    sessionStorage .setItem('numeroInput', numeroInput);*/
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

// Função para restaurar os valores do sessionStorage  ao carregar a página
function restaurarValores() 
{
    const numeroInicialElemento = document.getElementById('numeroInicial');
    const numeroInputElemento = document.getElementById('numeroInput');

    // Restaura o valor inicial e o número inserido do sessionStorage 
    const valorInicialSalvo = sessionStorage .getItem('valorInicial') || 100;
    const numeroInputSalvo = sessionStorage .getItem('numeroInput') || 0;

    const resultado =  parseFloat(numeroInputSalvo) +  parseFloat(valorInicialSalvo);

    // Atualiza o valor inicial e o campo de entrada
    numeroInicialElemento.textContent = parseFloat(resultado);
    numeroInputElemento.value = numeroInputSalvo;
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

        if (!textoProjecao.value.trim() || !nomeGrupo.trim()) {
            resolve(false);  // Retorna false se o campo de projeção ou o nome do grupo estiver vazio
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
