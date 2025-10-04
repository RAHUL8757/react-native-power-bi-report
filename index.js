import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import WebViewComponent from './webView';

const PowerBIEmbed = ({
  accessToken,
  embedUrl,
  id,
  language,
  embedConfiguration,
  logoUrl,
  enableScroll = false,
  height
}) => {
  const [configuration, setConfiguration] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Memoize the merge function to avoid recreating it on every render
  const merge = useMemo(() => {
    return (target, source) => {
      for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && !Array.isArray(source[key]) && target[key]) {
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };
  }, []);

  // Memoize configuration generation
  const generatedConfig = useMemo(() => {
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
          displayOption: 1, // FitToWidth display to prevent stretching
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
  }, [accessToken, embedUrl, id, language, embedConfiguration, merge]);

  useEffect(() => {
    setConfiguration(generatedConfig);
  }, [generatedConfig]);

  const getTemplate = useMemo(() => (config) => {
    return (`<!doctype html>
      <html>
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <script src="https://cdn.jsdelivr.net/npm/powerbi-client@latest/dist/powerbi.min.js"></script>
          <style>
              html, body, #reportContainer {
                  width: 100%;
                  height: ${height ? `${height}px` : "100%"};
                  margin: 0;
                  padding: 0;
                  overflow: ${enableScroll ? 'auto' : 'hidden'};
                  background-color: #f5f5f5;
                  touch-action: ${enableScroll ? 'auto' : 'none'};
              }
              iframe {
                  border: 0;
                  width: 100%;
                  height: 100%;
              }
              .logo, 
              .powerbi-header, 
              .powerbi-footer, 
              .powerbi-loading {
                  display: none !important;
              }
              .custom-logo {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 150px; 
                  background-color: #fff; 
                  z-index: 1000;
                  padding: 10px; 
                  border-radius: 10px; 
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

                report.on("loaded", function() {
                  var customLogo = document.getElementById('customLogo');
                  if (customLogo) {
                    customLogo.style.display = 'none';
                  }
                  
                  report.getPages().then(function(pages) {
                    if (pages.length > 0) {
                      pages[0].setBackground({ type: 'transparent' }).then(function() {
                        var iframe = reportContainer.getElementsByTagName('iframe')[0];
                        if (iframe) {
                          try {
                            var iframeDoc = iframe.contentWindow.document || iframe.contentDocument;
                            if (iframeDoc && iframeDoc.body) {
                              iframeDoc.body.style.backgroundColor = '#f5f5f5';
                            }
                          } catch (e) {
                            // Cross-origin access might be blocked
                            console.warn('Could not access iframe document:', e);
                          }
                        }
                      }).catch(function(err) {
                        console.warn('Could not set background:', err);
                      });
                    }
                  }).catch(function(err) {
                    console.warn('Could not get pages:', err);
                  });
                });

                report.on("error", function(event) {
                  console.error('Power BI Report Error:', event.detail);
                });
              } else {
                setTimeout(embedReport, 500);
              }
            }

            embedReport();
          </script>
      </body>
      </html>`);
  }, [enableScroll, height, logoUrl]);

  const htmlTemplate = useMemo(() => getTemplate(configuration), [getTemplate, configuration]);

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {isVisible && (
        <WebViewComponent
          originWhitelist={['*']}
          source={{ html: htmlTemplate }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={enableScroll} // Control WebView scrolling based on prop
          style={{ flex: 1 }}
          startInLoadingState={true}
          onMessage={(event) => {
            // Handle messages from the webview if needed
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

PowerBIEmbed.propTypes = {
  accessToken: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  language: PropTypes.string,
  embedConfiguration: PropTypes.object,
  logoUrl: PropTypes.string,
  enableScroll: PropTypes.bool,
  height: PropTypes.number,
};

PowerBIEmbed.defaultProps = {
  enableScroll: false,
  language: undefined,
  embedConfiguration: undefined,
  logoUrl: undefined,
  height: undefined,
};

export default React.memo(PowerBIEmbed);
