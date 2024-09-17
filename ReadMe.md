
# PowerBI Embed for React Native

**react-native-power-bi-report** is a React Native component that allows embedding Power BI reports. It leverages `WebView` on Android and `WKWebView` on iOS to display the reports seamlessly within your app.

## Installation

To install the package, run:

```bash
yarn add react-native-power-bi-report
```

### iOS Dependencies

For iOS, this package depends on [react-native-wkwebview-reborn](https://github.com/CRAlpha/react-native-wkwebview). Please refer to their documentation if you encounter any issues with linking on iOS.

## Usage

First, import the component:

```javascript
import PowerBIEmbed from 'react-native-power-bi-report';
```

To display a report, you need three key parameters: `accessToken`, `embedUrl`, and the `id` of the report. These can be retrieved through the Power BI REST API.

### Basic Example:

```javascript
<PowerBIEmbed
  accessToken="your-access-token"
  embedUrl="https://app.powerbi.com/reportEmbed?reportId=your-report-id&groupId=your-group-id"
  id="your-report-id"
/>
```

### Language Support

You can specify a language for the report by passing a `language` prop:

```javascript
<PowerBIEmbed
  accessToken="your-access-token"
  embedUrl="https://app.powerbi.com/reportEmbed?reportId=your-report-id&groupId=your-group-id"
  id="your-report-id"
  language="en"
  logoUrl="https://example.com/custom-logo.png" // Optional custom logo
/>
```

### Custom Embed Configuration

You can pass a custom configuration object that adheres to the Power BI JavaScript library’s [Embed Configuration](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details) for additional customization.

```javascript
const config = {
  type: 'report',
  tokenType: 1, // Aad token
  accessToken: "your-access-token",
  embedUrl: "https://app.powerbi.com/reportEmbed?reportId=your-report-id&groupId=your-group-id",
  id: "your-report-id",
  settings: {
    filterPaneEnabled: false,
    navContentPaneEnabled: true,
  },
};

<PowerBIEmbed embedConfiguration={config} />
```

### Custom Logo

If you want to display a custom logo while the report is loading, pass a `logoUrl` prop. This will show your logo instead of Power BI’s default loading animation. The logo will automatically disappear when the report is fully loaded.

```javascript
<PowerBIEmbed
  accessToken="your-access-token"
  embedUrl="https://app.powerbi.com/reportEmbed?reportId=your-report-id&groupId=your-group-id"
  id="your-report-id"
  logoUrl="https://example.com/custom-logo.png"
/>
```

## Roadmap

Future updates and enhancements include:
- More layout customization options
- Event communication between Power BI and the React Native component

## Contributing

We welcome contributions! Feel free to open issues and pull requests to enhance this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Rahul Singh**

For any inquiries or support, feel free to contact the author.