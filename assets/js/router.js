// Client-side router to support extensionless URLs
(function(){
  // Intercept clicks on internal links and normalize URLs (hide .html)
  function isInternal(href){
    if(!href) return false;
    try{ const u=new URL(href, location.href); return u.origin === location.origin; }catch(e){return false}
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    if(href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if(!isInternal(href)) return; // external link — let it

    // Prevent full page navigation for same-origin links — handle extensionless
    const url = new URL(href, location.href);
    const path = url.pathname.replace(/\/+$|^\/+/g, ''); // trim slashes

    // If the link points to a non-.html file (asset, external), allow default navigation
    const hasExt = /\.[a-z0-9]+$/i.test(path);
    if (hasExt && !path.endsWith('.html')) return; // allow images, pdfs, etc.

    e.preventDefault();
    // preserve search and hash when pushing state and loading content
    const rawPath = path.endsWith('.html') ? path.replace(/\.html$/i, '') : path;
    const targetPath = '/' + rawPath;
    const search = url.search || '';
    const hash = url.hash || '';
    const pushPath = targetPath + (search) + (hash);
    const htmlPath = (targetPath === '/' ? '/index.html' : targetPath + '.html');

    fetchAndSwap(htmlPath, pushPath);
  }, true);

  async function fetchAndSwap(htmlPath, pushPath){
    try{
      const res = await fetch(htmlPath, {cache: 'no-store', redirect: 'follow'});
      if(!res.ok) {
        // if not found, try index.html
        if(htmlPath !== '/index.html') {
          const res2 = await fetch('/index.html');
          if(res2.ok) {
            const text = await res2.text();
            replaceDocument(text, pushPath);
            return;
          }
        }
        location.href = htmlPath; // fallback to native
        return;
      }
      const text = await res.text();
      replaceDocument(text, pushPath);
    }catch(err){
      console.error('Router fetch error', err);
      location.href = htmlPath; // fallback
    }
  }

  function replaceDocument(htmlText, pushPath){
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    // replace <title>
    const newTitle = doc.querySelector('title');
    if(newTitle) document.title = newTitle.textContent;
    // replace <body> content only
    const newBody = doc.body;
    if (newBody) {
      document.body.replaceWith(document.importNode(newBody, true));
    }
    // update history — compare full URL (path + search + hash)
    if((window.location.pathname + (window.location.search||'') + (window.location.hash||'')) !== pushPath){
      history.pushState({}, '', pushPath);
    }
    // re-run any scripts that need initialization if a global init exists
    if(typeof window.pageInit === 'function') setTimeout(window.pageInit, 40);
  }

  // handle back/forward
  window.addEventListener('popstate', function(){
    // Support both extensionless and .html history entries. If the pathname
    // contains a trailing .html, strip it for lookup but allow either form.
    try{
      const path = (location.pathname || '').replace(/\.html$/, '') || '/';
      const htmlPath = path === '/' ? '/index.html' : path + '.html';
      fetch(htmlPath).then(r=> r.ok ? r.text() : fetch('/index.html').then(r=>r.text())).then(text=>{
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        document.documentElement.replaceChild(document.importNode(doc.documentElement, true), document.documentElement);
        if(typeof window.pageInit === 'function') setTimeout(window.pageInit, 40);
      }).catch(err=>{ console.error(err); location.reload(); });
    }catch(e){ console.error('popstate handler error', e); location.reload(); }
  });

  // small helper to update visible links on load (remove .html from hrefs)
  function normalizeLinks(){
    document.querySelectorAll('a[href]').forEach(a=>{
      try{
        const u=new URL(a.href, location.href);
        if(u.origin !== location.origin) return;
        const p = u.pathname;
        if(p.endsWith('.html')){
          const newPath = p.replace(/\.html$/, '');
          a.href = newPath + (u.search||'') + (u.hash||'');
        }
      }catch(e){}
    });
    // If the page was opened with a .html URL, replace the current history
    // entry with the extensionless variant so back/forward doesn't restore
    // the .html URL.
    try{
      if(location.pathname && location.pathname.endsWith('.html')){
        const clean = location.pathname.replace(/\.html$/, '') || '/';
        const newUrl = clean + (location.search||'') + (location.hash||'');
        history.replaceState({}, '', newUrl);
      }
    }catch(e){}
  }
  window.addEventListener('DOMContentLoaded', normalizeLinks);
  window.routerNormalizeLinks = normalizeLinks;
})();
