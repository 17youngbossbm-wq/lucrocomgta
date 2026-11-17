// Mantém os links de compra utilizáveis mesmo quando o Pixel estiver bloqueado.
const checkoutLinks = document.querySelectorAll('a.checkout-link');
let checkoutInProgress = false;

checkoutLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (checkoutInProgress) {
      event.preventDefault();
      return;
    }

    checkoutInProgress = true;
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout');
    }

    // Deixa o navegador tratar normalmente abertura em nova aba e atalhos de teclado.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      window.setTimeout(() => { checkoutInProgress = false; }, 400);
      return;
    }

    event.preventDefault();
    const destination = link.href;
    // Pequena margem para o evento sair antes da navegação, sem depender da rede do Pixel.
    window.setTimeout(() => { window.location.assign(destination); }, 180);
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
