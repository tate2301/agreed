/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import { ShieldCheckIcon, XIcon } from '@heroicons/react/outline';
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from '@heroicons/react/solid';
import { Fragment, useState } from 'react';

const product = {
  name: 'Everyday Ruck Snack',
  price: '$220',
  rating: 3.9,
  href: '#',
  imageSrc:
    'https://tailwindui.com/img/ecommerce-images/product-quick-preview-03-detail.jpg',
  imageAlt:
    'Interior of light green canvas bag with padded laptop sleeve and internal organization pouch.',
  sizes: [
    { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
    { name: '20L', description: 'Enough room for a serious amount of snacks.' },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PreviewJob() {
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='overflow-y-auto fixed inset-0 z-10'
        onClose={setOpen}
      >
        <div
          className='flex min-h-screen text-center md:block md:px-2 lg:px-4'
          style={{ fontSize: 0 }}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden md:inline-block md:h-screen md:align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 md:translate-y-0 md:scale-95'
            enterTo='opacity-100 translate-y-0 md:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 md:scale-100'
            leaveTo='opacity-0 translate-y-4 md:translate-y-0 md:scale-95'
          >
            <div className='flex w-full text-base text-left transition transform md:inline-block md:px-4 md:my-8 md:max-w-2xl md:align-middle lg:max-w-4xl'>
              <div className='flex overflow-hidden relative items-center px-4 pt-14 pb-8 w-full bg-white shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8'>
                <button
                  type='button'
                  className='absolute top-4 right-4 text-gray-400 sm:right-6 sm:top-8 md:top-6 md:right-6 lg:top-8 lg:right-8 hover:text-gray-500'
                  onClick={() => setOpen(false)}
                >
                  <span className='sr-only'>Close</span>
                  <XIcon className='w-6 h-6' aria-hidden='true' />
                </button>

                <div className='grid grid-cols-1 gap-x-6 gap-y-8 items-start w-full sm:grid-cols-12 lg:gap-x-8'>
                  <div className='sm:col-span-4 lg:col-span-5'>
                    <div className='aspect-h-1 aspect-w-1 overflow-hidden bg-gray-100 rounded-lg'></div>
                    <p className='absolute top-4 left-4 text-center sm:static sm:mt-6'>
                      <a
                        href={product.href}
                        className='font-medium text-indigo-600 hover:text-indigo-500'
                      >
                        View full details
                      </a>
                    </p>
                  </div>
                  <div className='sm:col-span-8 lg:col-span-7'>
                    <h2 className='text-2xl font-extrabold text-gray-900 sm:pr-12'>
                      {product.name}
                    </h2>

                    <section
                      aria-labelledby='information-heading'
                      className='mt-4'
                    >
                      <h3 id='information-heading' className='sr-only'>
                        Product information
                      </h3>

                      <div className='flex items-center'>
                        <p className='text-lg text-gray-900 sm:text-xl'>
                          {product.price}
                        </p>

                        <div className='pl-4 ml-4 border-l border-gray-300'>
                          <h4 className='sr-only'>Reviews</h4>
                          <div className='flex items-center'>
                            <div className='flex items-center'>
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    product.rating > rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300',
                                    'flex-shrink-0 w-5 h-5'
                                  )}
                                  aria-hidden='true'
                                />
                              ))}
                            </div>
                            <p className='sr-only'>
                              {product.rating} out of 5 stars
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center mt-6'>
                        <CheckIcon
                          className='flex-shrink-0 w-5 h-5 text-green-500'
                          aria-hidden='true'
                        />
                        <p className='ml-2 font-medium text-gray-500'>
                          In stock and ready to ship
                        </p>
                      </div>
                    </section>

                    <section aria-labelledby='options-heading' className='mt-6'>
                      <h3 id='options-heading' className='sr-only'>
                        Product options
                      </h3>

                      <form>
                        <div className='sm:flex sm:justify-between'>
                          {/* Size selector */}
                          <RadioGroup
                            value={selectedSize}
                            onChange={setSelectedSize}
                          >
                            <RadioGroup.Label className='block text-sm font-medium text-gray-700'>
                              Size
                            </RadioGroup.Label>
                            <div className='grid grid-cols-1 gap-4 mt-1 sm:grid-cols-2'>
                              {product.sizes.map((size) => (
                                <RadioGroup.Option
                                  as='div'
                                  key={size.name}
                                  value={size}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'ring-2 ring-indigo-500' : '',
                                      'block relative p-4 rounded-lg border border-gray-300 cursor-pointer focus:outline-none'
                                    )
                                  }
                                >
                                  {({ active, checked }) => (
                                    <>
                                      <RadioGroup.Label
                                        as='p'
                                        className='text-base font-medium text-gray-900'
                                      >
                                        {size.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as='p'
                                        className='mt-1 text-sm text-gray-500'
                                      >
                                        {size.description}
                                      </RadioGroup.Description>
                                      <div
                                        className={classNames(
                                          active ? 'border' : 'border-2',
                                          checked
                                            ? 'border-indigo-500'
                                            : 'border-transparent',
                                          'absolute -inset-px rounded-lg pointer-events-none'
                                        )}
                                        aria-hidden='true'
                                      />
                                    </>
                                  )}
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                        <div className='flex mt-4'>
                          <a
                            href='#'
                            className='group flex text-sm text-gray-500 hover:text-gray-700'
                          >
                            <span>What size should I buy?</span>
                            <QuestionMarkCircleIcon
                              className='flex-shrink-0 ml-2 w-5 h-5 text-gray-400 group-hover:text-gray-500'
                              aria-hidden='true'
                            />
                          </a>
                        </div>
                        <div className='mt-6'>
                          <button
                            type='submit'
                            className='flex justify-center items-center px-8 py-3 w-full text-base font-medium text-white bg-indigo-600 rounded-md border border-transparent hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none'
                          >
                            Add to bag
                          </button>
                        </div>
                        <div className='mt-6 text-center'>
                          <a
                            href='#'
                            className='group inline-flex text-base font-medium'
                          >
                            <ShieldCheckIcon
                              className='flex-shrink-0 mr-2 w-6 h-6 text-gray-400 group-hover:text-gray-500'
                              aria-hidden='true'
                            />
                            <span className='text-gray-500 group-hover:text-gray-700'>
                              Lifetime Guarantee
                            </span>
                          </a>
                        </div>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
