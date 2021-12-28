import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import '../styles/globals.css';

import { JobsContextProvider } from '../lib/JobsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <JobsContextProvider>
        <Component {...pageProps} />
      </JobsContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
