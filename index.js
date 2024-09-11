
import React, { Component } from 'react';
import WebView from './webView';

class PowerBIEmbed extends Component {
  constructor(props) {
    super(props);
    this.configuration = this.setConfiguration(props);
  }

  setConfiguration = (props) => {
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
      embedConfiguration = this.merge(embedConfiguration, props.embedConfiguration);
    }

    return JSON.stringify(embedConfiguration);
  }

  getTemplate = (configuration) => (`<!doctype html>
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
            }
            iframe {
                border: 0px;
            }
        </style>
    </head>
    <body>
        <div id="reportContainer"></div>
        <script>
        var models = window['powerbi-client'].models;
        var config = ${configuration};
        var reportContainer = document.getElementById('reportContainer');
        var report = powerbi.embed(reportContainer, config);
        </script>
    </body>
    </html>`
  );

  merge = (target, source) => {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && target[key]) {
        this.merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  render() {
    const html = this.getTemplate(this.configuration);
    return (
      <WebView 
      source={{ html }}
      />
    );
  }
}

export default PowerBIEmbed;
