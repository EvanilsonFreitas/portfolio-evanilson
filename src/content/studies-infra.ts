import type { Study } from './types.ts';

/**
 * Estudos de infraestrutura, cloud e entrega. Cada página separa o que está documentado nos projetos
 * do que é conhecimento conceitual. Nada aqui descreve topologia, nomes, endereços ou parâmetros reais.
 */
export const infraStudies: Study[] = [
  {
    slug: 'iis-windows-server',
    crumb: 'IIS e Windows Server',
    title: 'IIS e Windows Server: hospedagem de aplicações corporativas',
    domain: 'Cloud e Infraestrutura',
    summary:
      'Como o IIS recebe, protege e encaminha requisições para aplicações .NET e Python, e como autenticação, permissões e máquinas virtuais se encaixam nessa hospedagem.',
    natureLabel: 'Estudo · infraestrutura',
    scope: 'Conhecimento técnico de hospedagem Windows, ligado à documentação dos projetos. Topologia real não é publicada.',
    access: 'Sem servidores, endereços, portas, domínios ou estrutura de permissões reais.',
    sections: [
      {
        title: 'O papel do IIS',
        blocks: [
          { kind: 'p', text: 'O Internet Information Services é o servidor web do Windows Server. Em ambientes corporativos ele costuma ser a porta de entrada: termina o TLS, aplica autenticação e política de acesso, serve arquivos estáticos e encaminha o restante para a aplicação. Cada elemento de configuração existe por um motivo de operação ou de segurança.' },
          {
            kind: 'table',
            title: 'Elementos do IIS e para que servem',
            head: ['Elemento', 'Função na hospedagem'],
            rows: [
              ['Site e binding', 'Associa nome de host, porta e certificado TLS a uma aplicação. É o que torna o endereço HTTPS válido.'],
              ['Application Pool', 'Processo isolado que executa a aplicação, com identidade própria. Uma falha ou reinício não derruba os demais sites.'],
              ['Identidade do pool e permissões', 'A conta que roda o processo recebe só as permissões de pasta e de banco de que precisa (menor privilégio).'],
              ['Autenticação', 'Anônima, Windows ou outra, definida por site ou aplicação. Decide quem chega à aplicação e com que identidade.'],
              ['URL Rewrite e ARR', 'Regras de reescrita e proxy reverso: o IIS repassa o caminho escolhido para um serviço que escuta localmente.'],
              ['Logs', 'Registro de requisições e erros, ponto de partida de qualquer diagnóstico.'],
            ],
          },
        ],
      },
      {
        title: 'IIS como proxy reverso',
        blocks: [
          { kind: 'p', text: 'No desenho de proxy reverso, o IIS fica na frente e a aplicação escuta apenas em endereço local. O usuário nunca fala diretamente com o processo da aplicação: isso concentra TLS, cabeçalhos e política de acesso em um único ponto.' },
          { kind: 'diagram', id: 'iis-proxy', caption: 'Arquitetura ilustrativa de hospedagem com proxy reverso. Não representa uma implantação verificada.' },
          {
            kind: 'code',
            label: 'Regra de reescrita para proxy reverso (exemplo ilustrativo)',
            lang: 'xml',
            source: '<system.webServer>\n  <rewrite>\n    <rules>\n      <rule name="api" stopProcessing="true">\n        <match url="^api/(.*)" />\n        <action type="Rewrite" url="http://127.0.0.1:8000/api/{R:1}" />\n      </rule>\n    </rules>\n  </rewrite>\n</system.webServer>',
            note: 'Exige os módulos URL Rewrite e ARR. O serviço escuta somente em 127.0.0.1, e o IIS passa a ser o único caminho de entrada.',
          },
        ],
      },
      {
        title: 'ASP.NET Core no IIS',
        blocks: [
          { kind: 'p', text: 'No modelo de hospedagem do IIS, o ASP.NET Core Module recebe a requisição e a encaminha ao servidor Kestrel, que executa a aplicação. No modo em processo, a aplicação roda dentro do próprio processo do pool; no modo fora de processo, o IIS atua como proxy para um processo Kestrel separado. O Hosting Bundle instala o módulo e o runtime. Não existe configuração única: a escolha depende de desempenho, isolamento e operação.' },
          {
            kind: 'code',
            label: 'web.config gerado pela publicação (exemplo)',
            lang: 'xml',
            source: '<configuration>\n  <system.webServer>\n    <handlers>\n      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />\n    </handlers>\n    <aspNetCore processPath="dotnet" arguments=".\\Aplicacao.dll" hostingModel="inprocess" stdoutLogEnabled="false" />\n  </system.webServer>\n</configuration>',
          },
        ],
      },
      {
        title: 'Serviço Python atrás do IIS',
        blocks: [
          { kind: 'p', text: 'Uma API FastAPI não é uma aplicação ASP.NET: ela roda em um servidor ASGI, como o Uvicorn, que precisa de um processo mantido pelo sistema (por exemplo, como serviço do Windows). O IIS entra como camada de entrada, com TLS e proxy reverso para o processo local. Os papéis ficam separados: IIS recebe e protege, Uvicorn executa a API, a API aplica as regras e o banco guarda os dados.' },
        ],
      },
      {
        title: 'Windows Authentication e tokens',
        blocks: [
          {
            kind: 'table',
            head: ['Conceito', 'O que é'],
            rows: [
              ['Windows Authentication', 'O IIS autentica o usuário do domínio e repassa a identidade à aplicação. A senha não passa pela aplicação.'],
              ['Negotiate, Kerberos e NTLM', 'Negotiate escolhe o protocolo. Kerberos usa tíquetes do Active Directory e é o preferido. NTLM é o recurso de compatibilidade.'],
              ['Autenticação e autorização', 'Saber quem é o usuário é diferente de saber o que ele pode fazer. Grupos e perfis decidem as permissões.'],
              ['JWT e OAuth', 'Tokens assinados para identidade entre serviços ou clientes sem domínio Windows. Não substituem a autenticação integrada: resolvem outro cenário.'],
            ],
          },
          { kind: 'p', text: 'Windows Authentication é adequada a aplicações internas em domínio. Tokens são necessários quando o cliente está fora do domínio, quando há integração entre serviços ou quando a identidade precisa viajar entre sistemas independentes.' },
        ],
      },
      {
        title: 'Máquinas virtuais',
        blocks: [
          {
            kind: 'list',
            title: 'Pontos que sustentam uma VM de aplicação',
            items: [
              'Separar a VM da aplicação da VM do banco isola falhas e permite regras de rede distintas.',
              'Firewall com portas mínimas: somente a entrada HTTPS fica exposta; o banco aceita apenas a origem da aplicação.',
              'Recursos dimensionados por medição de uso, não por estimativa.',
              'Backup e restauração testados, com logs retidos e consultáveis.',
              'Contas de serviço próprias, sem privilégios de administrador.',
            ],
          },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'IIS como proxy reverso HTTPS, com a aplicação Python local, no EasyPrice', status: 'declarado', note: 'Decisão registrada na documentação do projeto.' },
              { label: 'Ambiente em VM dedicada com IIS e SQL Server, com homologação e produção separadas', status: 'declarado', note: 'Definido junto à área de infraestrutura.' },
              { label: 'Windows Authentication', status: 'conceitual', note: 'Avaliada no EasyPrice e substituída por login com credenciais corporativas validadas por um serviço de identidade.' },
              { label: 'Hospedagem em IIS da fundação inicial do Marivan Finance (.NET)', status: 'declarado', note: 'Etapa histórica, já substituída por outra arquitetura.' },
              { label: 'Kerberos, NTLM e ASP.NET Core Module', status: 'conceitual' },
            ],
          },
        ],
      },
    ],
    next: 'arquitetura-azure',
  },
  {
    slug: 'arquitetura-azure',
    crumb: 'Microsoft Azure',
    title: 'Microsoft Azure: decisões de arquitetura',
    domain: 'Cloud e Infraestrutura',
    summary:
      'O que a plataforma oferece para hospedar, proteger e observar aplicações, quando cada opção faz sentido e por que Azure e Azure DevOps não são a mesma coisa.',
    natureLabel: 'Estudo de arquitetura',
    scope: 'Estudo conceitual. Nenhum serviço Azure aqui é apresentado como utilizado em projeto profissional.',
    access: 'Sem assinaturas, recursos, nomes ou custos reais.',
    sections: [
      {
        title: 'Azure e Azure DevOps',
        blocks: [
          {
            kind: 'table',
            head: ['', 'Microsoft Azure', 'Azure DevOps'],
            rows: [
              ['O que é', 'Plataforma de nuvem com serviços de computação, rede, dados, identidade e observabilidade.', 'Plataforma de colaboração de engenharia: repositórios, boards, pipelines e artefatos.'],
              ['Onde a aplicação roda', 'É onde a aplicação pode ser hospedada.', 'Não hospeda a aplicação. Entrega o código ao ambiente escolhido.'],
              ['Dependência', 'Pode ser usado sem Azure DevOps.', 'Pode entregar para Azure, para servidores locais ou para outras nuvens.'],
            ],
          },
          { kind: 'p', text: 'Usar Azure DevOps para versionar e entregar um sistema não significa que o sistema esteja hospedado no Azure. São decisões independentes.' },
        ],
      },
      {
        title: 'Uma arquitetura conceitual de aplicação web',
        blocks: [
          { kind: 'diagram', id: 'azure-web', caption: 'Arquitetura conceitual. Cada componente tem uma função; não é uma implantação existente.' },
          {
            kind: 'table',
            head: ['Componente', 'Função'],
            rows: [
              ['Application Gateway', 'Entrada HTTP/HTTPS na camada de aplicação, com roteamento e firewall de aplicação web.'],
              ['App Service', 'Hospedagem gerenciada da aplicação: atualização do sistema operacional e escala ficam com a plataforma.'],
              ['Azure SQL Database', 'Banco relacional gerenciado: backup, disponibilidade e patches ficam com a plataforma.'],
              ['Microsoft Entra ID', 'Identidade na nuvem: usuários, grupos e acesso por função.'],
              ['Key Vault', 'Segredos e certificados fora do código e da configuração da aplicação.'],
              ['Azure Monitor', 'Métricas, logs e alertas para operar e investigar a aplicação.'],
            ],
          },
        ],
      },
      {
        title: 'Comparações que orientam a decisão',
        blocks: [
          {
            kind: 'table',
            head: ['Escolha', 'Quando favorece a primeira', 'Quando favorece a segunda'],
            rows: [
              ['Máquina virtual × App Service', 'Software que exige controle do sistema operacional, componentes instalados ou dependências legadas.', 'Aplicações web padrão, em que a equipe quer reduzir operação e atualizar com rapidez.'],
              ['SQL Server em VM × Azure SQL Database', 'Recursos do SQL Server que a versão gerenciada não cobre, ou controle total da instância.', 'Menos manutenção: backup, alta disponibilidade e atualização ficam com a plataforma.'],
              ['Load Balancer × Application Gateway', 'Distribuição de tráfego na camada de transporte (TCP/UDP), sem interpretar HTTP.', 'Roteamento por caminho ou host, terminação TLS e firewall de aplicação web, na camada HTTP.'],
              ['Proxy reverso IIS × serviço de entrada do Azure', 'Servidor Windows único ou ambiente local, em que o IIS já é o ponto de entrada.', 'Entrada gerenciada e escalável na nuvem, com proteção e roteamento oferecidos como serviço.'],
              ['Windows Authentication × Microsoft Entra ID', 'Aplicação interna em domínio local, com Active Directory.', 'Usuários e aplicações em nuvem; é possível combinar os dois em modelo híbrido.'],
            ],
          },
          { kind: 'p', text: 'Os pares não são equivalentes: cada um resolve um nível diferente do problema. A decisão correta depende de requisito, equipe e custo de operação.' },
        ],
      },
      {
        title: 'Arquitetura híbrida',
        blocks: [
          { kind: 'p', text: 'Aplicações internas muitas vezes permanecem no ambiente local por dependência de banco, rede ou conformidade, e adotam serviços de nuvem aos poucos: identidade com Entra ID sincronizada ao Active Directory, monitoramento centralizado e armazenamento de arquivos. O ganho está em adotar cada serviço quando ele resolve um problema concreto, sem mover tudo de uma vez.' },
        ],
      },
      {
        title: 'Segurança, em cenários',
        blocks: [
          {
            kind: 'table',
            head: ['Princípio', 'Como aparece na prática'],
            rows: [
              ['Menor privilégio e RBAC', 'A aplicação lê apenas o que precisa; pessoas recebem funções, não acesso irrestrito à assinatura.'],
              ['Identidade gerenciada', 'A aplicação acessa o cofre de segredos sem armazenar nenhuma senha.'],
              ['Rede', 'Banco sem exposição pública; acesso apenas pela rede da aplicação.'],
              ['TLS', 'Tráfego cifrado na entrada e nas conexões com o banco.'],
              ['Logs e auditoria', 'Quem mudou o quê, e quando, fica registrado e consultável.'],
            ],
          },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Serviços e comparações desta página', status: 'conceitual' },
              { label: 'Aplicações hospedadas no Azure Cloud', status: 'planejado', note: 'Não há projeto meu hospedado no Azure documentado neste portfólio.' },
              { label: 'Azure DevOps', status: 'planejado', note: 'Veja a página de CI/CD: a migração de repositório do EasyPrice está prevista, não concluída.' },
            ],
          },
        ],
      },
    ],
    next: 'azure-devops-cicd',
  },
  {
    slug: 'azure-devops-cicd',
    crumb: 'Azure DevOps e CI/CD',
    title: 'Azure DevOps e CI/CD: do código à produção',
    domain: 'Cloud e Infraestrutura',
    summary:
      'Como um fluxo de entrega transforma uma alteração de código em uma versão publicada com controle: revisão, build, testes, artefato, aprovação e ambientes.',
    natureLabel: 'Estudo técnico',
    scope: 'Conhecimento de engenharia de entrega. Não descreve um pipeline implantado em projeto meu.',
    access: 'Este portfólio é publicado manualmente. Nenhum pipeline foi criado para ele.',
    sections: [
      {
        title: 'O fluxo',
        blocks: [
          { kind: 'diagram', id: 'devops-pipeline', caption: 'Fluxo conceitual de entrega com ambientes separados.' },
          {
            kind: 'table',
            head: ['Etapa', 'Objetivo'],
            rows: [
              ['Pull request e revisão', 'Outra pessoa lê a alteração antes de ela entrar na linha principal. Políticas de branch exigem revisão e build verde.'],
              ['Build', 'Compila e valida o projeto em um ambiente limpo e reproduzível.'],
              ['Testes', 'Falha rápida: um teste quebrado interrompe o fluxo antes do deploy.'],
              ['Artefato', 'Uma versão única e imutável, a mesma que será promovida entre ambientes.'],
              ['Homologação e aprovação', 'Validação funcional e aprovação explícita antes de produção.'],
              ['Produção e validação', 'Publicação controlada, verificação pós-deploy e plano de rollback.'],
            ],
          },
        ],
      },
      {
        title: 'CI, entrega contínua e implantação contínua',
        blocks: [
          {
            kind: 'table',
            head: ['Termo', 'Significado'],
            rows: [
              ['Integração contínua (CI)', 'Cada alteração é integrada, compilada e testada automaticamente.'],
              ['Entrega contínua', 'Todo build aprovado fica pronto para ser publicado; a decisão de publicar pode continuar manual.'],
              ['Implantação contínua', 'Todo build aprovado é publicado em produção sem etapa manual.'],
            ],
          },
          { kind: 'p', text: 'Entrega contínua não implica deploy automático em produção. Muitas organizações mantêm aprovação manual por política ou por risco.' },
        ],
      },
      {
        title: 'Ambientes e configuração',
        blocks: [
          {
            kind: 'list',
            items: [
              'Os ambientes (desenvolvimento, teste, homologação e produção) variam por organização; cada projeto usa os que fazem sentido.',
              'O mesmo artefato é promovido entre ambientes. O que muda é a configuração, injetada por variáveis, nunca embutida no código.',
              'Segredos ficam em cofre ou em variáveis protegidas, com acesso restrito por ambiente.',
              'Rollback por versão anterior do artefato; o histórico de releases dá rastreabilidade.',
            ],
          },
        ],
      },
      {
        title: 'Azure DevOps na prática',
        blocks: [
          {
            kind: 'table',
            head: ['Serviço', 'Uso'],
            rows: [
              ['Azure Repos', 'Repositórios Git com políticas de branch e pull requests.'],
              ['Azure Boards', 'Itens de trabalho e planejamento ligados ao código.'],
              ['Azure Pipelines', 'Build, testes e entrega por pipelines versionados.'],
              ['Azure Artifacts', 'Pacotes internos, quando há bibliotecas compartilhadas.'],
            ],
          },
          {
            kind: 'code',
            label: 'Estrutura de um pipeline de build (exemplo didático)',
            lang: 'yaml',
            source: "trigger:\n  branches:\n    include: [main]\n\npool:\n  vmImage: windows-latest\n\nsteps:\n  - script: python -m pip install -r requirements.txt\n    displayName: Instalar dependências\n  - script: python -m pytest\n    displayName: Executar testes\n  - publish: $(Build.SourcesDirectory)\n    artifact: aplicacao\n    displayName: Publicar artefato",
            note: 'Exemplo para explicar o conceito. Não é o pipeline de nenhum projeto e não existe pipeline para este portfólio.',
          },
        ],
      },
      {
        title: 'GitHub e Azure DevOps',
        blocks: [
          { kind: 'p', text: 'Os dois oferecem repositórios Git, pull requests e automação de pipelines. Migrar um repositório entre eles preserva histórico e branches, mas exige recriar políticas de branch, permissões e pipelines no destino, e revisar integrações que apontavam para o endereço antigo.' },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Migração do repositório do EasyPrice do GitHub para o Azure DevOps', status: 'planejado', note: 'Registrada como evento posterior à migração do banco. Não consta como concluída.' },
              { label: 'Git, pull requests e revisão de código', status: 'codigo', note: 'Prática diária nos repositórios dos projetos.' },
              { label: 'Pipelines de CI/CD em projetos de terceiros', status: 'conceitual' },
              { label: 'Pipeline para este portfólio', status: 'conceitual', note: 'Não existe: a publicação é manual por decisão.' },
            ],
          },
        ],
      },
    ],
    next: 'analise-preditiva-operacional',
  },
  {
    slug: 'analise-preditiva-operacional',
    crumb: 'Análise preditiva',
    title: 'Análise preditiva em operações logísticas',
    domain: 'Inteligência Artificial Aplicada',
    summary:
      'Do indicador descritivo ao risco estimado: o que a estatística resolve, onde o aprendizado de máquina agrega valor e quais cuidados evitam conclusões enganosas.',
    natureLabel: 'Estudo técnico',
    scope: 'Estudo conceitual com exemplo estatístico sintético. Nenhum modelo treinado é apresentado e nenhuma métrica de acurácia é informada.',
    access: 'Dados sintéticos. Nenhum dado operacional real.',
    sections: [
      {
        title: 'Três níveis de análise',
        blocks: [
          {
            kind: 'table',
            head: ['Nível', 'Pergunta', 'Exemplo em operações'],
            rows: [
              ['Descritivo', 'O que aconteceu?', 'Taxa de avarias por filial no mês.'],
              ['Diagnóstico e estatístico', 'Esse valor é normal ou é um desvio?', 'Detectar uma filial fora do comportamento esperado.'],
              ['Preditivo', 'O que tende a acontecer?', 'Estimar a probabilidade de extravio de uma carga antes do embarque.'],
            ],
          },
          { kind: 'p', text: 'O primeiro passo é quase sempre o descritivo bem feito. Média móvel e limites de controle são estatística útil, mas não são aprendizado de máquina, e este portfólio não os apresenta como tal.' },
        ],
      },
      {
        title: 'Detecção de desvios por estatística',
        blocks: [
          {
            kind: 'code',
            label: 'Escore z em janela móvel (exemplo com dados sintéticos)',
            lang: 'python',
            source: 'import statistics\n\ndef desvios(serie: list[float], janela: int = 8, limite: float = 3.0) -> list[int]:\n    """Índices cujo valor se afasta mais que `limite` desvios-padrão da janela anterior."""\n    achados = []\n    for i in range(janela, len(serie)):\n        base = serie[i - janela : i]\n        media = statistics.fmean(base)\n        dp = statistics.pstdev(base)\n        if dp > 0 and abs(serie[i] - media) / dp > limite:\n            achados.append(i)\n    return achados',
            note: 'Método estatístico determinístico. Aponta o que merece investigação; não explica a causa nem prevê o próximo valor.',
          },
        ],
      },
      {
        title: 'Quando o aprendizado de máquina entra',
        blocks: [
          { kind: 'diagram', id: 'analise-preditiva', caption: 'Ciclo de um modelo preditivo supervisionado (conceitual).' },
          {
            kind: 'table',
            head: ['Etapa', 'Cuidado'],
            rows: [
              ['Variáveis', 'Usar apenas o que se conhece antes do evento. Informação futura contamina o modelo (vazamento de dados).'],
              ['Modelo', 'Classificação para probabilidade de ocorrência; regressão para valores. Modelos simples e explicáveis são o ponto de partida.'],
              ['Validação', 'Separar treino e teste por tempo, não ao acaso, para simular o uso real.'],
              ['Métricas', 'Em eventos raros, acurácia engana. Precisão, revocação e curva precisão-revocação contam a história.'],
              ['Uso', 'A pontuação de risco apoia a decisão de uma pessoa; não a substitui.'],
            ],
          },
          { kind: 'p', text: 'Aprendizado profundo faz sentido quando há grande volume de dados não estruturados, como imagem, texto ou sinais. Para dados tabulares de operação, métodos mais simples costumam ser comparáveis e muito mais fáceis de explicar e manter.' },
        ],
      },
      {
        title: 'Estado de cada afirmação',
        blocks: [
          {
            kind: 'status',
            items: [
              { label: 'Indicadores descritivos de qualidade operacional (extravio, avaria, ocorrências)', status: 'declarado', note: 'Parte da atuação em BI operacional. Detalhes não divulgados.' },
              { label: 'Análises de risco e desvio com apoio estatístico', status: 'declarado', note: 'Experiência declarada; sem dados ou resultados publicados.' },
              { label: 'Exemplo de escore z desta página', status: 'sintetico' },
              { label: 'Modelo preditivo treinado em produção', status: 'planejado', note: 'Não afirmado. Esta página é conceitual.' },
              { label: 'Deep learning', status: 'conceitual' },
            ],
          },
        ],
      },
    ],
    next: 'inteligencia-comercial-crm',
  },
];
