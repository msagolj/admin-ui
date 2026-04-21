import React from 'react';
import StatusCard from '../StatusCard';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

const ResponseDisplay: React.FC<{
  requestDetails: RequestDetails | null;
  responseData: any;
  responseStatus: number;
}> = ({ requestDetails, responseData, responseStatus }) => {
  const data = responseData ?? {};

  return (
    <ResponseLayout
      requestDetails={requestDetails}
      responseData={responseData}
      responseStatus={responseStatus}
    >
      {Object.keys(data).length === 0 ? (
        <StatusCard title="No Content" status={responseStatus} data={{}} />
      ) : (
        <StatusCard title="" status={responseStatus} data={data} />
      )}
    </ResponseLayout>
  );
};

export default ResponseDisplay;
