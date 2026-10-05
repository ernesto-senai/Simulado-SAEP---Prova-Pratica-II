# Gerenciador de eventos – Simulado SAEP (Prova Prática II)

Front-end em HTML, CSS e JavaScript; back-end em Node.js com Express; banco MySQL.

## Estrutura

```
gerenciador-eventos/
├── database.sql                  script do banco (tabelas + dados iniciais)
├── db.js                         conexão com o MySQL (ajuste usuário/senha aqui)
├── server.js                     API (cadastrar, listar, editar e excluir)
├── package.json
└── public/
    ├── index.html                Gerenciador de evento (primeira tela)
    ├── cadastro-palestrante.html Cadastro de palestrantes
    ├── cadastro-evento.html      Cadastro e edição de evento
    ├── css/style.css
    └── js/
        ├── comum.js              validação e funções compartilhadas
        ├── gerenciador.js
        ├── palestrante.js
        └── evento.js
```

## Como rodar

1. Abra o MySQL Workbench e execute o arquivo `database.sql`.
2. Em `db.js`, coloque o usuário e a senha do seu MySQL.
3. No terminal, dentro da pasta do projeto:

   ```
   npm install
   npm start
   ```

4. Acesse `http://localhost:3000`. A primeira tela é o Gerenciador de evento.

## O que cada tela faz

**Cadastro de palestrantes** – campos Nome e E-mail. Não envia com campo vazio, valida o
formato do e-mail e mostra "Cadastro concluído com sucesso" ao gravar. E-mail repetido é
recusado.

**Cadastro de evento** – campos Nome, Descrição, Local e Palestrante. O select de
palestrantes é carregado do banco. Não envia com campo vazio e mostra "Cadastro concluído
com sucesso" ao gravar.

**Gerenciador de evento** – lista os eventos do banco com nome, descrição, local e
palestrante. *Editar* abre o cadastro de evento preenchido (`cadastro-evento.html?id=N`) e,
ao clicar em Cadastrar, faz um `UPDATE` no mesmo registro (não cria outro). *Excluir* pede
confirmação e, se confirmado, apaga do banco.

## Comprovando no banco

Depois de cada cadastro, edição ou exclusão, rode no MySQL Workbench:

```sql
USE gerenciador_eventos;
SELECT * FROM palestrante;
SELECT * FROM evento;
```

## Rotas da API

| Método | Rota                  | Ação                         |
|--------|-----------------------|------------------------------|
| GET    | /api/palestrantes     | lista palestrantes           |
| POST   | /api/palestrantes     | cadastra palestrante         |
| GET    | /api/eventos          | lista eventos com palestrante|
| GET    | /api/eventos/:id      | busca um evento              |
| POST   | /api/eventos          | cadastra evento              |
| PUT    | /api/eventos/:id      | atualiza evento              |
| DELETE | /api/eventos/:id      | exclui evento                |

## Problemas comuns

- **"Não foi possível carregar os eventos"**: o servidor não está rodando ou a senha em
  `db.js` está errada. Veja a mensagem no terminal onde rodou `npm start`.
- **`ER_ACCESS_DENIED_ERROR`**: usuário ou senha do MySQL incorretos em `db.js`.
- **`ER_BAD_DB_ERROR`**: o `database.sql` ainda não foi executado.
- **Porta 3000 ocupada**: troque `PORT` em `server.js`.
