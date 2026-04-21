import React from 'react';
import StatusCard from '../StatusCard';
import ResponseLayout from './ResponseLayout';
import { RequestDetails } from '../../types';

const STATUS_CARDS = ['live', 'preview', 'code', 'edit', 'job'];

const StatusResponseDisplay: React.FC<{
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
      {Object.entries(data).map(([key, value]) => {
        if (
          typeof value === 'object' &&
          value !== null &&
          STATUS_CARDS.includes(key) &&
          Object.keys(value as object).length > 0
        ) {
          const cardData = value as Record<string, any>;
          return (
            <StatusCard
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              status={cardData.status ? cardData.status : responseStatus}
              data={cardData}
            />
          );
        }
        return null;
      })}
    </ResponseLayout>
  );
};

export default StatusResponseDisplay;
