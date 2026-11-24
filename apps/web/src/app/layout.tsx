import './components.css';
import './global.css';

import {Config} from '@smarty-app/core';

import {RootLayoutClient} from './RootLayoutClient';

export const metadata = {
  title: 'App',
  description: 'Account',
};

Config.initialize({
  apiBaseUrl: process.env.NEXT_PUBLIC_DX_API_BASE_URL as string,
});

/**
 * @param props - Component props.
 * @param props.children - Content to be rendered within the layout.
 *
 * @returns A React element.
 */
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-primary">
        <RootLayoutClient>{children}</RootLayoutClient>
        <div id="modal-root" />
      </body>
    </html>
  );
}
