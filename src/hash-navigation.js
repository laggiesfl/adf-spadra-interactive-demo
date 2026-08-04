export function navigateToHash(documentRef, hash) {
  if (!hash || hash === '#') return false;
  const id = decodeURIComponent(hash.slice(1));
  const target = documentRef.getElementById(id);
  if (!target) return false;
  target.scrollIntoView();
  const heading = target.querySelector('h1,h2,h3');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  return true;
}
