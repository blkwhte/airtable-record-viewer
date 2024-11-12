"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCertRecord } from './lib/airtable';
import { Button } from './ui/buttons';
import { inter } from './ui/fonts';

export default function Home() {
  const [clientId, setClientId] = useState('');
  const router = useRouter();

  console.log("Client ID:", clientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clientId) {
      try {
        const certRecord = await fetchCertRecord(clientId);
        console.log("Airtable Record:", certRecord);

        if (certRecord) {
          // Directly call router.push() when certRecord exists
          router.push(`/cert-record?clientId=${clientId}`);
        } else {
          alert("No matching records found.");
        }
      } catch (error) {
        console.error("Error fetching Airtable data:", error);
        alert("Failed to fetch data from Airtable.");
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className={`${inter.className} text-4xl text-gray-800 md:text-3xl md:leading-normal`}>
        Enter Client ID
      </h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <label htmlFor="client-id" className="block text-sm text-gray-700">
          Client ID
        </label>
        <input
          id="client-id"
          type="text"
          className="mt-2 p-2 border border-gray-300 rounded-md text-black"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
