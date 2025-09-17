import React from 'react';
import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import 'antd/dist/reset.css';
import './styles/globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function MyApp({ Component, pageProps }: AppProps): React.JSX.Element {
  return (
    <main className={montserrat.className}>
      <Component {...pageProps} />
    </main>
  );
}