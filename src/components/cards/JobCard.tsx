import Link from 'next/link';

export default function JobCard(props: JobCardProps) {
  return (
    <div>
      <Link href={`/jobs/${props.tokenId}`}>
        <a>
          <div className='p-4 hover:bg-gray-50'>
            <div className='py-2'>
              <h1 className='text-lg'>{props.label}</h1>
            </div>
            <div className='flex space-x-4 text-sm'>
              Signing Price: {props.signingPrice} ETH
            </div>
            <div className='word-break flex-wrap py-2'>{props.description}</div>
            <div className='flex space-x-4 text-sm'>
              TokenURL: {props.ipfsUrl}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

type JobCardProps = {
  label: string;
  description: string;
  ipfsUrl: string;
  tokenId: string;
  signingPrice: string;
};
