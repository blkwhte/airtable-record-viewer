import Airtable from 'airtable';

export interface Record {
  id: string;
  fields: {
    [key: string]: string | number | boolean | undefined;
  };
}

export interface AirtableResponse {
  records: Record[];
}

// Airtable configuration
const BASE_ID = process.env.NEXT_PUBLIC_BASE_ID || '';
const TABLE_NAME = process.env.NEXT_PUBLIC_TABLE_NAME || '';
const PERSONAL_ACCESS_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || '';

const airtableBase = new Airtable({ apiKey: PERSONAL_ACCESS_TOKEN }).base(BASE_ID);

export async function fetchCertRecord(clientId: string): Promise<Record['fields'] | null> {
  try {
    // Query Airtable with filter formula
    console.log(clientId);
    const records = await airtableBase(TABLE_NAME)
      .select({
        filterByFormula: `{Dev app client id} = '${clientId}'`,
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    console.log(records);

    return records[0].fields as Record['fields'];
  } catch (error) {
    console.error(error);
    return null;
  }
}
