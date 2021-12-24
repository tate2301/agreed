import * as React from 'react';

import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='bg-white'>
      <Header />
      <main className='container px-4 py-36 mx-auto md:px-0 md:py-24'>
        {children}
      </main>
    </div>
  );
}
