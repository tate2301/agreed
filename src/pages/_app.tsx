import { AppProps } from 'next/app';

import '../styles/globals.css';

import { JobsContextProvider } from '../lib/JobsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JobsContextProvider>
      <Component {...pageProps} />
    </JobsContextProvider>
  );
}

export default MyApp;
