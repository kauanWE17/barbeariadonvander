// Padrão de Projeto: IIFE (Immediately Invoked Function Expression)
// Isso garante que o código não interfira com scripts de terceiros.
(function() {
    // 1. Seleciona os elementos do HTML
    // Certifique-se que você tem um botão ou link com a classe 'cta-button' no seu HTML
    var btn = document.querySelector('.cta-button'); 
    var modal = document.getElementById("agendamentoModal");
    var span = document.querySelector(".close-button");

    // 2. FUNÇÃO para abrir o modal quando o botão for clicado
    if (btn && modal) {
        btn.onclick = function(event) {
            // Previne que o link vá para outra página
            event.preventDefault(); 
            // Mostra o modal
            modal.style.display = "block";
        }
    }

    // 3. FUNÇÃO para fechar o modal quando o 'x' for clicado
    if (span && modal) {
        span.onclick = function() {
            // Esconde o modal
            modal.style.display = "none";
        }
    }

    // 4. FUNÇÃO para fechar o modal se o usuário clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

})();