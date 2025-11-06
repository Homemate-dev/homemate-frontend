// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from 'expo-router/html'

export default function Root({ children }: { children: React.ReactNode }) {
  // ✅ Maze snippet (QA 도메인에서만 실행)
  const mazeSnippet = `(function () {
    var host = location.hostname;
    if (!host.includes('qa-homemate.vercel.app')) return;

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

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />

        {/* ✅ Maze QA snippet 삽입 */}
        <script dangerouslySetInnerHTML={{ __html: mazeSnippet }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
