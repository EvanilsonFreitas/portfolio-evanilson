import type { Case } from './types.ts';
import { CORPORATE, open, p, sec } from './cases-shared.ts';

/** SharePoint e Power Automate: duas frentes apresentadas separadamente e relacionadas entre si. */
export const casesProcessos: Case[] = [
  {
    id: 'controles-operacionais-sharepoint',
    slug: 'controles-operacionais-sharepoint',
    crumb: 'Controles em SharePoint',
    title: 'Controles Operacionais em SharePoint',
    summary:
      'Soluções de controle operacional construídas em SharePoint, que organizam e centralizam processos e registros corporativos em um ambiente único.',
    category: 'integracoes-processos',
    types: ['aplicacao-corporativa'],
    tech: ['sharepoint'],
    techNote: 'SharePoint, confirmado pelo proprietário.',
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('Processos operacionais precisam de registros estruturados e acessíveis às áreas envolvidas. O SharePoint foi usado como a plataforma para organizar esses registros e centralizar o controle dos processos corporativos.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Construção de soluções de controle operacional em SharePoint, voltadas à organização e à centralização de processos e registros. A automação sobre esses dados, com Power Automate e SharePoint Lists, tem case próprio.'),
      ),
      sec('Aplicação', p('Registros e controles operacionais reunidos em um ambiente único, com a estrutura necessária para acompanhar cada processo.')),
    ],
    related: ['automacao-relatorios-fluxos-power-automate'],
    pending: [
      open('Complementar com os controles construídos (listas, bibliotecas, processos), sem dados confidenciais.'),
    ],
  },
  {
    id: 'automacao-relatorios-fluxos-power-automate',
    slug: 'automacao-relatorios-fluxos-power-automate',
    crumb: 'Relatórios e Fluxos com Power Automate',
    title: 'Automação de Relatórios e Fluxos com Power Automate',
    summary:
      'Fluxos com Power Automate e SharePoint Lists para gerar relatórios, integrar dados e comunicar o andamento dos processos sem disparo manual.',
    category: 'integracoes-processos',
    types: ['automacao'],
    tech: ['power-automate', 'sharepoint'],
    techNote: 'Power Automate e SharePoint Lists, confirmados pelo proprietário.',
    caseType: 'compacto',
    natureLabel: CORPORATE,
    sections: [
      sec(
        'Contexto e problema',
        p('A automação existe para que relatórios e avisos de andamento aconteçam de forma regular e com o mesmo critério, sem depender de disparo manual.'),
      ),
      sec(
        'Solução desenvolvida',
        p('Combinação de Power Automate e SharePoint Lists para automatizar o que se repete nos processos.'),
        p('Relatórios automatizados, integração de dados entre as fontes e comunicação e acompanhamento dos processos, com as listas do SharePoint como base de registro.'),
      ),
      sec('Aplicação', p('Rotinas de relatório e de comunicação executadas de forma automatizada sobre dados mantidos em SharePoint. Compartilha a plataforma com o case de controles operacionais em SharePoint.')),
    ],
    related: ['controles-operacionais-sharepoint', 'integracoes-automacoes', 'alcadas-aprovacao-comercial'],
    pending: [
      open('Complementar com os fluxos e relatórios específicos, sem dados confidenciais.'),
    ],
  },
];
