export async function fetchTaxCalculation(
  endpoint: string,
  requestBody: Record<string, string | number>
): Promise<Response> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch tax calculation' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function getCurrentTaxYear(): string {
  return new Date().getFullYear().toString();
}
