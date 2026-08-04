export const shouldShowBackToTop=scrollY=>Number(scrollY)>=400;
export const scrollBehaviour=reduced=>reduced?'auto':'smooth';
export function bindBackToTop(button,target,root=document.documentElement,win=window){
  const paint=()=>{button.hidden=!shouldShowBackToTop(win.scrollY)}; win.addEventListener('scroll',paint,{passive:true});paint();
  button.addEventListener('click',()=>{const reduced=root.dataset.reducedMotion==='true'||win.matchMedia('(prefers-reduced-motion: reduce)').matches;target.scrollIntoView({behavior:scrollBehaviour(reduced),block:'start'});target.focus({preventScroll:true})});
}
