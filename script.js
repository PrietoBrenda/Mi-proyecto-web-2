// ========================================
// NAVEGACIÓN ENTRE SECCIONES
// ========================================
const menuLinks = document.querySelectorAll(".menu a, .cta");
const sections = document.querySelectorAll(".section");
const header = document.querySelector("header");

menuLinks.forEach(link => {
  // Ignorar enlaces que son solo triggers (como el carrito) si no tienen data-section
  if(!link.dataset.section && !link.classList.contains("cta")) return;

  link.addEventListener("click", e => {
    if(link.id === "cart-btn") return; // Si es el botón del carrito, lo maneja otra función
    
    e.preventDefault();
    const sectionId = link.dataset.section;
    
    // Actualizar enlaces activos en el menú
    document.querySelectorAll(".menu a").forEach(l => l.classList.remove("active"));
    
    // Si es un botón CTA, activar el enlace correspondiente
    if (link.classList.contains("cta")) {
      const menuLink = document.querySelector(`.menu a[data-section="${sectionId}"]`);
      if (menuLink) menuLink.classList.add("active");
    } else {
      link.classList.add("active");
    }

    // Mostrar sección seleccionada con animación
    sections.forEach(sec => sec.classList.remove("active"));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    }
    
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Cerrar menú móvil si está abierto
    if (window.innerWidth <= 768) {
      const menu = document.querySelector(".menu");
      if(menu) menu.classList.remove("active");
    }
  });
});

// ========================================
// EFECTO SCROLL EN HEADER
// ========================================
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  // Agregar clase cuando hay scroll
  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
  
  lastScroll = currentScroll;
  
  // Mostrar/ocultar botón scroll to top
  toggleScrollTopButton();
});

// ========================================
// LOGO CLICKEABLE
// ========================================
const brand = document.querySelector(".brand");
if(brand) {
  brand.addEventListener("click", () => {
    const homeLink = document.querySelector('.menu a[data-section="home"]');
    if (homeLink) {
      homeLink.click();
    }
  });
}

// ========================================
// MENÚ MÓVIL
// ========================================
const mobileToggle = document.querySelector(".mobile-toggle");
const menu = document.querySelector(".menu");

if (mobileToggle) {
  mobileToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
    
    // Cambiar icono
    const icon = mobileToggle.querySelector("i");
    if (menu.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================
function showNotification(message) {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Agregar estilos inline
  Object.assign(notification.style, {
    position: "fixed",
    top: "100px",
    right: "30px",
    background: "linear-gradient(135deg, #3a5f0b, #2d4809)",
    color: "white",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    zIndex: "10000",
    animation: "slideIn 0.5s ease, slideOut 0.5s ease 2.5s",
    opacity: "0"
  });
  
  // Agregar al body
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 10);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Agregar animaciones CSS para notificaciones
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(400px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(400px);
    }
  }
  
  .notification i {
    font-size: 1.3rem;
    color: #f2a007;
  }
`;
document.head.appendChild(notificationStyles);

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollTopBtn = document.querySelector(".scroll-top");

function toggleScrollTopButton() {
  if(!scrollTopBtn) return;
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}

if(scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ========================================
// ANIMACIÓN DE ENTRADA DE ELEMENTOS
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observar elementos cuando la sección está activa
function observeElements() {
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    const elementsToAnimate = activeSection.querySelectorAll(
      ".feature-card, .card, .about-text, .about-image, .info-item"
    );
    
    elementsToAnimate.forEach((el, index) => {
      // Solo animar si no ha sido animado
      if(el.style.opacity === "1") return;
      
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease";
      el.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }
}

// Ejecutar cuando cambia de sección
sections.forEach(section => {
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains("active")) {
        setTimeout(observeElements, 100);
      }
    });
  });
  
  mutationObserver.observe(section, {
    attributes: true,
    attributeFilter: ["class"]
  });
});

// Observar elementos de la sección inicial
window.addEventListener("load", () => {
  observeElements();
  toggleScrollTopButton();
});

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    const submitBtn = contactForm.querySelector(".btn-submit");
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  });
}

// ========================================
// EFECTO PARALLAX EN HERO
// ========================================
window.addEventListener("scroll", () => {
  const heroContent = document.querySelector(".hero-content");
  const heroDecoration = document.querySelector(".hero-decoration");
  
  if (heroContent && window.innerWidth > 768) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${rate}px)`;
    }
    
    if (heroDecoration) {
      heroDecoration.style.transform = `translateY(${rate * 0.5}px)`;
    }
  }
});

// ========================================
// SISTEMA DE CARRITO DE COMPRAS
// ========================================

let cart = [];

// Elementos del DOM
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.querySelector('.cart-close');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotalPrice = document.getElementById('cart-total-price');
const btnCheckout = document.querySelector('.btn-checkout');

// Abrir/Cerrar modal del carrito
if (cartBtn && cartModal) {
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  cartClose.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Cerrar al hacer click fuera del modal
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Controles de cantidad
document.querySelectorAll('.card').forEach(card => {
  const minusBtn = card.querySelector('.minus');
  const plusBtn = card.querySelector('.plus');
  const qtyInput = card.querySelector('.qty-input');
  
  if(minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      let value = parseInt(qtyInput.value);
      if (value > 1) {
        qtyInput.value = value - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      let value = parseInt(qtyInput.value);
      if (value < 10) {
        qtyInput.value = value + 1;
      }
    });
  }
});

// Agregar al carrito
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.card');
    const productName = card.querySelector('h3').textContent;
    const productPrice = parseInt(card.dataset.price);
    const productId = card.dataset.product;
    const quantity = parseInt(card.querySelector('.qty-input').value);
    
    // Buscar si el producto ya existe en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      // Si existe, actualizar cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no existe, agregar nuevo item
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity
      });
    }
    
    updateCart();
    showNotification(`¡${productName} agregado! 🛒 (${quantity} Kg)`);
    
    // Animación del botón
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.style.transform = '';
    }, 300);
    
    // Reset cantidad a 1
    card.querySelector('.qty-input').value = 1;
  });
});

// Actualizar carrito
function updateCart() {
  if(!cartCount) return;

  // Actualizar contador
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (totalItems > 0) {
    cartCount.style.display = 'flex';
  } else {
    cartCount.style.display = 'none';
  }
  
  // Actualizar lista de items
  if (cart.length === 0) {
    cartItems.style.display = 'none';
    cartEmpty.style.display = 'block';
    cartTotalPrice.textContent = '$0';
  } else {
    cartItems.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-details">
            <span>${item.quantity} Kg × $${item.price.toLocaleString('es-AR')}</span>
          </div>
          <div class="cart-item-total">
            $${(item.price * item.quantity).toLocaleString('es-AR')}
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.removeFromCart('${item.id}')" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `$${total.toLocaleString('es-AR')}`;
  }
}

// Hacer la función accesible globalmente para el onclick del HTML
window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showNotification('Producto eliminado del carrito');
}

// Finalizar compra
if(btnCheckout) {
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      showNotification('Tu carrito está vacío');
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => 
      `${item.name}: ${item.quantity} Kg × $${item.price.toLocaleString('es-AR')} = $${(item.price * item.quantity).toLocaleString('es-AR')}`
    ).join('\n');
    
    const message = `¡Hola! Quiero hacer un pedido:\n\n${itemsList}\n\n*Total: $${total.toLocaleString('es-AR')}*`;
    const whatsappUrl = `https://wa.me/542235136298?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito
    cart = [];
    updateCart();
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
    
    showNotification('¡Pedido enviado por WhatsApp! 📱');
  });
}

// Inicializar carrito vacío
updateCart();