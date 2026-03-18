import { type LoaderFunctionArgs } from 'react-router';
import { ZRH_TAX_BASE_URL } from '#app/routes/node.v1.api/zh-tax/income';
import { fetchTaxCalculation, createErrorResponse, getCurrentTaxYear } from './utils';

const FEDERAL_ENDPOINT = `${ZRH_TAX_BASE_URL}/FEDERAL/calculate`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse query parameters
  const taxableIncome = searchParams.get('taxableIncome');
  const taxYear = searchParams.get('taxYear') || getCurrentTaxYear();

  // Validate required parameter
  if (!taxableIncome) {
    return createErrorResponse('taxableIncome is required');
  }

  // Build request body
  const requestBody: Record<string, string | number> = {
    taxYear,
    taxScale: 'SINGLE',
    taxableIncome: Number(taxableIncome),
  };

  const response = await fetchTaxCalculation(FEDERAL_ENDPOINT, requestBody);

  // If response is already an error response, return it
  if (!response.ok) {
    return response;
  }

  try {
    const data = await response.json();
    const taxValue = data.totalAfterChildrenDeduction?.value;

    if (typeof taxValue !== 'number' || isNaN(taxValue)) {
      throw new Error('Invalid tax value received from API');
    }

    return Math.round(taxValue);
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
