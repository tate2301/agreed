/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useContext } from 'react';
import { Fragment } from 'react';

import { JobsContext } from '../../lib/JobsContext';

export default function CreateListing({ open, setOpen }) {
  const { listingPrice } = useContext(JobsContext);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='overflow-hidden fixed inset-0'
        onClose={setOpen}
      >
        <div className='overflow-hidden absolute inset-0'>
          <Dialog.Overlay className='absolute inset-0' />

          <div className='flex fixed inset-y-0 right-0 pl-10 max-w-full'>
            <Transition.Child
              as={Fragment}
              enter='transform transition ease-in-out duration-400 sm:duration-500'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-400 sm:duration-500'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
            >
              <div className='w-screen max-w-lg'>
                <div className='flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl'>
                  <div className='flex overflow-y-scroll flex-col flex-1 min-h-0'>
                    <div className=''>
                      <div className='flex justify-between items-start px-4 py-4 bg-orange-600 sm:px-6'>
                        <Dialog.Title className='text-lg font-medium text-white'>
                          Create new listing
                        </Dialog.Title>
                        <div className='flex items-center ml-3 h-7'>
                          <button
                            type='button'
                            className='text-gray-400 bg-white rounded-md hover:text-gray-600 focus:ring-2 focus:ring-orange-600 focus:outline-none'
                            onClick={() => setOpen(false)}
                          >
                            <span className='sr-only'>Close panel</span>
                            <XIcon className='w-6 h-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='relative flex-1 px-4 mt-6 sm:px-6'>
                      <form className='space-y-4'>
                        <div>
                          <label
                            htmlFor='label'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Job title
                          </label>
                          <div className='mt-1'>
                            <input
                              type='text'
                              name='label'
                              id='label'
                              required
                              minLength={3}
                              className='block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-orange-600 focus:ring-orange-600'
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor='description'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Description
                          </label>
                          <div className='mt-1'>
                            <textarea
                              name='description'
                              id='description'
                              required
                              minLength={3}
                              className='block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-orange-600 focus:ring-orange-600'
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor='signing-price'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Signing price
                          </label>
                          <div className='mt-1'>
                            <input
                              type='number'
                              name='signingPrice'
                              id='signing-price'
                              min={0}
                              required
                              className='block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-orange-600 focus:ring-orange-600'
                            />
                          </div>
                        </div>
                        <div>Listing price: {listingPrice}</div>
                      </form>
                    </div>
                  </div>
                  <div className='flex flex-shrink-0 justify-end px-4 py-4'>
                    <button
                      type='button'
                      className='px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:outline-none'
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700 focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:outline-none'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
