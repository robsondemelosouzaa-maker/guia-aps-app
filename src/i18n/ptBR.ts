// Dicionário de microcopy em PT-BR — Guia APS
// Todos os textos do app devem vir daqui. Sem inglês, sem jargão.

export const txt = {
    // ── Ações / Botões ──────────────────────────────────────
    actions: {
        open: 'Abrir',
        close: 'Fechar',
        back: 'Voltar',
        save: 'Salvar',
        saveDraft: 'Salvar rascunho',
        discard: 'Descartar',
        keepEditing: 'Continuar editando',
        retry: 'Tentar de novo',
        search: 'Buscar',
        filter: 'Filtrar',
        clear: 'Limpar',
        add: 'Adicionar',
        register: 'Registrar',
        send: 'Enviar',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        seeAll: 'Ver todas',
        seeMore: 'Ver mais',
        newConsult: 'Registrar nova consulta',
    },

    // ── Estados de interface ─────────────────────────────────
    states: {
        loading: 'Carregando…',
        saving: 'Salvando…',
        searching: 'Buscando…',
        typing: 'Digitando…',
    },

    // ── Unhappy Path ─────────────────────────────────────────
    unhappy: {
        offline: {
            title: 'Sem internet',
            body: 'Você pode continuar usando o app. Vamos sincronizar quando voltar.',
            action: 'Tentar de novo',
        },
        offlineChat: 'Sem internet. A busca no guia local continua disponível.',
        empty: {
            title: 'Nada por aqui ainda',
            body: "Comece pelo botão 'Adicionar'.",
        },
        emptySearch: {
            title: 'Nenhum resultado',
            body: 'Tente outro termo ou verifique a grafia.',
            hint: 'Digite pelo menos 2 letras para buscar.',
        },
        error: {
            title: 'Algo deu errado',
            body: 'Tente novamente. Se o problema continuar, recarregue o app.',
            action: 'Tentar de novo',
        },
        noContent: {
            title: 'Conteúdo não encontrado',
            body: 'Este tema ainda não foi cadastrado no guia.',
        },
        unsavedChanges: {
            title: 'Você tem alterações não salvas',
            body: 'O que deseja fazer?',
        },
        demoMode: 'Modo Demonstração ativo: dados pessoais estão ocultos.',
        noPermission: 'Você não tem permissão para ver este conteúdo.',
    },

    // ── Assistente APS ───────────────────────────────────────
    assistant: {
        fab: 'Assistente APS',
        placeholder: 'Pergunte sobre protocolos, CIAP-2 ou seus registros…',
        disclaimer: 'Apoio à decisão. Não substitui avaliação clínica e protocolo local.',
        chips: {
            searchGuide: 'Buscar no guia',
            ciap: 'CIAP-2',
            counts: 'Minhas contagens',
            pending: 'Pendências',
        },
        notFound: 'Não encontrei isso no guia cadastrado. Quer buscar por outro termo?',
        noDataAccess: 'Não tenho acesso a esse tipo de informação.',
        demoBlocked: 'Modo Demonstração está ativo. Dados identificáveis estão ocultos.',
        clearChat: 'Limpar conversa',
        sources: 'Fontes usadas',
        noSource: 'Sem fonte identificada — não posso responder com segurança.',
        thinking: 'Procurando no guia…',
        greeting: 'Olá! Sou o Assistente APS. Posso buscar protocolos, tirar dúvidas sobre CIAP-2 e mostrar resumos dos seus registros.',
    },

    // ── Protocolo / Conteúdo ─────────────────────────────────
    content: {
        source: 'Fonte',
        version: 'Versão',
        updatedAt: 'Atualizado em',
        disclaimer: 'Apoio à decisão clínica. Não substitui avaliação presencial e protocolo local vigente.',
        noProtocol: 'Este protocolo ainda não foi cadastrado nesta versão do guia.',
    },

    // ── Navegação ────────────────────────────────────────────
    nav: {
        home: 'Início',
        modules: 'Módulos',
        ciap: 'CIAP-2',
        norms: 'Normas',
        settings: 'Configurações',
        search: 'Busca',
    },

    // ── Módulos ──────────────────────────────────────────────
    modules: {
        noPatients: 'Nenhum paciente vinculado a este módulo ainda.',
        noProtocols: 'Nenhum protocolo encontrado para este módulo.',
    },

    // ── Configurações ────────────────────────────────────────
    settings: {
        darkMode: 'Modo Escuro',
        lightMode: 'Modo Claro',
        fontSize: 'Tamanho da Fonte',
        demo: 'Modo Demonstração',
        demoHint: 'Oculta nomes e dados sensíveis de pacientes.',
        notifications: 'Notificações',
        notifsHint: 'Receba alertas de pendências críticas.',
        offline: 'Modo Sem Internet (em breve)',
        phase: 'Em desenvolvimento — disponível na Fase 3.',
    },
} as const;

export type TxtKeys = typeof txt;
