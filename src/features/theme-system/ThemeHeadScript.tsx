export default function ThemeHeadScript() {
  const code = `
    (function() {
      try {
        var key = 'cseel_global_theme_config';
        var stored = localStorage.getItem(key);
        if (stored) {
          var theme = JSON.parse(stored);
          if (theme && typeof theme === 'object') {
            var root = document.documentElement;
            if (theme.primaryColor) root.style.setProperty('--brand-primary', theme.primaryColor);
            if (theme.primaryHoverColor) root.style.setProperty('--brand-primary-hover', theme.primaryHoverColor);
            if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
            if (theme.secondaryBgColor) root.style.setProperty('--brand-secondary-bg', theme.secondaryBgColor);
            if (theme.secondaryTextColor) root.style.setProperty('--brand-secondary-text', theme.secondaryTextColor);
            if (theme.secondaryBorderColor) root.style.setProperty('--brand-secondary-border', theme.secondaryBorderColor);
            
            var rad = theme.buttonVariant === 'google' ? '9999px' : (theme.buttonVariant === 'cseel' ? '12px' : (theme.buttonRadius || '12px'));
            root.style.setProperty('--btn-radius', rad);
            root.setAttribute('data-button-style', theme.buttonVariant || 'cseel');
            
            if (theme.buttonShadow === 'material') {
              root.style.setProperty('--btn-shadow', '0 1px 3px rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)');
            } else if (theme.buttonShadow === 'none') {
              root.style.setProperty('--btn-shadow', 'none');
            } else {
              root.style.setProperty('--btn-shadow', '0 4px 14px rgba(0, 111, 204, 0.35)');
            }

            if (theme.cardRadius) root.style.setProperty('--card-radius', theme.cardRadius);
            
            if (theme.customCssOverrides) {
              var s = document.createElement('style');
              s.id = 'cseel-custom-theme-style';
              s.textContent = theme.customCssOverrides;
              document.head.appendChild(s);
            }
          }
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
