

import React, { useState, useEffect, useMemo } from 'react';
import WebView from './webView';  // Ensure the path is correct

const PowerBIEmbed = (props) => {
  const [configuration, setConfiguration] = useState('');

  useEffect(() => {
    const generateConfiguration = () => {
      let embedConfiguration = {
        type: 'report',
        tokenType: 1,
        accessToken: props.accessToken,
        embedUrl: props.embedUrl,
        id: props.id,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
          layoutType: 2,
          panes: {
            filters: {
              visible: false
            },
            pageNavigation: {
              visible: false
            }
          }
        },
      };

      if ('language' in props) {
        embedConfiguration.settings.localeSettings = {
          language: props.language,
          formatLocale: props.language,
        };
      }

      if ('embedConfiguration' in props) {
        embedConfiguration = merge(embedConfiguration, props.embedConfiguration);
      }

      return JSON.stringify(embedConfiguration);
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
  }, [props.accessToken, props.embedUrl, props.id, props.language, props.embedConfiguration]);

  const getTemplate = useMemo(() => (configuration) => (`<!doctype html>
    <html>
    <head>
        <meta charset="utf-8" />
        <script src="https://cdn.jsdelivr.net/npm/powerbi-client@2.8.0/dist/powerbi.min.js"></script>
        <style>
            html,
            body,
            #reportContainer {
                width: 100%;
                height: 100%;
                margin: 0;
                background-color: white;
                -webkit-overflow-scrolling: touch;
                overflow: hidden;
                position: relative; /* Ensure logo positioning */
            }
            iframe {
                border: 0;
            }
            .custom-logo {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 100px; /* Adjust size as needed */
                z-index: 1000; /* Ensure logo is above other elements */
            }
            /* Hide default Power BI elements */
            .powerbi-embed .powerbi-header,
            .powerbi-embed .powerbi-footer,
            .powerbi-embed .powerbi-loading {
                display: none !important;
            }
        </style>
    </head>
    <body>
        <div id="reportContainer">
            <!-- Your logo -->
            <img src="https://filemanager.prod.imperialm.net/filemanager/getFile/MSER_Job_Aid.pdf?filePath=HelmMobileApp/images/Stell_Rewards_Main_logo_FNL.png" class="custom-logo" alt="My Logo" />
        </div>
        <script>
        var models = window['powerbi-client'].models;
        var config = ${configuration};
        var reportContainer = document.getElementById('reportContainer');
        var report = powerbi.embed(reportContainer, config);

        // Optionally handle custom loading logic here
        </script>
    </body>
    </html>`
  ), [configuration]);

  const htmlTemplate = useMemo(() => getTemplate(configuration), [getTemplate, configuration]);

  return (
    <WebView 
      source={{ html: htmlTemplate }}
      // startInLoadingState={true}
      // renderLoading={() => <YourCustomLoader />}
    />
  );
};

export default React.memo(PowerBIEmbed);

