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
const products = [
  {
    id: 1,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  // More products...
];

export default function JobsList() {
  return (
    <div className='bg-white'>
      <div className='px-4 py-16 mx-auto max-w-2xl sm:px-6 sm:py-24 lg:px-8 lg:max-w-7xl'>
        <div className='flex justify-between items-center space-x-4'>
          <h2 className='text-lg font-medium text-gray-900'>
            Customers also viewed
          </h2>
          <a
            href='#'
            className='text-sm font-medium text-indigo-600 whitespace-nowrap hover:text-indigo-500'
          >
            View all<span aria-hidden='true'> &rarr;</span>
          </a>
        </div>
        <div className='grid grid-cols-1 gap-x-8 gap-y-8 mt-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4'>
          {products.map((product) => (
            <div key={product.id} className='group relative'>
              <div className='aspect-h-3 aspect-w-4 overflow-hidden bg-gray-100 rounded-lg'>
                <div
                  className='flex items-end p-4 opacity-0 group-hover:opacity-100'
                  aria-hidden='true'
                >
                  <div className='px-4 py-2 w-full text-sm font-medium text-center text-gray-900 bg-white bg-opacity-75 rounded-md backdrop-filter backdrop-blur'>
                    View Product
                  </div>
                </div>
              </div>
              <div className='flex justify-between items-center mt-4 space-x-8 text-base font-medium text-gray-900'>
                <h3>
                  <a href='#'>
                    <span aria-hidden='true' className='absolute inset-0' />
                    {product.name}
                  </a>
                </h3>
                <p>{product.price}</p>
              </div>
              <p className='mt-1 text-sm text-gray-500'>{product.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
