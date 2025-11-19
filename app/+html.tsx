// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from 'expo-router/html'

export default function Root({ children }: { children: React.ReactNode }) {
  // ------------------------------------------
  // 🧩 Maze 스니펫 (QA 도메인 전용)
  // ------------------------------------------
  const mazeSnippet = `(function () {
    var host = location.hostname;
    if (!host.includes('qa-homemate.vercel.app')) return;

    console.log('[Maze] guard passed on', host);

    (function (m, a, z, e) {
      var s, t, u, v;
      try { t = m.sessionStorage.getItem('maze-us'); } catch (err) {}
      if (!t) {
        t = new Date().getTime();
        try { m.sessionStorage.setItem('maze-us', t); } catch (err) {}
      }

      u = document.currentScript || (function () {
        var w = a.getElementsByTagName('script');
        return w[w.length - 1];
      })();
      v = u && u.nonce;

      s = a.createElement('script');
      s.src = z + '?apiKey=' + e;
      s.async = true;
      if (v) s.setAttribute('nonce', v);
      a.getElementsByTagName('head')[0].appendChild(s);
      m.mazeUniversalSnippetApiKey = e;
    })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'fb04360f-711e-4a71-adc8-af705d876aec');
  })();`

  // ------------------------------------------
  // 🧩 Google Tag Manager (Head)
  // ------------------------------------------
  const gtmHead = `(function(w,d,s,l,i){w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s), dl=l!='dataLayer' ? '&l='+l : '';
    j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TP2SNHWZ');`

  // ------------------------------------------
  // 🧩 Google Tag Manager (noscript)
  // ------------------------------------------
  const gtmNoScript = `
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TP2SNHWZ"
        height="0" width="0" style="display:none;visibility:hidden">
      </iframe>
    </noscript>
  `

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 기본 RN-Web 스타일 리셋 */}
        <ScrollViewStyleReset />

        {/* ====================== */}
        {/* 🟡 GTM (Head) */}
        {/* ====================== */}
        <script dangerouslySetInnerHTML={{ __html: gtmHead }} />

        {/* ====================== */}
        {/* 🟡 Maze (QA only) */}
        {/* ====================== */}
        <script dangerouslySetInnerHTML={{ __html: mazeSnippet }} />
      </head>

      <body>
        {/* ====================== */}
        {/* 🟡 GTM (noscript) */}
        {/* ====================== */}
        <div dangerouslySetInnerHTML={{ __html: gtmNoScript }} />

        {children}
      </body>
    </html>
  )
}
