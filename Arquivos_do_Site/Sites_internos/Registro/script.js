document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formNoticia');
    const noticiasContainer = document.getElementById('noticias');

    // Função para renderizar as notícias
    function renderizarNoticias() {
        const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        noticiasContainer.innerHTML = ''; // Limpa o container antes de renderizar

        if (noticias.length === 0) {
            noticiasContainer.innerHTML = '<p>Não há notícias publicadas ainda.</p>';
            return;
        }

        noticias.forEach((noticia) => {
            const noticiaDiv = document.createElement('div');
            noticiaDiv.classList.add('noticia');
            noticiaDiv.innerHTML = `
                <h4>${noticia.titulo}</h4>
                <p><strong>Autor:</strong> ${noticia.autor}</p>
                <p><strong>Data:</strong> ${new Date(noticia.data).toLocaleDateString()}</p>
                <p>${noticia.resumo}</p>
                <button class="editar" data-id="${noticia.id}">Editar</button>
                <button class="excluir" data-id="${noticia.id}">Excluir</button>
            `;
            noticiasContainer.appendChild(noticiaDiv);
        });

        // Adiciona os eventos de Editar e Excluir após renderizar
        adicionarEventos();
    }

    // Função para adicionar eventos de Editar e Excluir
    function adicionarEventos() {
        const btnsEditar = document.querySelectorAll('.editar');
        const btnsExcluir = document.querySelectorAll('.excluir');

        btnsEditar.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                editarNoticia(id);
            });
        });

        btnsExcluir.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                excluirNoticia(id);
            });
        });
    }

    // Função para salvar ou atualizar notícia
    function salvarNoticia(noticia) {
        const noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        // Verifica se a notícia já existe (por ID)
        const index = noticias.findIndex(n => n.id === noticia.id);
        if (index === -1) {
            noticias.push(noticia); // Adiciona nova notícia
        } else {
            noticias[index] = noticia; // Atualiza notícia existente
        }
        localStorage.setItem('noticias', JSON.stringify(noticias));
    }

    // Função para excluir notícia
    function excluirNoticia(id) {
        let noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        noticias = noticias.filter(noticia => noticia.id !== parseInt(id));
        localStorage.setItem('noticias', JSON.stringify(noticias));
        renderizarNoticias();
    }

    // Função para editar notícia
    function editarNoticia(id) {
        let noticias = JSON.parse(localStorage.getItem('noticias')) || [];
        const noticia = noticias.find(noticia => noticia.id === parseInt(id));

        if (noticia) {
            // Preenche o formulário com os dados da notícia
            form.titulo.value = noticia.titulo;
            form.autor.value = noticia.autor;
            form.data.value = noticia.data;
            form.resumo.value = noticia.resumo;
            form.conteudo.value = noticia.conteudo;

            // Alterar o comportamento do botão para "Atualizar"
            form.querySelector('button').textContent = 'Atualizar';

            // Substitui a função de envio para atualização
            form.onsubmit = (e) => {
                e.preventDefault();
                const noticiaAtualizada = {
                    id: noticia.id, // Mantém o mesmo ID da notícia sendo editada
                    titulo: form.titulo.value,
                    autor: form.autor.value,
                    data: form.data.value,
                    resumo: form.resumo.value,
                    conteudo: form.conteudo.value,
                };

                salvarNoticia(noticiaAtualizada);
                form.reset();
                form.querySelector('button').textContent = 'Publicar';
                renderizarNoticias();
            };
        }
    }

    // Evento de envio do formulário para adicionar uma notícia
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const noticia = {
            id: Date.now(), // Gerar um ID único para a notícia
            titulo: form.titulo.value,
            autor: form.autor.value,
            data: form.data.value,
            resumo: form.resumo.value,
            conteudo: form.conteudo.value,
        };

        salvarNoticia(noticia);
        form.reset();
        renderizarNoticias();
    });

    // Renderiza as notícias ao carregar a página
    renderizarNoticias();
});
