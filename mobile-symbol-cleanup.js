(function removeMobileDecorativeSymbols() {
  const mobileViewport = window.matchMedia('(max-width: 820px)');
  const hasDecorativeSymbol = /[\u200D\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u{1F000}-\u{1FAFF}]/u;
  const decorativeSymbols = /[\u200D\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u{1F000}-\u{1FAFF}]/gu;
  const onlyDecorativeSymbols = /^[\s\u200D\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u{1F000}-\u{1FAFF}]+$/u;
  let observer;
  let cleanQueued = false;

  function mobileLinkLabel(element) {
    const explicitLabel = ['aria-label', 'title']
      .map(attribute => element.getAttribute?.(attribute) || '')
      .map(value => value.replace(decorativeSymbols, '').trim())
      .find(Boolean);

    if (explicitLabel) return explicitLabel;

    const href = element.getAttribute?.('href') || '';
    const lowerHref = href.toLowerCase();

    if (lowerHref.startsWith('tel:')) return 'Call Elero';
    if (lowerHref.startsWith('mailto:')) return 'Email Elero';

    const destinations = [
      ['quote', 'View quote'],
      ['website', 'View website'],
      ['pricing', 'Pricing'],
      ['service', 'Services'],
      ['process', 'Process'],
      ['about', 'About'],
      ['contact', 'Contact'],
      ['portal', 'Client portal'],
      ['payment', 'Payment']
    ];
    const matchedDestination = destinations.find(([keyword]) => lowerHref.includes(keyword));

    if (matchedDestination) return matchedDestination[1];
    if (href === '/' || href === '#') return 'Home';
    return element.tagName === 'BUTTON' ? 'Open' : 'Open link';
  }

  function cleanMobileSymbols() {
    if (!mobileViewport.matches || !document.body) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const parent = node.parentElement;
      const original = node.nodeValue || '';

      if (
        !parent ||
        !hasDecorativeSymbol.test(original) ||
        parent.closest('script, style, noscript, textarea, code, pre, [data-keep-mobile-symbols]')
      ) return;

      const containedOnlySymbols = onlyDecorativeSymbols.test(original);
      node.nodeValue = original.replace(decorativeSymbols, '');

      if (containedOnlySymbols && !parent.textContent.trim()) {
        const interactive = parent.closest('a, button, [role="button"]');
        const existingLabel = interactive
          ? interactive.textContent.replace(decorativeSymbols, '').trim()
          : '';

        if (interactive && !existingLabel) {
          node.nodeValue = mobileLinkLabel(interactive);
          parent.hidden = false;
          interactive.classList?.add('mobile-symbol-link');
        } else {
          parent.hidden = true;
        }
      }
    });
  }

  function startMobileCleanup() {
    cleanMobileSymbols();

    if (!observer && document.body && typeof MutationObserver === 'function') {
      observer = new MutationObserver(() => {
        if (!mobileViewport.matches || cleanQueued) return;
        cleanQueued = true;
        window.requestAnimationFrame(() => {
          cleanQueued = false;
          cleanMobileSymbols();
        });
      });
      observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMobileCleanup, { once: true });
  } else {
    startMobileCleanup();
  }

  if (typeof mobileViewport.addEventListener === 'function') {
    mobileViewport.addEventListener('change', event => {
      if (event.matches) startMobileCleanup();
    });
  }
})();
