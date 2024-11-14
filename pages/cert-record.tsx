"use client";

import { useEffect, useState } from 'react';
import { fetchCertRecord, Record } from '@/app/lib/airtable';
import Image from 'next/image';

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

export default function CertRecord() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<Record['fields'] | null>(null);

  useEffect(() => {
    // Only run this on the client-side (browser)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setClientId(searchParams.get('clientId') || null);
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
  
    // Debugging: Log the value for inspection
    console.log(`Rendering field: ${field}`, value);
  
    // Handle the "Application Icon" field (or other fields that might return an array of image objects)
    if (field === 'Application Icon' && Array.isArray(value) && value.length > 0) {
      const image = value[0]; // Access the first item in the array
      // Ensure the object has a 'url' field and render the image
      if (image && image.url) {
        return <Image src={image.url} alt={field} width={100} height={100} />;
      }
    }
  
    // Handle generic image objects
    if (value && typeof value === 'object' && 'url' in value) {
      return <Image src={value.url} alt={field} width={100} height={100} />;
    }
  
    // If value is an array, display each item as a list
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  
    // If the value is an object, display a stringified version
    if (typeof value === 'object') {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
  
    // Render the value or 'N/A' if it's undefined or null
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
