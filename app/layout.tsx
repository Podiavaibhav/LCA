import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "LCA Platform | Life Cycle Assessment for Metals",
  description: "Government-grade Life Cycle Assessment platform for sustainable metallurgy and circular economy",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LCA Platform",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "LCA Platform",
    title: "Life Cycle Assessment for Metals",
    description: "Government-grade sustainability analysis platform",
  },
  twitter: {
    card: "summary",
    title: "LCA Platform",
    description: "Government-grade sustainability analysis platform",
  },
}

export const viewport = {
  themeColor: "#059669",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="LCA Platform" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LCA Platform" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#059669" />

        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icon-192.jpg" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <OfflineIndicator />
        <Suspense fallback={null}>{children}</Suspense>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[SW] Registration successful: ', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('[SW] Registration failed: ', error);
                    });
                });
              }
              
              // Targeted v0 attribution removal (avoid interfering with PWA)
              function removeV0Attribution() {
                try {
                  // Only target specific v0 button pattern - be very specific
                  const v0Buttons = document.querySelectorAll('[id*="v0-built-with-button"]');
                  v0Buttons.forEach(el => {
                    // Double check it's actually a v0 attribution element
                    if (el.textContent && (el.textContent.includes('Built with') || el.textContent.includes('v0'))) {
                      el.remove();
                    }
                  });
                  
                  // Only remove elements that specifically contain v0 attribution text
                  const buttons = document.querySelectorAll('button, div, span');
                  buttons.forEach(btn => {
                    // Be very specific - only remove if it contains "Built with v0" or similar
                    if (btn.textContent && 
                        (btn.textContent.trim() === 'Built with v0' || 
                         btn.textContent.trim() === 'Built with' ||
                         btn.textContent.trim() === 'Powered by v0' ||
                         (btn.textContent.includes('Built with') && btn.textContent.includes('v0')))) {
                      // Extra check - don't remove if it's part of our PWA prompt
                      if (!btn.closest('[class*="pwa"]') && 
                          !btn.closest('[data-pwa]') && 
                          !btn.textContent.includes('Install') &&
                          !btn.textContent.includes('Later')) {
                        btn.remove();
                      }
                    }
                  });
                  
                } catch (error) {
                  console.log('Error removing v0 attribution:', error);
                }
              }
              
              // Run with delays to avoid interfering with PWA initialization
              setTimeout(removeV0Attribution, 1000);
              setTimeout(removeV0Attribution, 3000);
              setTimeout(removeV0Attribution, 6000); // After PWA prompt should show
              
              // Use MutationObserver but be more careful
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.id && node.id.includes('v0-built-with-button')) {
                      // Only remove if it's definitely a v0 attribution
                      if (node.textContent && (node.textContent.includes('Built with') || node.textContent.includes('v0'))) {
                        node.remove();
                      }
                    }
                  });
                });
              });
              
              // Start observing after a delay to let PWA components initialize
              setTimeout(() => {
                if (document.body) {
                  observer.observe(document.body, { childList: true, subtree: true });
                }
              }, 2000);

              // NEW PWA INSTALL PROMPT - SIMPLE VERSION
              let deferredPrompt;
              let pwaPromptShown = false;
              
              // Check if PWA was already dismissed or installed
              function checkPWAState() {
                const dismissed = localStorage.getItem('pwa-dismissed');
                const installed = localStorage.getItem('pwa-installed');
                const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
                const isIOSStandalone = window.navigator.standalone === true;
                
                return dismissed === 'true' || installed === 'true' || isStandalone || isIOSStandalone;
              }
              
              // Create and show PWA install banner
              function showPWAPrompt() {
                if (pwaPromptShown || checkPWAState()) return;
                
                console.log('[PWA] Showing install prompt');
                pwaPromptShown = true;
                
                const banner = document.createElement('div');
                banner.id = 'pwa-install-banner';
                banner.innerHTML = \`
                  <div style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
                    padding: 16px;
                    z-index: 9999;
                    transform: translateY(100%);
                    transition: transform 0.3s ease-in-out;
                  ">
                    <div style="
                      max-width: 1200px;
                      margin: 0 auto;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    ">
                      <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="font-size: 24px;">📱</div>
                        <div>
                          <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Install LCA Platform</div>
                          <div style="font-size: 14px; color: #6b7280;">Get offline access and faster loading times</div>
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <button id="pwa-install-btn" style="
                          background: #059669;
                          color: white;
                          padding: 8px 16px;
                          border-radius: 6px;
                          border: none;
                          font-weight: 500;
                          cursor: pointer;
                          font-size: 14px;
                        ">Install</button>
                        <button id="pwa-later-btn" style="
                          background: transparent;
                          color: #374151;
                          padding: 8px 16px;
                          border-radius: 6px;
                          border: 1px solid #d1d5db;
                          font-weight: 500;
                          cursor: pointer;
                          font-size: 14px;
                        ">Later</button>
                        <button id="pwa-close-btn" style="
                          background: none;
                          border: none;
                          font-size: 20px;
                          color: #9ca3af;
                          cursor: pointer;
                          padding: 4px;
                        ">×</button>
                      </div>
                    </div>
                  </div>
                \`;
                
                document.body.appendChild(banner);
                
                // Animate in
                setTimeout(() => {
                  banner.firstElementChild.style.transform = 'translateY(0)';
                }, 100);
                
                // Add event listeners
                document.getElementById('pwa-install-btn').onclick = async function() {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      localStorage.setItem('pwa-installed', 'true');
                    } else {
                      localStorage.setItem('pwa-dismissed', 'true');
                    }
                    deferredPrompt = null;
                  } else {
                    alert('To install:\\n1. Open browser menu\\n2. Select "Add to Home Screen"\\n3. Follow prompts');
                    localStorage.setItem('pwa-installed', 'true');
                  }
                  hidePWAPrompt();
                };
                
                document.getElementById('pwa-later-btn').onclick = function() {
                  localStorage.setItem('pwa-dismissed', 'true');
                  hidePWAPrompt();
                };
                
                document.getElementById('pwa-close-btn').onclick = function() {
                  localStorage.setItem('pwa-dismissed', 'true');
                  hidePWAPrompt();
                };
              }
              
              function hidePWAPrompt() {
                const banner = document.getElementById('pwa-install-banner');
                if (banner) {
                  banner.firstElementChild.style.transform = 'translateY(100%)';
                  setTimeout(() => banner.remove(), 300);
                }
              }
              
              // Listen for beforeinstallprompt event
              window.addEventListener('beforeinstallprompt', function(e) {
                console.log('[PWA] beforeinstallprompt event fired');
                e.preventDefault();
                deferredPrompt = e;
              });
              
              // Show PWA prompt after 5 seconds
              setTimeout(() => {
                console.log('[PWA] 5 seconds passed, checking if should show prompt');
                if (!checkPWAState()) {
                  showPWAPrompt();
                }
              }, 5000);
            `,
          }}
        />
      </body>
    </html>
  )
}
