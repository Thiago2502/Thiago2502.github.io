document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o container onde as notícias serão exibidas
    const noticiasContainerIndex = document.getElementById('noticiasIndex');

    // Função para renderizar as notícias
    function renderizarNoticias(container) {
        if (!container) return;

        // Recupera as notícias do localStorage
        const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        container.innerHTML = ''; // Limpa o conteúdo atual

        if (noticias.length === 0) {
            container.innerHTML = '<p>Não há notícias publicadas ainda.</p>';
            return;
        }

        // Itera sobre as notícias e cria o HTML para cada uma
        noticias.forEach((noticia) => {
            const noticiaDiv = document.createElement('div');
            noticiaDiv.classList.add('noticia');
            noticiaDiv.innerHTML = `
                <h3>${noticia.titulo}</h3>
                <p><strong>Autor:</strong> ${noticia.autor}</p>
                <p><strong>Data:</strong> ${new Date(noticia.data).toLocaleDateString()}</p>
                <p>${noticia.resumo}</p>
            `;
            container.appendChild(noticiaDiv);
        });
    }

    // Chama a função para renderizar as notícias na página inicial
    renderizarNoticias(noticiasContainerIndex);
});
