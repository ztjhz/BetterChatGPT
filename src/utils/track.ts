import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import ReactGA from "react-ga4";
import * as amplitude from '@amplitude/analytics-browser';

amplitude.init('ef9fe1ff01e1a23eda0f161527fa783');
export const trackingToolsInit = () => {
  Sentry.init({
    dsn: 'https://d9452a5428a248c3ad894113e05c8508@o4505355934892032.ingest.sentry.io/4505356060721152',
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/0xfaq\.ai/],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate:  process.env.VITE_SENTRY_ENV === 'development' ? 1.0 : 0.6, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    environment: process.env.VITE_SENTRY_ENV,
  });

  mixpanel.init('659a614d94fd41baff409729aeef12b7', {
    debug: process.env.VITE_SENTRY_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  });

  ReactGA.initialize("G-JMGPY90EF8");
  ReactGA.gtag('config', 'AW-11282287324');
}

export const track = (event: string, properties?: any) => {
  try{
    mixpanel.track(event, properties);
    ReactGA.event({
      category: 'User',
      action: event,
      label: properties?.value
    });
    amplitude.track(event, properties);
  }catch(e){
    console.log(e)
  }
}

export const setTrackingUser = (id: string) => {
  mixpanel.identify(id);
  ReactGA.gtag('config', "G-JMGPY90EF8", {
    'user_id': id
  })
  amplitude.setUserId(id);
}


export const conversionWeb3Tracking = () => {
  try{
    //@ts-ignore
    window?.gtag('event', 'conversion', {
      send_to: 'AW-11282287324/5gN0CPL0vs0YENyV6IMq',
    });
    //@ts-ignore
    window?.twq('event', 'tw-ofs73-ofs7e')

    //@ts-ignore
    window?._VTM.push({
      action_type: 'web3_login',
      active_id: '24481',
      action_param: {}
    })
  }catch(e){
    console.log(e)
  }
}

export const conversionWeb2Tracking = () => {
  try{
    //@ts-ignore
    window?.gtag('event', 'conversion', {
      send_to: 'AW-11282287324/5gN0CPL0vs0YENyV6IMq',
    });
    //@ts-ignore
    window?.twq('event', 'tw-ofs73-ofs7d')

    //@ts-ignore
    window?._VTM.push({
      action_type: 'web2_login',
      active_id: '24481',
      action_param: {}
    })
  }catch(e){
    console.log(e)
  }
}