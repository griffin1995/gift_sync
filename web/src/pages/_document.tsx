import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags for PWA */}
        <meta name="theme-color" content="#f03dff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GiftSync" />
        
        {/* Optimize font loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" />
        
        {/* Analytics placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics - replace with actual ID */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
            
            {/* Mixpanel */}
            {process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                    mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {
                      debug: false,
                      track_pageview: true,
                      persistence: 'localStorage'
                    });
                  `,
                }}
              />
            )}
          </>
        )}
      </Head>
      <body className="antialiased bg-gray-50">
        <Main />
        <NextScript />
        
        {/* Enhanced Service Worker Registration */}
        {typeof window !== 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', function() {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Show update available notification
                                if (window.confirm('A new version is available. Refresh to update?')) {
                                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                                  window.location.reload();
                                }
                              }
                            });
                          }
                        });
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                      
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', function(event) {
                      if (event.data && event.data.type === 'navigate') {
                        window.location.href = event.data.url;
                      }
                    });
                  });
                  
                  // Listen for service worker updates
                  navigator.serviceWorker.addEventListener('controllerchange', function() {
                    window.location.reload();
                  });
                }
                
                // Preload critical routes for better performance
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(function() {
                    const criticalRoutes = ['/discover', '/dashboard', '/auth/login'];
                    criticalRoutes.forEach(function(route) {
                      const link = document.createElement('link');
                      link.rel = 'prefetch';
                      link.href = route;
                      document.head.appendChild(link);
                    });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </Html>
  );
}