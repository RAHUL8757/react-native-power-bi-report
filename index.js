import React, { useState, useEffect, useMemo } from 'react';
import { WebView } from 'react-native-webview';

const PowerBIEmbed = ({ accessToken, embedUrl, id, language, embedConfiguration, logoUrl }) => {
  const [configuration, setConfiguration] = useState('');

  useEffect(() => {
    const generateConfiguration = () => {
      let config = {
        type: 'report',
        tokenType: 1, // Aad token
        accessToken,
        embedUrl,
        id,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
          layoutType: 2, // Mobile layout
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: false },
          },
          customLayout: {
            displayOption: 1, // FitToWidth display
          },
        },
      };

      if (language) {
        config.settings.localeSettings = {
          language,
          formatLocale: language,
        };
      }

      if (embedConfiguration) {
        config = merge(config, embedConfiguration);
      }

      return JSON.stringify(config);
    };

    const merge = (target, source) => {
      for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && target[key]) {
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    setConfiguration(generateConfiguration());
  }, [accessToken, embedUrl, id, language, embedConfiguration]);

  // Generate the HTML template with custom logo and hiding Power BI elements
  const getTemplate = useMemo(() => (config) => (`<!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <script src="https://cdn.jsdelivr.net/npm/powerbi-client@latest/dist/powerbi.min.js"></script>
        <style>
            html, body, #reportContainer {
                width: 100%;
                height: 100%;
                margin: 0;
                background-color: transparent;
                overflow: hidden;
                position: relative;
            }
            iframe {
                border: 0;
            }
            /* Aggressively hide Power BI logo and branding */
            .logo, 
            .powerbi-header, 
            .powerbi-footer, 
            .powerbi-loading {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                pointer-events: none !important;
            }
            /* Custom logo styling with white background */
            .custom-logo {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 150px; /* Adjust size as needed */
                background-color: #fff; /* White background */
                z-index: 1000;
                padding: 10px; /* Optional padding for logo */
                border-radius: 10px; /* Optional rounded corners */
            }
        </style>
    </head>
    <body>
        <div id="reportContainer"></div>
        ${logoUrl ? `<img src="${logoUrl}" class="custom-logo" id="customLogo" alt="Custom Logo" />` : ''}
        <script>
          var config = ${config};
          var reportContainer = document.getElementById('reportContainer');
          var report;
          
          function embedReport() {
            if (window['powerbi']) {
              var powerbi = window['powerbi'];
              report = powerbi.embed(reportContainer, config);

              // Hide custom logo when report is fully loaded
              report.on("loaded", function() {
                var customLogo = document.getElementById('customLogo');
                if (customLogo) {
                  customLogo.style.display = 'none';
                }

                var iframe = reportContainer.getElementsByTagName('iframe')[0];
                var iframeDocument = iframe.contentWindow.document;
                
                // Ensure any remaining Power BI logos or headers are hidden
                var powerbiLogo = iframeDocument.querySelector('.logo');
                var powerbiHeader = iframeDocument.querySelector('.powerbi-header');
                var powerbiFooter = iframeDocument.querySelector('.powerbi-footer');
                
                if (powerbiLogo) powerbiLogo.style.display = 'none';
                if (powerbiHeader) powerbiHeader.style.display = 'none';
                if (powerbiFooter) powerbiFooter.style.display = 'none';
              });
            } else {
              setTimeout(embedReport, 500); // Retry after 500ms if powerbi is not yet available
            }
          }

          embedReport();
        </script>
    </body>
    </html>`
  ), []);

  const htmlTemplate = useMemo(() => getTemplate(configuration), [getTemplate, configuration]);

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlTemplate }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={{ flex: 1 }}
      startInLoadingState={true}
    />
  );
};

export default React.memo(PowerBIEmbed);
