Sistema de Indicação (Referral System)
!(((https://www.google.com/search?q=https://img.shields.io/badge/license-MIT-blue.svg)))
!(((https://www.google.com/search?q=https://img.shields.io/badge/status-conclu%25C3%25ADdo-brightgreen)))

Uma aplicação web de página única (SPA) construída do zero, que implementa um sistema de cadastro de usuários e pontuação por indicação. Este projeto foi desenvolvido como parte de um desafio técnico.

📸 Screenshot
!(./dashboard.png)

🎯 Funcionalidades
Página de Cadastro: Formulário para registro de novos usuários com validação no front-end.

Página de Login: Autenticação segura de usuários usando senhas criptografadas e tokens JWT.

Página de Perfil (Dashboard): Exibe o nome do usuário, pontuação atual e o link de indicação único.

Lógica de Indicação: Um usuário ganha 1 ponto para cada novo usuário que se cadastra usando seu link.

Copiar Link: Funcionalidade para copiar o link de indicação para a área de transferência com um clique.

🛠️ Tecnologias Utilizadas
A escolha da stack tecnológica foi pensada para focar nos fundamentos do desenvolvimento web, evitando abstrações complexas e demonstrando proficiência nas tecnologias essenciais.

Back-end
Node.js: Ambiente de execução JavaScript no servidor.

Express.js: Framework minimalista para Node.js, usado para construir a API REST.

SQLite: Banco de dados SQL baseado em arquivo, escolhido pela simplicidade de configuração.

bcrypt.js: Para a criptografia segura (hashing) das senhas dos usuários.

jsonwebtoken: Para a implementação de autenticação stateless via JSON Web Tokens (JWT).

Front-end
HTML5, CSS3 e JavaScript (Vanilla JS): O front-end foi construído sem o uso de frameworks de UI/CSS para atender ao requisito do desafio e demonstrar domínio das tecnologias base da web.

CSS Flexbox: Utilizado para criar um layout moderno e totalmente responsivo.

API Fetch: Para a comunicação assíncrona entre o front-end e o back-end.

🚀 Instalação e Execução
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

Pré-requisitos
Node.js (versão LTS recomendada)

Git

Passos
**Clone o repositório:**bash
git clone https://github.com/Dimitri7/sistema-de-indicacao.git


Navegue até o diretório do projeto:

Bash

cd sistema-de-indicacao-spa
Instale as dependências do back-end:

Bash

npm install
Inicie o servidor back-end:

Bash

npm start
O servidor estará rodando em http://localhost:3000.

Abra o front-end:

No Visual Studio Code, clique com o botão direito no arquivo index.html.

Selecione "Open with Live Server".

Seu navegador abrirá a aplicação em um endereço como http://127.0.0.1:5500.

🤖 Colaboração com IA
Utilizei um assistente de IA como um mentor durante todo o desenvolvimento deste projeto. A colaboração foi crucial para:

Estruturação do Projeto: O assistente me guiou na criação de uma estrutura de pastas profissional (MVC) para o back-end, explicando a responsabilidade de cada diretório (models, controllers, routes).

Geração de Código e Explicação: Junto ao assistente, fizemos os blocos de código para cada etapa, desde o servidor Express inicial até a lógica de front-end. Mais importante, o assistente conseguiu me explicar o "porquê" de cada linha que fizemos, me ajudando a entender conceitos complexos como CORS, JWT, hashing de senhas com bcrypt e a comunicação fetch entre cliente e servidor.

Debugging Interativo: Enfrentei diversos erros durante o processo (git não é reconhecido, Failed to fetch, erros de sintaxe, etc.). Em cada um deles, o assistente conseguiu me ajudar e monstamos a solução passo a passo, transformando momentos de frustração em oportunidades de aprendizado.

Aprendizado: A interação com a IA foi como ter um programador sênior ao meu lado, disponível 24/7. Aprendi não apenas a resolver os problemas, mas a entender o porquê das soluções, o que solidificou meu conhecimento em todo o ciclo de desenvolvimento full-stack.

👨‍💻 Autor
Feito com ❤️ por Dimitri Albuquerque

GitHub:(https://github.com/Dimitri7)

LinkedIn:(https://www.google.com/search?q=https://www.linkedin.com/in/dimitri-albuquerque-66b32b278)

