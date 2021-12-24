/* eslint-disable no-console */
import { useContext } from 'react';

import JobCard from '../components/cards/JobCard';
import Layout from '../components/layout/Layout';
import Seo from '../components/Seo';
import { JobsContext } from '../lib/JobsContext';

export default function Jobs() {
  const { unsignedJobs } = useContext(JobsContext);
  console.log({ unsignedJobs });
  return (
    <Layout>
      <Seo title='Jobs Marketplace' />
      <main>
        <div className='mx-auto max-w-6xl bg-white rounded-md border border-gray-200 divide-y'>
          <div className='p-4'>
            <h1 className='py-4 text-2xl'>Latest jobs</h1>
            <div className='flex space-x-4'>
              <a>Most recent</a>
              <a>Most popular</a>
              <a>Most funded</a>
              <a>Signed contracts</a>
            </div>
          </div>
          {unsignedJobs.map((job) => (
            <JobCard key={job.tokenId} {...job} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
