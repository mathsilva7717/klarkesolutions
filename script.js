// Inicializar EmailJS
(function() {
    emailjs.init("t8yWctJHWGsgfO62F");
})();

// Scroll suave para mobile
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
    }, { passive: true });
    
    link.addEventListener('touchend', function() {
        this.style.opacity = '1';
    }, { passive: true });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Adicionar animação aos cards de serviço
document.querySelectorAll('.servico-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Adicionar animação às features do DIMITRI
document.querySelectorAll('.feature-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.6s ease ${index * 0.15}s`;
    observer.observe(item);
});

// Adicionar animação aos storage features
document.querySelectorAll('.storage-feature').forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateX(-30px)';
    feature.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(feature);
});

// Adicionar animação aos benefit items
document.querySelectorAll('.benefit-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.5s ease ${index * 0.08}s`;
    observer.observe(item);
});

// Animação das mensagens do chat
const chatMessages = document.querySelectorAll('.chat-message');
let messageDelay = 0;

const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            chatMessages.forEach((message, index) => {
                setTimeout(() => {
                    message.style.opacity = '1';
                    message.style.transform = 'translateY(0)';
                }, index * 600);
            });
            chatObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const chatDemo = document.querySelector('.chat-demo');
if (chatDemo) {
    chatMessages.forEach(message => {
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
        message.style.transition = 'all 0.5s ease';
    });
    chatObserver.observe(chatDemo);
}

// Form handling
const contactForm = document.getElementById('contactForm');

// Função para validar email
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email é obrigatório' };
    }
    
    if (!email.includes('@')) {
        return { valid: false, message: 'Email deve conter @' };
    }
    
    const parts = email.split('@');
    if (parts.length !== 2) {
        return { valid: false, message: 'Formato de email inválido' };
    }
    
    const domain = parts[1];
    if (!domain || !domain.includes('.')) {
        return { valid: false, message: 'Domínio deve ter pelo menos um ponto' };
    }
    
    if (parts[0].trim() === '' || domain.trim() === '') {
        return { valid: false, message: 'Email inválido' };
    }
    
    return { valid: true, message: '' };
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Validação básica
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const interesse = document.getElementById('interesse').value;
    const mensagem = document.getElementById('mensagem').value.trim();
    
    if (!nome || nome.length < 2) {
        showNotification('Por favor, preencha seu nome corretamente.', 'error');
        return;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showNotification(emailValidation.message, 'error');
        return;
    }
    
    if (!telefone || telefone.length < 10) {
        showNotification('Por favor, preencha um telefone válido.', 'error');
        return;
    }
    
    if (!interesse) {
        showNotification('Por favor, selecione um interesse.', 'error');
        return;
    }
    
    if (!mensagem || mensagem.length < 10) {
        showNotification('Por favor, escreva uma mensagem com pelo menos 10 caracteres.', 'error');
        return;
    }
    
    // Mostrar estado de carregamento
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    try {
        // Obter texto do interesse selecionado
        const interesseSelect = document.getElementById('interesse');
        const interesseTexto = interesseSelect.options[interesseSelect.selectedIndex].text;
        
        // Preparar parâmetros do email
        const templateParams = {
            from_name: nome,
            from_email: email,
            subject: `Contato via site - ${interesseTexto}`,
            telefone: telefone,
            interesse: interesseTexto,
            message: mensagem,
            to_email: 'klarkesolutions@gmail.com'
        };
        
        // Enviar email usando EmailJS
        const response = await emailjs.send(
            'service_jzvl49t',
            'template_wjr4v6l',
            templateParams
        );
        
        // Sucesso
        submitButton.textContent = '✓ Mensagem Enviada!';
        submitButton.style.background = 'linear-gradient(135deg, #00d084, #00b369)';
        
        // Reset form
        contactForm.reset();
        
        // Mostrar notificação de sucesso
        showNotification('Obrigado! Entraremos em contato em breve.', 'success');
        
        // Restaurar botão após 3 segundos
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        
        // Mostrar erro
        submitButton.textContent = 'Erro ao enviar';
        submitButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a6f)';
        
        showNotification('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.', 'error');
        
        // Restaurar botão após 3 segundos
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
    }
});

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d084, #00b369)' : 'linear-gradient(135deg, #ff6b6b, #ee5a6f)'};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s;
        font-weight: 500;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Adicionar efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Easter egg: console message
console.log('%cKLARKE SOLUTIONS', 'font-size: 24px; font-weight: bold; color: #4a90e2;');
console.log('%cTecnologia que simplifica.', 'font-size: 14px; color: #2c5f9e;');
console.log('%cInteressado em trabalhar conosco? Entre em contato!', 'font-size: 12px; color: #8b949e;');

// Preloader effect (opcional)
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

