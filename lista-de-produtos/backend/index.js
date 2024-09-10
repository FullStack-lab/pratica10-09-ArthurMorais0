const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dados iniciais (simulando um banco de dados em memória)
const produtos = [
  {
    id: 1, // Adicionar um id único em cada produto
    nome: "Teclado Gamer",
    precoUnitario: 500,
    quantidade: 50,
    categoria: "Periféricos",
    fabricante: "Toyota"
  },
  {
    id: 2, // Adicionar um id único em cada produto
    nome: "Teclado Mecânico",
    precoUnitario: 350,
    quantidade: 100,
    categoria: "Periféricos",
    fabricante: "Nokia"
  },
  {
    id: 3, // Adicionar um id único em cada produto
    nome: "Monitor 4K",
    precoUnitario: 2500,
    quantidade: 30,
    categoria: "Eletrônicos",
    fabricante: "Dell"
  }
];

// Endpoint para obter produtos
app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
})


// Inicia o servidor
const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor rodando na porta localhost:${porta}`);
})

app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
  });

  app.get('/produtos/:id', (req, res) => {
    const produtoId = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === produtoId);

    if (produto) {
        res.status(200).json(produto);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.post('/produtos', (req, res) => {
    // Recebe os dados do novo produto do corpo da requisição (req.body)
    const novoProduto = req.body;
    // Gerar um ID único para o novo produto
    novoProduto.id = produtos.length + 1; 
    produtos.push(novoProduto);
    // Retorna o novo produto com status 201 (Criado)
    res.status(201).json(novoProduto);
})

app.put('/produtos/:id', (req, res) => {
    const produtoId = parseInt(req.params.id);
    const produtoIndex = produtos.findIndex(p => p.id === produtoId);

    // Verifica se encontrou o produto (índice diferente de -1)
    if (produtoIndex !== -1) {
        // Atualiza o produto existente, com novos dados recebidos no corpo da requisição
        produtos[produtoIndex] = { ...produtos[produtoIndex], ...req.body };
        /* 
            Explicando melhor o spread(...produtos, ...req.body)

            1 - produtos[produtoIndex]: Aqui, você está acessando um item específico na lista produtos usando o índice produtoIndex.,
            2 - { ...produtos[produtoIndex] }: Isso cria um novo objeto que contém todas as propriedades do objeto encontrado em produtos[produtoIndex]. Ou seja, você está "desestruturando" o objeto existente e copiando suas propriedades para um novo objeto.
            3 - { ...req.body }: Isso cria um novo objeto que contém todas as propriedades do objeto req.body. req.body é geralmente utilizado em uma aplicação web para representar os dados enviados no corpo de uma requisição HTTP (por exemplo, quando um formulário é enviado).
            4 - Combinação dos Objetos: A sintaxe { ...obj1, ...obj2 } cria um novo objeto que combina as propriedades de obj1 e obj2. Se houver propriedades com o mesmo nome em ambos os objetos, o valor de obj2 sobrescreverá o valor de obj1.
        */
        // Retorna o produto atualizado com status 200 (sucesso)
        res.status(200).json(produtos[produtoIndex]);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});

app.delete('/produtos/:id', (req, res) => {
    const produtoId = parseInt(req.params.id);
    const produtoIndex = produtos.findIndex(p => p.id === produtoId);

    if (produtoIndex !== -1) {
        produtos.splice(produtoIndex, 1);
        res.status(200).json({ message: 'Produto removido com sucesso' });
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});
