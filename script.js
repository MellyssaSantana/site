document.addEventListener('DOMContentLoaded', () => {
    const toggleTheme = document.getElementById("toggleTheme");
    const rootHtml = document.documentElement;
    
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    const menuLinks = document.querySelectorAll(".menu-link");
    const menuHamburger = document.getElementById('menuHamburger');
    const menuMobile = document.getElementById('menuMobile');
    // Captura o ícone do menu hamburger
    const iconMenu = menuHamburger ? menuHamburger.querySelector('i') : null; 

    // Função para alternar tema (claro/escuro) - LÓGICA FINAL CORRIGIDA
    function changeTheme() {
        // Captura o ícone do tema *no momento do clique*
        const iconTheme = toggleTheme ? toggleTheme.querySelector('i') : null; 
        
        const currentTheme = rootHtml.getAttribute("data-theme");
        const isDark = currentTheme === "dark";
        
        // 1. Alterna o atributo data-theme no elemento HTML
        rootHtml.setAttribute("data-theme", isDark ? "light" : "dark");

        if (iconTheme) {
            // 2. Manipula as classes DIRETAMENTE NO ÍCONE (iconTheme)
            if (isDark) {
                // Estava Dark, mudou para Light. Ícone aparece como LUA (bi-moon-stars)
                iconTheme.classList.remove("bi-sun");
                iconTheme.classList.add("bi-moon-stars");
            } else {
                // Estava Light, mudou para Dark. Ícone aparece como SOL (bi-sun)
                iconTheme.classList.remove("bi-moon-stars");
                iconTheme.classList.add("bi-sun");
            }
        } else {
             console.error("Erro: Ícone do tema não encontrado.");
        }
    }

    if (toggleTheme) {
        toggleTheme.addEventListener("click", changeTheme);
    }

    // Acordeões
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle("active");
        });
    });

    // Ativar link clicado no menu
    menuLinks.forEach(item => {
        item.addEventListener("click", () => {
            menuLinks.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Fecha o menu mobile ao clicar no link
            if (menuMobile?.classList.contains('active')) {
                menuMobile.classList.remove('active');
                if (iconMenu) { 
                    iconMenu.classList.remove('bi-x-lg');
                    iconMenu.classList.add('bi-list-stars'); // CORRIGIDO: usa bi-list-stars
                }
            }
        });
    });

    // Alternar menu mobile e ícone
    function toggleMenu() {
        if (menuMobile && iconMenu) {
            const isOpen = menuMobile.classList.toggle('active');
            // Troca o ícone de estrelas/lista para o 'X'
            iconMenu.classList.toggle('bi-list-stars', !isOpen); // CORRIGIDO: usa bi-list-stars
            iconMenu.classList.toggle('bi-x-lg', isOpen);
        }
    }

    if (menuHamburger) {
        menuHamburger.addEventListener('click', toggleMenu);
    }

    // Máscara do telefone (Mantido)
    const telefoneInput = document.getElementById("telefone");

    if (telefoneInput) {
        telefoneInput.addEventListener("input", (e) => {
            let input = e.target.value.replace(/\D/g, "");
            if (input.length > 11) input = input.slice(0, 11);

            let formatted = "";
            if (input.length > 0) formatted += "(" + input.slice(0, 2);
            if (input.length >= 3) formatted += ") " + input.slice(2, 7);
            if (input.length >= 8) formatted += "-" + input.slice(7, 11);

            e.target.value = formatted;
        });
    }

    // Validação e envio do formulário (Mantido)
    const form = document.querySelector(".form-contato"); // OBS: Se você não estiver usando este formulário, pode ignorar esta parte.

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Impede a atualização da página

            // A variável 'telefoneInput' pode estar nula se o formulário existir mas o campo não.
            // Esta lógica de validação do telefone será mantida, mas se der erro no console, verifique se o ID 'telefone' existe.
            const telefoneValor = telefoneInput?.value.replace(/\D/g, ""); 
            if (telefoneInput && (!telefoneValor || telefoneValor.length !== 11)) {
                alert("Por favor, insira um telefone válido com 11 dígitos.");
                telefoneInput.focus();
                return;
            }
            
            // O restante do envio do formulário...
            const formData = new FormData(form);
            const action = form.getAttribute("action");

            try {
                const response = await fetch(action, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    alert("Mensagem enviada com sucesso!");
                    form.reset();
                } else {
                    alert("Erro ao enviar a mensagem. Tente novamente.");
                }

            } catch (error) {
                alert("Erro de conexão. Verifique sua internet.");
            }
        });
    }
});