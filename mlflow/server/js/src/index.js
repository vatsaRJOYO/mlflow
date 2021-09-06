import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { IntlProvider } from 'react-intl';
import './index.css';
import App from './experiment-tracking/components/App';
import { setupAjaxHeaders } from './setupAjaxHeaders';
import { Provider } from 'react-redux';
import store from './store';
import { injectGlobal } from 'emotion';
import { accessibilityOverrides } from './common/styles/accessibility-overrides';
import { I18nUtils } from './i18n/I18nUtils';
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.REACT_APP_AWS_DEFAULT_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

setupAjaxHeaders();

I18nUtils.initI18n().then(() => {
  const { locale, messages } = I18nUtils.getIntlProviderParams();
  const root = (
    <IntlProvider locale={locale} messages={messages}>
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>
  );
  ReactDOM.render(root, document.getElementById('root'));
  injectGlobal({ ...accessibilityOverrides });
});
window.jQuery = $; // selenium tests need window.jQuery to exist

// Disable service worker registration as it adds unnecessary debugging complexity
// (see https://github.com/facebook/create-react-app/issues/2398) for relatively small gain
// (caching of static assets, as described in
// https://create-react-app.dev/docs/making-a-progressive-web-app/, which should also be handled
// by most browsers)
// registerServiceWorker();
