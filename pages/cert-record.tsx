"use client"

import { useEffect, useState } from 'react';
import { fetchCertRecord, Record } from '@/app/lib/airtable';

const sharedFields = [
  'App Name',
  'Application Icon',
  'Contact Name',
  'Email',
  "Dev App's Client ID",
  'Redirect URI',
  'Target Go-Live',
  'Checklist/Requirements?',
  'Checklist requirement concerns',
  'API Version(s) used',
  'Required Fields',
  'missing required fields?',
  'Clever ID as primary identifier?',
  'Loading Behavior',
  'Error Handling',
  'Hybrid logins',
  'LIWC?',
  'Environment?',
  'Environment description',
  'match-creds',
  'Override previous session',
  'SSO Supported User Types',
  'Test Users',
];

const libraryOnlyFields = [
  'AP DSA Received?',
  'Free Trial/Demo',
  'Subscription/Sales model',
  'prov teacher on login',
  'Student experience?',
  'Auto provision students',
  'library classes?',
  'library section custom?',
  'How sync?',
  'Limits?',
  'integration limits more',
  'Universal DSA submitted?',
  'Marketing Collateral?',
  'Sync sections at first login',
  'Multi-class teacher',
  'Sync button',
];

type FieldValue = string | number | boolean | { url?: string; [key: string]: any };

export default function CertRecord() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<Record['fields'] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setClientId(searchParams.get('clientId'));
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      const fetchRecord = async () => {
        const certRecord = await fetchCertRecord(clientId);
        setRecordData(certRecord);
      };

      fetchRecord();
    }
  }, [clientId]);

  const integrationType = recordData?.['Integration Type(s)'];
  let fieldsToDisplay: string[] = sharedFields;

  if (integrationType) {
    if (typeof integrationType === 'string' && integrationType.includes('Library')) {
      fieldsToDisplay = [...sharedFields, ...libraryOnlyFields];
    } else if (Array.isArray(integrationType) && integrationType.some((type) => type.includes('Library'))) {
      fieldsToDisplay = [...sharedFields, ...libraryOnlyFields];
    }
  }

  const renderFieldValue = (field: string) => {
    const value = recordData?.[field];

    // If value is an object, check for the `url` property
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const fieldValue = value as { url?: string };

      if (fieldValue.url) {
        return <img src={fieldValue.url} alt={field} className="w-24 h-24 object-cover" />;
      }
      // Handle any other objects as needed
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }

    // For non-object values, just return them as is
    return value || 'N/A';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cert Record for Client ID: {clientId}</h1>
      {recordData ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-lg font-semibold">Field</th>
              <th className="px-4 py-2 border-b text-left text-lg font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {fieldsToDisplay.map((field) => (
              <tr key={field}>
                <td className="px-4 py-2 border-b text-gray-800">{field}</td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {renderFieldValue(field)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No data found for client ID {clientId}.</p>
      )}
    </div>
  );
}
