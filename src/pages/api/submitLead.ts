export const prerender = false;
// src/pages/api/submitLead.ts
import type { APIRoute } from 'astro';
import fetch from 'node-fetch';

const PIPEDRIVE_API_TOKEN = import.meta.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_BASE_URL = 'https://onetier.pipedrive.com/api/v1';
const PIPEDRIVE_BASE_URL_V2 = 'https://onetier.pipedrive.com/api/v2';


// Handle GET requests to silence the Astro build warning
export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({ message: "This API only supports POST requests." }), {
        status: 405, // "Method Not Allowed"
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
    });
};

async function searchOrganization(name: string) {
    const response = await fetch(`${PIPEDRIVE_BASE_URL_V2}/organizations/search?term=${encodeURIComponent(name)}&exact_match=true&api_token=${PIPEDRIVE_API_TOKEN}`);
    if (!response.ok) {
        throw new Error('Failed to search organization');
    }
    const result: any = await response.json();
    return result.data?.items[0]?.item || null;
}

async function createOrganization(name: string) {
    const response = await fetch(`${PIPEDRIVE_BASE_URL}/organizations?api_token=${PIPEDRIVE_API_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error('Failed to create organization');
    }
    const result: any = await response.json();
    return result.data;
}

async function createPerson(person: any) {
    const response = await fetch(`${PIPEDRIVE_BASE_URL}/persons?api_token=${PIPEDRIVE_API_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
    });
    if (!response.ok) {
        throw new Error('Failed to create person');
    }
    const result: any = await response.json();
    return result.data;
}

async function createLead(data: any) {
    const response = await fetch(`${PIPEDRIVE_BASE_URL}/leads?api_token=${PIPEDRIVE_API_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to create lead');
    }
    const result: any = await response.json();
    return result.data;
}

async function createNote(leadId: number, content: string) {
    const response = await fetch(`${PIPEDRIVE_BASE_URL}/notes?api_token=${PIPEDRIVE_API_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lead_id: leadId, content }),
    });
    if (!response.ok) {
        throw new Error('Failed to create note');
    }
    const result: any = await response.json();
    return result.data;
}

export const POST: APIRoute = async ({ request }) => {
    console.log('Received request:', request);
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    const { title, organization: orgName, person: personData, message } = await request.json();

    try {
        // Step 1: Search or create the organization
        console.log('Searching for organization:', orgName);
        let organization = await searchOrganization(orgName);
        if (!organization) {
            console.log('Organization not found, creating:', orgName);
            organization = await createOrganization(orgName);
        }

        // Step 2: Create the person
        console.log('Creating person:', personData);
        const person = await createPerson({ ...personData, org_id: organization.id });

        // Step 3: Create the lead
        const lead = await createLead({
            title,
            person_id: person.id,
            organization_id: organization.id,
        });

        // Step 4: Create a note for the lead
        await createNote(lead.id, message);

        return new Response(JSON.stringify({ success: true, data: lead }), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error('Error processing lead creation:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    }
};