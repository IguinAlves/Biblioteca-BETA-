// Funcionalidade de troca de idioma
document.addEventListener('DOMContentLoaded', function() {
  // Variáveis globais
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'pt';
  
  // Função para traduzir a página
  function translatePage(language) {
    if (!translations[language]) {
      console.error('Idioma não suportado:', language);
      return;
    }
    
    // Atualizar o idioma atual
    currentLanguage = language;
    
    // Salvar preferência no localStorage
    localStorage.setItem('selectedLanguage', language);
    
    // Atualizar o atributo lang do HTML
    document.documentElement.lang = language;
    
    // Atualizar a classe ativa no seletor de idioma
    document.querySelectorAll('.language-option').forEach(option => {
      if (option.getAttribute('data-lang') === language) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    // Atualizar o texto do botão de idioma
    const langBtnText = document.querySelector('.language-btn .lang-text');
    if (langBtnText) {
      langBtnText.textContent = language.toUpperCase();
    }
    
    // Traduzir elementos com atributo data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations[language][key]) {
        // Verificar se é um placeholder
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translations[language][key];
        } 
        // Verificar se é um aria-label
        else if (element.hasAttribute('aria-label')) {
          element.setAttribute('aria-label', translations[language][key]);
        }
        // Caso padrão: conteúdo de texto
        else {
          element.textContent = translations[language][key];
        }
      }
    });
    
    // Forçar atualização de elementos específicos da página de autores
    if (window.location.href.includes('autores.html')) {
      translateAuthorPage(language);
    }
    
    // Evento personalizado para notificar que a tradução foi concluída
    const event = new CustomEvent('translationComplete', { detail: { language } });
    document.dispatchEvent(event);
  }
  
  // Função específica para traduzir a página de autores
  function translateAuthorPage(language) {
    // Traduzir biografias de autores
    document.querySelectorAll('.autor-content p[data-translate]').forEach(paragraph => {
      const key = paragraph.getAttribute('data-translate');
      if (translations[language][key]) {
        paragraph.textContent = translations[language][key];
      }
    });
    
    // Traduzir citações
    document.querySelectorAll('.autor-quote [data-translate]').forEach(quote => {
      const key = quote.getAttribute('data-translate');
      if (translations[language][key]) {
        quote.textContent = translations[language][key];
      }
    });
    
    // Traduzir títulos de obras
    document.querySelectorAll('.obra-titulo[data-translate]').forEach(title => {
      const key = title.getAttribute('data-translate');
      if (translations[language][key]) {
        title.textContent = translations[language][key];
      }
    });
  }
  
  // Função para alternar o menu de idiomas
  function toggleLanguageMenu() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
      languageSwitcher.classList.toggle('active');
      
      // Fechar o menu ao clicar fora
      if (languageSwitcher.classList.contains('active')) {
        document.addEventListener('click', closeLanguageMenuOutside);
      } else {
        document.removeEventListener('click', closeLanguageMenuOutside);
      }
    }
  }
  
  // Função para fechar o menu de idiomas ao clicar fora
  function closeLanguageMenuOutside(e) {
    const languageSwitcher = document.querySelector('.language-switcher');
    const languageBtn = document.querySelector('.language-btn');
    
    if (languageSwitcher && !languageSwitcher.contains(e.target) && e.target !== languageBtn) {
      languageSwitcher.classList.remove('active');
      document.removeEventListener('click', closeLanguageMenuOutside);
    }
  }
  
  // Inicializar o seletor de idioma
  function initLanguageSwitcher() {
    // Criar o botão de idioma e o dropdown
    const headerRight = document.querySelector('.header-right');
    
    if (headerRight) {
      // Criar o container do seletor de idioma
      const languageSwitcher = document.createElement('div');
      languageSwitcher.className = 'language-switcher';
      
      // Criar o botão de idioma
      const languageBtn = document.createElement('button');
      languageBtn.className = 'language-btn';
      languageBtn.setAttribute('aria-label', 'Selecionar idioma');
      languageBtn.setAttribute('aria-expanded', 'false');
      languageBtn.innerHTML = `
        <span class="lang-icon"><i class="fas fa-globe" aria-hidden="true"></i></span>
        <span class="lang-text">${currentLanguage.toUpperCase()}</span>
      `;
      
      // Criar o dropdown de idiomas
      const languageDropdown = document.createElement('div');
      languageDropdown.className = 'language-dropdown';
      languageDropdown.setAttribute('role', 'menu');
      
      // Adicionar as opções de idioma
      const languages = [
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' }
      ];
      
      languages.forEach(lang => {
        const option = document.createElement('div');
        option.className = `language-option ${lang.code === currentLanguage ? 'active' : ''}`;
        option.setAttribute('role', 'menuitem');
        option.setAttribute('data-lang', lang.code);
        option.innerHTML = `
          <span class="flag-emoji">${lang.flag}</span>
          <span>${lang.name}</span>
        `;
        
        // Adicionar evento de clique
        option.addEventListener('click', function() {
          translatePage(lang.code);
          toggleLanguageMenu();
        });
        
        languageDropdown.appendChild(option);
      });
      
      // Adicionar eventos
      languageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleLanguageMenu();
        
        // Atualizar aria-expanded
        const expanded = languageBtn.getAttribute('aria-expanded') === 'true' || false;
        languageBtn.setAttribute('aria-expanded', !expanded);
      });
      
      // Montar a estrutura
      languageSwitcher.appendChild(languageBtn);
      languageSwitcher.appendChild(languageDropdown);
      
      // Inserir antes do botão de tema
      const themeBtn = headerRight.querySelector('.btn-theme');
      if (themeBtn) {
        headerRight.insertBefore(languageSwitcher, themeBtn);
      } else {
        headerRight.appendChild(languageSwitcher);
      }
      
      // Adicionar atributos data-translate aos elementos
      addTranslateAttributes();
      
      // Traduzir a página para o idioma atual
      translatePage(currentLanguage);
    }
  }
  
  // Função para adicionar atributos data-translate aos elementos
  function addTranslateAttributes() {
    // Título do cabeçalho
    const tituloHeader = document.querySelector('.titulo-header');
    if (tituloHeader) {
      tituloHeader.setAttribute('data-translate', 'titulo-header');
    }
    
    // Cabeçalho
    const searchInput = document.getElementById('campo-pesquisa');
    if (searchInput) {
      searchInput.setAttribute('data-translate', 'buscar-no-site');
    }
    
    const searchButton = document.querySelector('.busca button');
    if (searchButton) {
      searchButton.setAttribute('aria-label', 'Iniciar busca');
      searchButton.setAttribute('data-translate', 'iniciar-busca');
    }
    
    const themeButton = document.getElementById('toggleTheme');
    if (themeButton) {
      themeButton.setAttribute('aria-label', 'Alternar tema');
      themeButton.setAttribute('data-translate', 'alternar-tema');
    }
    
    const menuButton = document.getElementById('menuBtn');
    if (menuButton) {
      menuButton.setAttribute('aria-label', 'Menu');
      menuButton.setAttribute('data-translate', 'menu');
    }
    
    // Menu lateral
    const menuTitle = document.querySelector('.menu-header h2');
    if (menuTitle) {
      menuTitle.setAttribute('data-translate', 'menu-titulo');
    }
    
    const closeMenuButton = document.querySelector('.fechar-menu');
    if (closeMenuButton) {
      closeMenuButton.setAttribute('aria-label', 'Fechar menu');
      closeMenuButton.setAttribute('data-translate', 'fechar-menu');
    }
    
    // Itens do menu lateral - CORREÇÃO AQUI
    // Mapeamento direto dos itens do menu para as chaves de tradução
    const menuItemsMap = [
      { text: 'Início', key: 'menu-inicio' },
      { text: 'Autores', key: 'menu-autores' },
      { text: 'FAQ', key: 'menu-faq' },
      { text: 'Tutoriais', key: 'menu-tutoriais' },
      { text: 'Links Úteis', key: 'menu-links' },
      { text: 'Periódicos', key: 'menu-periodicos' },
      { text: 'Manuais', key: 'menu-manuais' },
      { text: 'Fontes de pesquisa', key: 'menu-fontes' },
      { text: 'Documentos', key: 'menu-documentos' },
      { text: 'Doações', key: 'menu-doacoes' },
      { text: 'Sugestão de compra', key: 'menu-sugestao' },
      { text: 'Concursos culturais', key: 'menu-concursos' },
      { text: 'Semana da Biblioteca', key: 'menu-semana' }
    ];
    
    // Selecionar todos os links do menu
    const menuLinks = document.querySelectorAll('.menu-items a');
    
    // Para cada link no menu
    menuLinks.forEach((link, index) => {
      if (index < menuItemsMap.length) {
        // Extrair o ícone e criar um novo conteúdo HTML
        const iconHTML = link.innerHTML.split('</i>')[0] + '</i>';
        const spanHTML = `<span data-translate="${menuItemsMap[index].key}">${menuItemsMap[index].text}</span>`;
        
        // Substituir o conteúdo do link
        link.innerHTML = `${iconHTML} ${spanHTML}`;
      }
    });
    
    // Seção de apresentação
    const presentationTitle = document.querySelector('#apresentacao .info-box:first-child .section-title');
    if (presentationTitle) {
      presentationTitle.innerHTML = `<i class="fas fa-info-circle" aria-hidden="true"></i> <span data-translate="apresentacao-titulo">Apresentação</span>`;
    }
    
    const presentationText = document.querySelector('#apresentacao .info-box:first-child p');
    if (presentationText) {
      presentationText.setAttribute('data-translate', 'apresentacao-texto');
    }
    
    // Equipe
    const teamTitle = document.querySelector('#apresentacao .info-box:nth-child(2) .section-title');
    if (teamTitle) {
      teamTitle.innerHTML = `<i class="fas fa-users" aria-hidden="true"></i> <span data-translate="equipe-titulo">Nossa Equipe</span>`;
    }
    
    const teamCards = document.querySelectorAll('.team-card p');
    teamCards.forEach(card => {
      const text = card.textContent.trim();
      if (text === 'Bibliotecário-Documentalista') {
        card.setAttribute('data-translate', 'cargo-bibliotecario');
      } else if (text === 'Auxiliar de biblioteca') {
        card.setAttribute('data-translate', 'cargo-auxiliar');
      } else if (text === 'Assistente administrativo') {
        card.setAttribute('data-translate', 'cargo-assistente');
      }
    });
    
    // Horário
    const scheduleTitle = document.querySelector('#apresentacao .info-box:nth-child(3) .section-title');
    if (scheduleTitle) {
      scheduleTitle.innerHTML = `<i class="fas fa-clock" aria-hidden="true"></i> <span data-translate="horario-titulo">Horário de Atendimento</span>`;
    }
    
    const scheduleDays = document.querySelector('.horario-info p:first-child');
    if (scheduleDays) {
      scheduleDays.setAttribute('data-translate', 'horario-dias');
    }
    
    const scheduleHours = document.querySelector('.horario-info .horario-destaque');
    if (scheduleHours) {
      scheduleHours.setAttribute('data-translate', 'horario-horas');
    }
    
    // Serviços
    const servicesTitle = document.querySelector('#apresentacao .info-box:nth-child(4) .section-title');
    if (servicesTitle) {
      servicesTitle.innerHTML = `<i class="fas fa-concierge-bell" aria-hidden="true"></i> <span data-translate="servicos-titulo">Serviços Oferecidos</span>`;
    }
    
    const serviceItems = document.querySelectorAll('.service-item p');
    const serviceTranslateKeys = [
      'servico-orientacao',
      'servico-emprestimo-bibliotecas',
      'servico-normalizacao',
      'servico-emprestimo',
      'servico-reserva',
      'servico-agendamento',
      'servico-alerta',
      'servico-ficha',
      'servico-guarda',
      'servico-computadores',
      'servico-oficinas'
    ];
    
    serviceItems.forEach((item, index) => {
      if (index < serviceTranslateKeys.length) {
        item.setAttribute('data-translate', serviceTranslateKeys[index]);
      }
    });
    
    // Contatos
    const contactsTitle = document.querySelector('#apresentacao .info-box:nth-child(5) .section-title');
    if (contactsTitle) {
      contactsTitle.innerHTML = `<i class="fas fa-address-book" aria-hidden="true"></i> <span data-translate="contatos-titulo">Contatos e Redes Sociais</span>`;
    }
    
    const contactPhone = document.querySelector('.contact-item:first-child p strong');
    if (contactPhone) {
      contactPhone.setAttribute('data-translate', 'contato-telefone');
    }
    
    const contactEmail = document.querySelector('.contact-item:nth-child(2) p strong');
    if (contactEmail) {
      contactEmail.setAttribute('data-translate', 'contato-email');
    }
    
    // Pergamum
    const pergamumTitle = document.querySelector('#apresentacao .info-box:nth-child(6) .section-title');
    if (pergamumTitle) {
      pergamumTitle.innerHTML = `<i class="fas fa-book-reader" aria-hidden="true"></i> <span data-translate="pergamum-titulo">Meu Pergamum</span>`;
    }
    
    const pergamumAccess = document.querySelector('#apresentacao .info-box:nth-child(6) > p');
    if (pergamumAccess) {
      pergamumAccess.setAttribute('data-translate', 'pergamum-acesso');
    }
    
    const pergamumFeatures = document.querySelectorAll('.pergamum-feature p');
    const pergamumTranslateKeys = [
      'pergamum-login',
      'pergamum-busca',
      'pergamum-reserva',
      'pergamum-renovacao',
      'pergamum-ficha'
    ];
    
    pergamumFeatures.forEach((feature, index) => {
      if (index < pergamumTranslateKeys.length) {
        feature.setAttribute('data-translate', pergamumTranslateKeys[index]);
      }
    });
    
    const pergamumButton = document.querySelector('.cta-button');
    if (pergamumButton) {
      const buttonText = pergamumButton.innerHTML.split('</i>')[1].trim();
      pergamumButton.innerHTML = `<i class="fas fa-external-link-alt" aria-hidden="true"></i> <span data-translate="pergamum-botao">${buttonText}</span>`;
    }
    
    // Biblioteca Virtual
    const virtualLibraryTitle = document.querySelector('#apresentacao .info-box:nth-child(7) .section-title');
    if (virtualLibraryTitle) {
      virtualLibraryTitle.innerHTML = `<i class="fas fa-laptop" aria-hidden="true"></i> <span data-translate="biblioteca-virtual-titulo">Biblioteca Virtual Pearson / Normas ABNT</span>`;
    }
    
    const virtualLibraryText = document.querySelector('.pearson-container p');
    if (virtualLibraryText) {
      virtualLibraryText.setAttribute('data-translate', 'biblioteca-virtual-texto');
    }
    
    // Galeria
    const galleryTitle = document.querySelector('#apresentacao .info-box:nth-child(8) .section-title');
    if (galleryTitle) {
      galleryTitle.innerHTML = `<i class="fas fa-images" aria-hidden="true"></i> <span data-translate="galeria-titulo">Nossos Espaços</span>`;
    }
    
    const galleryTip = document.querySelector('.galeria-tip');
    if (galleryTip) {
      galleryTip.setAttribute('data-translate', 'galeria-dica');
    }
    
    // Novidades - CORREÇÃO AQUI
    const newsTitle = document.querySelector('#titulo-novidades');
    if (newsTitle) {
      // Substituir completamente o conteúdo para garantir que não haja elementos aninhados
      const iconHTML = '<i class="fas fa-newspaper" aria-hidden="true"></i>';
      newsTitle.innerHTML = `${iconHTML} <span data-translate="novidades-titulo">Novidades</span>`;
    }
    
    const eventsTitle = document.querySelector('.eventos-proximos h4');
    if (eventsTitle) {
      eventsTitle.innerHTML = `<i class="fas fa-calendar" aria-hidden="true"></i> <span data-translate="eventos-titulo">Eventos Próximos</span>`;
    }
    
    // Modal
    const closeModalButton = document.querySelector('.modal .fechar');
    if (closeModalButton) {
      closeModalButton.setAttribute('aria-label', 'Fechar imagem');
      closeModalButton.setAttribute('data-translate', 'fechar-imagem');
    }
    
    const prevImageButton = document.querySelector('.modal .anterior');
    if (prevImageButton) {
      prevImageButton.setAttribute('aria-label', 'Imagem anterior');
      prevImageButton.setAttribute('data-translate', 'imagem-anterior');
    }
    
    const nextImageButton = document.querySelector('.modal .proxima');
    if (nextImageButton) {
      nextImageButton.setAttribute('aria-label', 'Próxima imagem');
      nextImageButton.setAttribute('data-translate', 'proxima-imagem');
    }
    
    // Botão voltar ao topo
    const backToTopButton = document.getElementById('btnVoltarTopo');
    if (backToTopButton) {
      backToTopButton.setAttribute('aria-label', 'Voltar ao topo');
      backToTopButton.setAttribute('data-translate', 'voltar-ao-topo');
    }
    
    // Chat
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
      chatHeader.innerHTML = `<i class="fas fa-comments" aria-hidden="true"></i> <span data-translate="chat-titulo">Atendimento</span>`;
    }
    
    const chatMessage = document.querySelector('.chat-message .message-content');
    if (chatMessage) {
      const messageTime = chatMessage.querySelector('.message-time');
      const messageText = chatMessage.childNodes[0].textContent.trim();
      
      // Remover o texto e adicionar um span com data-translate
      chatMessage.childNodes[0].remove();
      const span = document.createElement('span');
      span.setAttribute('data-translate', 'chat-mensagem-inicial');
      span.textContent = messageText;
      
      // Inserir o span antes do message-time
      chatMessage.insertBefore(span, messageTime);
    }
    
    const chatOptions = document.querySelectorAll('.chat-option-btn');
    const chatOptionKeys = ['chat-opcao1', 'chat-opcao2', 'chat-opcao3'];
    
    chatOptions.forEach((option, index) => {
      if (index < chatOptionKeys.length) {
        option.setAttribute('data-translate', chatOptionKeys[index]);
      }
    });
    
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.setAttribute('data-translate', 'chat-placeholder');
    }
    
    // Rodapé
    const footerSections = document.querySelectorAll('.footer-section h4');
    const footerTitleKeys = ['rodape-titulo', 'rodape-horario', 'rodape-contato'];
    
    footerSections.forEach((section, index) => {
      if (index < footerTitleKeys.length) {
        section.setAttribute('data-translate', footerTitleKeys[index]);
      }
    });
    
    const footerCopyright = document.querySelector('.footer-bottom p:first-child');
    if (footerCopyright) {
      footerCopyright.setAttribute('data-translate', 'rodape-direitos');
    }
    
    const footerDeveloped = document.querySelector('.footer-bottom p:last-child');
    if (footerDeveloped) {
      footerDeveloped.setAttribute('data-translate', 'rodape-desenvolvido');
    }
    
    // Página de autores
    if (window.location.href.includes('autores.html')) {
      addAuthorPageTranslateAttributes();
    }
  }
  
  // Função específica para adicionar atributos data-translate à página de autores
  function addAuthorPageTranslateAttributes() {
    // Identificar cada autor pelo nome em vez de posição
    const autorCards = document.querySelectorAll('.autor-card');
    
    autorCards.forEach(card => {
      const autorName = card.querySelector('.autor-info h2').textContent.trim();
      
      // Aplicar atributos data-translate com base no nome do autor
      if (autorName === "Cora Coralina") {
        // Biografias de Cora Coralina
        const paragraphs = card.querySelectorAll('.autor-content p');
        paragraphs.forEach((para, index) => {
          para.setAttribute('data-translate', `cora-bio-p${index+1}`);
        });
        
        // Citação de Cora Coralina
        const quote = card.querySelector('.autor-quote span');
        if (quote) {
          quote.setAttribute('data-translate', 'cora-quote');
        }
        
        // Obras de Cora Coralina
        const obras = card.querySelectorAll('.obra-titulo');
        obras.forEach((obra, index) => {
          obra.setAttribute('data-translate', `cora-obra-${index+1}`);
        });
      }
      else if (autorName === "Lilia Moritz Schwarcz") {
        // Biografias de Lilia Schwarcz
        const paragraphs = card.querySelectorAll('.autor-content p');
        paragraphs.forEach((para, index) => {
          para.setAttribute('data-translate', `lilia-bio-p${index+1}`);
        });
        
        // Citação de Lilia Schwarcz
        const quote = card.querySelector('.autor-quote span');
        if (quote) {
          quote.setAttribute('data-translate', 'lilia-quote');
        }
        
        // Obras de Lilia Schwarcz
        const obras = card.querySelectorAll('.obra-titulo');
        obras.forEach((obra, index) => {
          obra.setAttribute('data-translate', `lilia-obra-${index+1}`);
        });
      }
      else if (autorName === "Rachel de Queiroz") {
        // Biografias de Rachel de Queiroz
        const paragraphs = card.querySelectorAll('.autor-content p');
        paragraphs.forEach((para, index) => {
          para.setAttribute('data-translate', `rachel-bio-p${index+1}`);
        });
        
        // Citação de Rachel de Queiroz
        const quote = card.querySelector('.autor-quote span');
        if (quote) {
          quote.setAttribute('data-translate', 'rachel-quote');
        }
        
        // Obras de Rachel de Queiroz
        const obras = card.querySelectorAll('.obra-titulo');
        obras.forEach((obra, index) => {
          obra.setAttribute('data-translate', `rachel-obra-${index+1}`);
        });
      }
      else if (autorName === "Paulina Chiziane") {
        // Biografias de Paulina Chiziane
        const paragraphs = card.querySelectorAll('.autor-content p');
        paragraphs.forEach((para, index) => {
          para.setAttribute('data-translate', `paulina-bio-p${index+1}`);
        });
        
        // Citação de Paulina Chiziane
        const quote = card.querySelector('.autor-quote span');
        if (quote) {
          quote.setAttribute('data-translate', 'paulina-quote');
        }
        
        // Obras de Paulina Chiziane
        const obras = card.querySelectorAll('.obra-titulo');
        obras.forEach((obra, index) => {
          obra.setAttribute('data-translate', `paulina-obra-${index+1}`);
        });
      }
      else if (autorName === "Malala Yousafzai") {
        // Biografias de Malala Yousafzai
        const paragraphs = card.querySelectorAll('.autor-content p');
        paragraphs.forEach((para, index) => {
          para.setAttribute('data-translate', `malala-bio-p${index+1}`);
        });
        
        // Citação de Malala Yousafzai
        const quote = card.querySelector('.autor-quote span');
        if (quote) {
          quote.setAttribute('data-translate', 'malala-quote');
        }
        
        // Obras de Malala Yousafzai
        const obras = card.querySelectorAll('.obra-titulo');
        obras.forEach((obra, index) => {
          obra.setAttribute('data-translate', `malala-obra-${index+1}`);
        });
      }
    });
  }
  
  // Inicializar o seletor de idioma quando o DOM estiver pronto
  initLanguageSwitcher();
  
  // Adicionar evento para recarregar a página quando o usuário clicar em um link interno
  document.querySelectorAll('a').forEach(link => {
    if (link.href && !link.href.startsWith('http') && !link.href.startsWith('mailto')) {
      link.addEventListener('click', function() {
        // Forçar recarregamento da página para garantir que as traduções sejam aplicadas
        localStorage.setItem('forceReload', 'true');
      });
    }
  });
  
  // Verificar se é necessário forçar o recarregamento
  if (localStorage.getItem('forceReload') === 'true') {
    localStorage.removeItem('forceReload');
    // Forçar recarregamento sem cache
    window.location.reload(true);
  }
});
