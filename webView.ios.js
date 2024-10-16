import React from 'react';
import { WebView } from 'react-native-webview';

const WebViewComponent = props => (
    <WebView 
    {...props}
    style={{ flex: 1 , backgroundColor: "#f5f5f5"}}
     />
);

export default React.memo(WebViewComponent);