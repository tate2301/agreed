/* eslint-disable @next/next/no-img-element */

import { useContext, useState } from 'react';

import CreateListing from '../disclosure/CreateListing';
import { JobsContext } from '../../lib/JobsContext';

/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Platform', href: '/app' },
  { name: 'Marketplace', href: '/jobs' },
  { name: 'Governance', href: '/governance' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const { address, connectWallet } = useContext(JobsContext);
  const truncatedAddress =
    address.substring(0, 7) + '...' + address.substring(address.length - 4);
  return (
    <header className='fixed w-full bg-white shadow-md'>
      <CreateListing open={open} setOpen={setOpen} />
      <nav className='px-4 mx-auto sm:px-6 lg:px-8' aria-label='Top'>
        <div className='flex justify-between items-center py-2 w-full border-b border-orange-500 lg:border-none'>
          <div className='flex items-center'>
            <a href='#'>
              <span className='sr-only'>Workflow</span>
              <img
                className='w-auto h-10'
                src='https://swipe.io/images/logo.svg'
                alt=''
              />
            </a>
            <div className='hidden ml-10 space-x-8 lg:block'>
              {navigation.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='text-base font-medium text-gray-700 hover:text-orange-600'
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className='ml-10 space-x-4'>
            {address && (
              <button
                onClick={() => setOpen(true)}
                className='inline-block px-4 py-2 text-base font-medium text-white bg-orange-600 rounded-md border border-transparent duration-200'
              >
                Create listing
              </button>
            )}
            <button
              onClick={connectWallet}
              className='inline-block px-4 py-2 text-base font-medium text-orange-600 text-orange-600 bg-orange-200 rounded-md border border-transparent duration-200 hover:transition-color hover:text-white hover:bg-orange-600 hover:bg-orange-600'
            >
              {address ? truncatedAddress : 'Connect Wallet'}
            </button>
          </div>
        </div>
        <div className='flex flex-wrap justify-center py-4 space-x-6 lg:hidden'>
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className='text-base font-medium text-gray-700 hover:text-orange-600'
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
