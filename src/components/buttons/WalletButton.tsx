import { useContext } from 'react';

import { JobsContext } from '../../lib/JobsContext';

export default function WalletButton() {
  const { connectWallet } = useContext(JobsContext);
  return (
    <button
      onClick={connectWallet}
      className='inline-flex justify-center items-center px-4 py-2 ml-8 w-full text-base font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700'
    ></button>
  );
}
