export type Choice = 'light' | 'dark' | 'system';
export const THEME_KEY = 'purser-theme';
export const THEME_COLOR = { light: '#EAEAE9', dark: '#141110' };

/**
 * Runs in the head before anything paints, so a dark visitor never sees a light frame.
 * Also exposes itself for the switch, so there is one place that decides.
 */
export const themeScript = (darkClass: string) => `(function(){
var cls=${JSON.stringify(darkClass.split(' ').filter(Boolean))},colors=${JSON.stringify(THEME_COLOR)},mq=matchMedia('(prefers-color-scheme: dark)'),subs=[],meta=null;
function read(){try{var c=localStorage.getItem('${THEME_KEY}');return c==='light'||c==='dark'?c:'system'}catch(e){return 'system'}}
var choice=read();
function apply(){var dark=choice==='dark'||(choice==='system'&&mq.matches),h=document.documentElement;
cls.forEach(function(c){h.classList.toggle(c,dark)});h.dataset.theme=dark?'dark':'light';
if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)}meta.content=colors[dark?'dark':'light'];
subs.forEach(function(f){f()})}
mq.addEventListener('change',apply);
addEventListener('storage',function(e){if(e.key==='${THEME_KEY}'||e.key===null){choice=read();apply()}});
window.__theme={get:function(){return choice},dark:function(){return document.documentElement.dataset.theme==='dark'},
set:function(c){choice=c;try{c==='system'?localStorage.removeItem('${THEME_KEY}'):localStorage.setItem('${THEME_KEY}',c)}catch(e){}apply()},
sub:function(f){subs.push(f);return function(){subs=subs.filter(function(x){return x!==f})}},apply:apply};
apply()})()`;
