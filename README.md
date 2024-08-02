# C&S Serviços

<p align="center">
  <img src="/frontend/public/logo.png" alt="Logo">
</p>

C&S Serviços é um sistema de agendamento de serviços gerais projetado para facilitar a conexão entre clientes e prestadores de serviços através de uma plataforma intuitiva e eficiente. Nosso sistema oferece uma solução completa para gerenciamento de agendamentos, permitindo que os clientes agendem serviços diretamente com a empresa, enquanto a empresa gerencia a alocação dos prestadores e os detalhes dos serviços.

## Funcionalidades

- **Gerenciamento de Agendamentos**: Permite a criação, visualização e alteração de agendamentos com diferentes estados (A confirmar, Agendado, Em andamento, Concluído e Pausa).
- **Painel Administrativo**: Oferece uma visão completa dos agendamentos e permite o gerenciamento de prestadores e clientes.
- **Autenticação e Autorização**: Suporte para cadastro e login de clientes, prestadores e administradores.
- **Configurações Personalizadas**: Ajuste o sistema de acordo com as necessidades da empresa.

## Tecnologias Utilizadas

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Node.js**
- **Express**
- **Prisma**
- **PostgreSQL**

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/csservicos.git
   ```

2. Instale as dependências:
   ```bash
   cd csservicos
   npm install
   ```
3. Configure o banco de dados no arquivo `.env`.
4. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Inicie o servidor backend:
   ```bash
   npm run dev:backend
   ```
6. Inicie o servidor frontend:
   ```bash
   npm run dev:frontend
   ```

## Uso

1. Acesse `http://localhost:3000` no seu navegador.
2. Utilize as funcionalidades de agendamento e gerenciamento conforme necessário

## Contribuição

1. Fork este repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença Creative Commons Attribution-NonCommercial (CC BY-NC). Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para mais informações, entre em contato através do email: winksousa0@gmail.com
