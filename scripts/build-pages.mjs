// Собирает приложение «Заклятые» для GitHub Pages в папку docs/.
// Запуск: npm run build  (после любых правок в zaklyatye.html или иконках)
// Приложению не нужен сервер: только статичные файлы, офлайн-режим и установка на экран телефона.
// Все пути относительные, потому что сайт живёт по адресу …github.io/Aap_Zaklyatie/
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs');
const ICONS = ['icon-192.png', 'icon-512.png', 'maskable-512.png', 'apple-touch-icon.png'];
const VERSION = new Date().toISOString().replace(/\D/g, '').slice(0, 12);

const game = await readFile(path.join(ROOT, 'zaklyatye.html'), 'utf8');

const index = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#ecebe5">
<meta name="description" content="Заклятые — карточная игра для компании: белая колода сплачивает, чёрная ссорит.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Заклятые">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta property="og:title" content="Заклятые">
<meta property="og:description" content="Две колоды на одну компанию. Белая сплачивает, чёрная ссорит.">
<meta property="og:image" content="cover.png">
<script>window.ZK_PWA=true;if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${game}
</body>
</html>
`;

const manifest = JSON.stringify({
  name: 'Заклятые',
  short_name: 'Заклятые',
  description: 'Карточная игра для компании: белая колода сплачивает, чёрная ссорит.',
  lang: 'ru',
  start_url: './?source=app',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#ecebe5',
  theme_color: '#ecebe5',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2);

// Офлайн: страница — сначала из сети (чтобы обновления приходили сразу), шрифты и иконки — из кэша
const sw = `const C='zk-${VERSION}';
const BASE=self.registration.scope;
const CORE=['./','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(BASE,cp));return res}).catch(()=>caches.match(BASE)));return}
  if(u.href.startsWith(BASE)||/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
  }
});
`;

await rm(OUT, { recursive: true, force: true });
await mkdir(path.join(OUT, 'icons'), { recursive: true });
await writeFile(path.join(OUT, 'index.html'), index);
await writeFile(path.join(OUT, 'manifest.webmanifest'), manifest);
await writeFile(path.join(OUT, 'sw.js'), sw);
await writeFile(path.join(OUT, '.nojekyll'), '');
await copyFile(path.join(ROOT, 'bot', 'cover.png'), path.join(OUT, 'cover.png'));
for (const f of ICONS) await copyFile(path.join(ROOT, 'bot', 'icons', f), path.join(OUT, 'icons', f));
console.log(`Готово: docs/ (версия ${VERSION})`);
