import { type LoaderFunctionArgs } from 'react-router';
import { fetchTaxCalculation, createErrorResponse, getCurrentTaxYear } from './utils';

export const ZRH_TAX_BASE_URL = 'https://webcalc.services.zh.ch/ZH-Web-Calculators/calculators';
const INCOME_ASSETS_ENDPOINT = `${ZRH_TAX_BASE_URL}/INCOME_ASSETS/calculate`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse query parameters
  const taxableIncome = searchParams.get('taxableIncome');
  const taxableAssets = searchParams.get('taxableAssets') || '0';
  const withholdingTax = searchParams.get('withholdingTax') || '0';
  const taxYear = searchParams.get('taxYear') || getCurrentTaxYear();

  // Validate required parameter
  if (!taxableIncome) {
    return createErrorResponse('taxableIncome is required');
  }

  // Build request body with hardcoded values
  const requestBody: Record<string, string | number> = {
    taxYear,
    maritalStatus: 'single',
    taxScale: 'BASIC',
    religionP1: 'OTHERS',
    municipality: '230',
    taxableIncome: Number(taxableIncome),
    taxableAssets: Number(taxableAssets),
    withholdingTax: Number(withholdingTax),
  };

  const response = await fetchTaxCalculation(INCOME_ASSETS_ENDPOINT, requestBody);

  // If response is already an error response, return it
  if (!response.ok) {
    return response;
  }

  try {
    const data = await response.json();
    // Extract tax value from response (adjust based on actual response structure)
    const taxValue = data.totalCantonalTax.value;
    const withholdingTaxValue = data.withholdingTax?.value || 0;

    if (typeof taxValue !== 'number' || isNaN(taxValue)) {
      throw new Error('Invalid values received from API');
    }

    const roundedTaxValue = Math.round(taxValue + withholdingTaxValue);

    return new Response(roundedTaxValue.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error:', error);
    return createErrorResponse('Internal server error', 500);
  }
};
