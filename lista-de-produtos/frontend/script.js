function consumirAPI() {
    // Faz uma requisição para a API local em busca dos dados dos produtos
    fetch('http://localhost:3000/produtos')
      // Converte a resposta da API para formato JSON
      .then(response => response.json())
      // Processa os dados dos produtos recebidos
      .then(produtos => {
        // Seleciona o elemento HTML onde os cards dos produtos serão inseridos
        const produtosContainer = document.getElementById('produtosContainer');
        // Limpa o conteúdo anterior do container, caso exista
        produtosContainer.innerHTML = '';
  
        // Itera sobre cada produto da lista recebida
        produtos.forEach(produto => {
          // Cria um novo elemento div para representar o card do produto
          const produtoCard = document.createElement('div');
          // Adiciona a classe 'produto-card' para aplicar os estilos definidos no CSS
          produtoCard.classList.add('produto-card');
  
          // Constrói o conteúdo HTML do card, inserindo os dados do produto
          produtoCard.innerHTML = `
          <h2>${produto.nome}</h2>
          <p><strong>Preço:</strong> R$ ${produto.precoUnitario}</p>
          <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
          <p><strong>Categoria:</strong> ${produto.categoria}</p>
          <p><strong>Fabricante:</strong> ${produto.fabricante}</p>
          <button class="editar-btn" data-id="${produto.id}">Editar</button>
          <button class="deletar-btn" data-id="${produto.id}">Deletar</button>
      `
  
          // Adiciona o card recém-criado ao container de produtos
          produtosContainer.appendChild(produtoCard);

          document.querySelectorAll('.editar-btn').forEach(button => {
            button.addEventListener('click', editarProduto);
        });

        document.querySelectorAll('.deletar-btn').forEach(button => {
            button.addEventListener('click', deletarProduto);
        });
        });
      })
      // Captura e loga qualquer erro que ocorra durante o processo
      .catch(error => console.log('Erro ao carregar produtos: ', error));
  }

function editarProduto(event) {
    const produtoId = event.target.getAttribute('data-id');
    fetch(`http://localhost:3000/produtos/${produtoId}`)
        .then(response => response.json())
        .then(produto => {
            // Preencher o formulário com os dados do produto para edição
            document.getElementById('nome').value = produto.nome;
            document.getElementById('precoUnitario').value = produto.precoUnitario;
            document.getElementById('quantidade').value = produto.quantidade;
            document.getElementById('categoria').value = produto.categoria;
            document.getElementById('fabricante').value = produto.fabricante;
            
            // Remover o evento de submit atual e adicionar um novo para atualizar o produto
            const form = document.getElementById('produtoForm');
            form.removeEventListener('submit', adicionarProduto);
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                atualizarProduto(produtoId);
            });
        })
        .catch(error => console.log('Erro ao carregar produto para edição: ', error));
}

function atualizarProduto(produtoId) {
    const produtoAtualizado = {
        nome: document.getElementById('nome').value,
        precoUnitario: parseFloat(document.getElementById('precoUnitario').value),
        quantidade: parseInt(document.getElementById('quantidade').value),
        categoria: document.getElementById('categoria').value,
        fabricante: document.getElementById('fabricante').value
    };

    fetch(`http://localhost:3000/produtos/${produtoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoAtualizado)
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto atualizado com sucesso!');
        consumirAPI(); // Atualiza a lista de produtos

        // Restaurar o formulário para adicionar novos produtos
        const form = document.getElementById('produtoForm');
        form.reset();
        form.removeEventListener('submit', atualizarProduto);
        form.addEventListener('submit', adicionarProduto);
    })
    .catch(error => console.log('Erro ao atualizar produto', error));
}

function deletarProduto(event) {
    const produtoId = event.target.getAttribute('data-id');

    fetch(`http://localhost:3000/produtos/${produtoId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto removido com sucesso!');
        consumirAPI(); // Atualiza a lista de produtos
    })
    .catch(error => console.log('Erro ao deletar produto', error));
}

function adicionarProduto(event) {
    event.preventDefault();

    const novoProduto = {
        nome: document.getElementById('nome').value,
        precoUnitario: parseFloat(document.getElementById('precoUnitario').value),
        quantidade: parseInt(document.getElementById('quantidade').value),
        categoria: document.getElementById('categoria').value,
        fabricante: document.getElementById('fabricante').value
    };

    fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto adicionado!');
        consumirAPI(); // Atualiza a lista de produtos
    })
    .catch(error => console.log('Erro ao adicionar produto', error));
}

document.getElementById('produtoForm').addEventListener('submit', adicionarProduto);
  
  // Executa a função consumirAPI quando a página é carregada
  window.onload = consumirAPI;