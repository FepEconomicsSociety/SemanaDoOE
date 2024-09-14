// Função para verificar a senha
function verificarSenha() {
    //const senhaCorreta = "34567";  // Defina sua senha aqui
    const senhaDigitada = document.getElementById('senhaInput').value;
    const mensagemErro = document.getElementById('mensagemErro');

    fetch("https://server-jvxz.onrender.com/login",{ 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha: senhaDigitada })
    })

    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Senha incorreta');
        }
    })
    .then(data => {
        localStorage.setItem('token', data.token); // Armazena o token JWT
        document.getElementById('senhaPage').style.display = 'none';
        document.getElementById('conteudoSite').style.display = 'block';
    })
    .catch(error => {
        mensagemErro.textContent = error.message;
    });
    
    /*if (senhaDigitada === senhaCorreta) {
        // Se a senha estiver correta, mostrar o conteúdo do site
        document.getElementById('senhaPage').style.display = 'none';

        document.getElementById('conteudoSite').style.display = 'block';
    } else {
        // Se a senha estiver errada, exibir mensagem de erro
        mensagemErro.textContent = 'Senha incorreta. Tente novamente.';
    }*/
}


// Função para verificar se os campos de nome e e-mail estão preenchidos
function verificarCampos() 
{
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    if (nome === '' || email === '') 
    {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verifica se o formato de e-mail é válido
    if (!validarEmail(email)) 
    {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Se tudo estiver correto, navega para a próxima fase
    navigateTo('fase1');
}

// Função para validar o formato do e-mail
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
    // Mostra a primeira fase ao carregar a página
    navigateTo('fase0');
}

function gerarPDF() 
{
    const textoProjecao = document.getElementById('projecaoText'); // Seleciona o textarea pelo ID correto

    if (!textoProjecao.value.trim()) {  // Verifica se há algum texto inserido
        alert('Por favor, insira suas projeções macroeconômicas.');
        return;
    }

    // Cria um elemento temporário para o conteúdo do PDF
    const elementoTemporario = document.createElement('div');
    elementoTemporario.innerHTML = `<h2>Projeção Macroeconômica 2025</h2><p>${textoProjecao.value}</p>`;

    // Configurações para o html2pdf
    const opt = {
        margin: 1,
        filename: 'ProjecaoMacroeconomica2025.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Gera o PDF a partir do elemento temporário
    html2pdf().from(elementoTemporario).set(opt).save();

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



// Função para atualizar o título ao subtrair o número inserido do número inicial
function atualizarTitulo() {
    const numeroInicialElemento = document.getElementById('numeroInicial');
    const numeroInput = document.getElementById('numeroInput').value;

    const numeroInicial = 100; // Valor inicial definido no título
    const numeroSubtrair = parseFloat(numeroInput) || 0; // Converte o input para número ou 0 se vazio

    // Subtrai o número inserido do número inicial
    const resultado = numeroInicial - numeroSubtrair;

    // Atualiza o valor no título
    numeroInicialElemento.textContent = resultado;
}

window.onload = init;
