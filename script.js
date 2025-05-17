// Esperar que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
  // Remover o loader quando a página estiver carregada
  window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(function() {
        loader.classList.add('hidden');
      }, 500);
    }
  });

  // Variáveis globais
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');
  const fecharMenuBtn = document.querySelector('.fechar-menu');
  const toggleThemeBtn = document.getElementById('toggleTheme');
  const btnVoltarTopo = document.getElementById('btnVoltarTopo');
  const chatHeader = document.getElementById('chatHeader');
  const chatContainer = document.querySelector('.chat-container');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatBody = document.getElementById('chatBody');
  const chatOptionBtns = document.querySelectorAll('.chat-option-btn');
  
  // Log para verificar os elementos
  console.log('Elementos encontrados:', {
    menuBtn: menuBtn ? 'Encontrado' : 'Não encontrado',
    navMenu: navMenu ? 'Encontrado' : 'Não encontrado',
    fecharMenuBtn: fecharMenuBtn ? 'Encontrado' : 'Não encontrado'
  });
  
  // Função para alternar o menu mobile
  function toggleMenu() {
    console.log('Menu toggle clicado!');
    if (navMenu) {
      console.log('Alternando classe active');
      navMenu.classList.toggle('active');
      
      // Atualizar aria-expanded
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
      menuBtn.setAttribute('aria-expanded', !expanded);
      
      // Bloquear rolagem do body quando o menu estiver aberto
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    } else {
      console.error('Elemento do menu não encontrado!');
    }
  }
  
  // Função para fechar o menu
  function closeMenu() {
    if (navMenu) {
      navMenu.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
  
  // Função para alternar o tema (claro/escuro)
  function toggleTheme() {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    
    // Salvar preferência no localStorage
    localStorage.setItem('dark-theme', isDarkTheme);
    
    // Alterar a imagem do banner conforme o tema
    const bannerImg = document.getElementById('banner-img');
    if (bannerImg) {
      bannerImg.src = isDarkTheme ? 'img/Banner_escuro.png' : 'img/Banner_claro.png';
    }
  }
  
  // Verificar tema salvo no localStorage
  function checkSavedTheme() {
    const savedTheme = localStorage.getItem('dark-theme');
    
    if (savedTheme === 'true') {
      document.body.classList.add('dark-theme');
      const bannerImg = document.getElementById('banner-img');
      if (bannerImg) {
        bannerImg.src = 'img/Banner_escuro.png';
      }
    }
  }
  
  // Função para mostrar/esconder botão voltar ao topo
  function toggleScrollButton() {
    if (window.pageYOffset > 300) {
      if (btnVoltarTopo) btnVoltarTopo.classList.add('visible');
    } else {
      if (btnVoltarTopo) btnVoltarTopo.classList.remove('visible');
    }
  }
  
  // Função para rolar suavemente até o topo
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Função para abrir o chat
  function toggleChat() {
    if (chatContainer) {
      chatContainer.classList.toggle('active');
      if (chatContainer.classList.contains('active')) {
        chatInput.focus();
      }
    }
  }
  
  // Função para enviar mensagem no chat
  function sendChatMessage() {
    if (!chatInput || !chatBody) return;
    
    const message = chatInput.value.trim();
    if (message !== '') {
      // Criar elemento de mensagem do usuário
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message usuario';
      
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      messageElement.innerHTML = `
        <div class="message-content">
          ${message}
          <div class="message-time">${timeString}</div>
        </div>
      `;
      
      chatBody.appendChild(messageElement);
      chatInput.value = '';
      
      // Simular resposta automática após um breve atraso
      setTimeout(function() {
        const responseElement = document.createElement('div');
        responseElement.className = 'chat-message biblioteca';
        
        responseElement.innerHTML = `
          <div class="message-content">
            Obrigado por entrar em contato. Um de nossos bibliotecários responderá em breve.
            <div class="message-time">${timeString}</div>
          </div>
        `;
        
        chatBody.appendChild(responseElement);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
      
      // Rolar para o final do chat
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
  
  // Função para tratar clique nos botões de opções do chat
  function handleChatOptionClick(e) {
    if (!chatBody) return;
    
    const optionText = e.target.textContent;
    
    // Simular clique do usuário na opção
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message usuario';
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    messageElement.innerHTML = `
      <div class="message-content">
        ${optionText}
        <div class="message-time">${timeString}</div>
      </div>
    `;
    
    chatBody.appendChild(messageElement);
    
    // Gerar resposta automática baseada na opção
    setTimeout(function() {
      const responseElement = document.createElement('div');
      responseElement.className = 'chat-message biblioteca';
      
      let responseText = '';
      
      if (optionText.includes('emprestar')) {
        responseText = 'Para emprestar um livro, você precisa estar cadastrado no sistema Pergamum. Visite nossa biblioteca com seu documento e faça seu cadastro. Depois, é só escolher o livro e fazer o empréstimo no balcão de atendimento ou pelo sistema online.';
      } else if (optionText.includes('funcionamento')) {
        responseText = 'A biblioteca funciona de segunda a sexta-feira, das 9h às 21h30.';
      } else if (optionText.includes('bibliotecário')) {
        responseText = 'Para falar com um bibliotecário, você pode nos visitar pessoalmente, ligar para (18) 3643-1033 ou enviar um e-mail para cbi.bri@ifsp.edu.br.';
      } else {
        responseText = 'Obrigado por entrar em contato. Um de nossos bibliotecários responderá em breve.';
      }
      
      responseElement.innerHTML = `
        <div class="message-content">
          ${responseText}
          <div class="message-time">${timeString}</div>
        </div>
      `;
      
      chatBody.appendChild(responseElement);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
    
    // Rolar para o final do chat
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  // Funções para a galeria modal
  let currentImageIndex = 0;
  const images = document.querySelectorAll('.galeria-imagens img');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('imgModal');
  const modalCaption = document.getElementById('modal-caption');
  const closeBtn = document.querySelector('.modal .fechar');
  const prevBtn = document.querySelector('.modal .anterior');
  const nextBtn = document.querySelector('.modal .proxima');
  
  // Função para abrir o modal
  function abrirModal(imgElement) {
    if (!modal || !modalImg || !modalCaption) return;
    
    modalImg.src = imgElement.src;
    modalCaption.textContent = imgElement.alt;
    modal.style.display = 'flex';
    
    // Encontrar o índice da imagem atual
    for (let i = 0; i < images.length; i++) {
      if (images[i].src === imgElement.src) {
        currentImageIndex = i;
        break;
      }
    }
    
    // Adicionar classe para prevenir rolagem
    document.body.style.overflow = 'hidden';
  }
  
  // Função para fechar o modal
  function fecharModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  // Função para navegar para a imagem anterior
  function imagemAnterior() {
    if (!images.length || !modalImg || !modalCaption) return;
    
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentImageIndex].src;
    modalCaption.textContent = images[currentImageIndex].alt;
  }
  
  // Função para navegar para a próxima imagem
  function imagemProxima() {
    if (!images.length || !modalImg || !modalCaption) return;
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.src = images[currentImageIndex].src;
    modalCaption.textContent = images[currentImageIndex].alt;
  }
  
  // Pesquisa
  const formBusca = document.querySelector('.busca');
  
  function handleSearch(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('campo-pesquisa').value.trim();
    
    if (searchTerm !== '') {
      // Redirecionar para o sistema Pergamum com o termo de busca
      window.open(`https://ifsp.pergamum.com.br/pergamum/biblioteca/index.php?palavra_chave=${encodeURIComponent(searchTerm)}`, '_blank');
    }
  }
  
  // Event Listeners
  
  // Menu mobile - CORREÇÃO AQUI
  if (menuBtn) {
    console.log('Adicionando event listener ao botão do menu');
    // Usar o evento 'touchstart' para dispositivos móveis, além do 'click'
    menuBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      console.log('Touch detectado no botão do menu');
      toggleMenu();
    });
    
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Clique detectado no botão do menu');
      toggleMenu();
    });
  } else {
    console.error('Botão do menu não encontrado');
  }
  
  if (fecharMenuBtn) {
    fecharMenuBtn.addEventListener('click', closeMenu);
    fecharMenuBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      closeMenu();
    });
  }
  
  // Fechar menu ao clicar fora (para dispositivos móveis)
  document.addEventListener('click', function(e) {
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        e.target !== menuBtn) {
      closeMenu();
    }
  });
  
  // Toggle de tema
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', toggleTheme);
  }
  
  // Botão voltar ao topo
  window.addEventListener('scroll', toggleScrollButton);
  
  if (btnVoltarTopo) {
    btnVoltarTopo.addEventListener('click', scrollToTop);
  }
  
  // Chat
  if (chatHeader) {
    chatHeader.addEventListener('click', toggleChat);
  }
  
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
  
  // Botões de opções do chat
  chatOptionBtns.forEach(function(btn) {
    btn.addEventListener('click', handleChatOptionClick);
  });
  
  // Modal de imagens
  window.abrirModal = abrirModal; // Exportar função para uso global (onclick nas imagens)
  
  if (closeBtn) {
    closeBtn.addEventListener('click', fecharModal);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', imagemAnterior);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', imagemProxima);
  }
  
  // Fechar modal com a tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      fecharModal();
    }
  });
  
  // Pesquisa
  if (formBusca) {
    formBusca.addEventListener('submit', handleSearch);
  }
  
  // Inicializações
  checkSavedTheme();
  toggleScrollButton();

  // Debug info
  console.log('DOM Carregado. Elementos do menu:', {
    menuBtn: menuBtn ? 'Encontrado' : 'Não encontrado',
    navMenu: navMenu ? 'Encontrado' : 'Não encontrado',
    fecharMenuBtn: fecharMenuBtn ? 'Encontrado' : 'Não encontrado'
  });
});