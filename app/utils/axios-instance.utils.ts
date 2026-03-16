import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

/**
 * Calculate exponential backoff delay
 * @param attempt - Retry attempt number (1-based)
 * @returns Delay in milliseconds
 */
function exponentialBackoff(attempt: number): number {
	const delays = [0, 2000, 4000, 8000, 16000, 32000]; // 0s, 2s, 4s, 8s, 16s, 32s
	return delays[Math.min(attempt, delays.length - 1)] || 32000;
}

/**
 * Check if an error should trigger a retry
 * @param error - Axios error object
 * @returns true if error is retryable
 */
function isRetryableError(error: AxiosError): boolean {
	// Network errors (no response)
	if (!error.response) {
		// ECONNREFUSED, ETIMEDOUT, ENOTFOUND, etc.
		if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
			return true;
		}
		return false;
	}

	// HTTP status codes
	const status = error.response.status;

	// Retry on 502 (Bad Gateway - Railway cold start), 503 (Service Unavailable), 504 (Gateway Timeout)
	if (status === 502 || status === 503 || status === 504) {
		return true;
	}

	// Don't retry on client errors (4xx) or server logic errors (500)
	return false;
}

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Extend InternalAxiosRequestConfig to include retry count
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retryCount?: number;
}

/**
 * Axios instance configured with retry logic for Railway cold starts
 *
 * Features:
 * - Automatic retry for 502/503/504 errors (Railway cold starts)
 * - Exponential backoff: 2s, 4s, 8s, 16s, 32s (max 5 retries)
 * - 30-second default timeout (enough for Railway wake-up)
 * - Structured logging for debugging
 */
export const axiosInstance: AxiosInstance = axios.create({
	timeout: 30000, // 30 seconds - Railway cold start can take 10-30s
	headers: {
		'Content-Type': 'application/json',
	},
});

// Response interceptor for retry logic
axiosInstance.interceptors.response.use(
	// Success handler - pass through
	(response) => response,

	// Error handler - retry logic
	async (error: AxiosError) => {
		const config = error.config as RetryableAxiosRequestConfig | undefined;

		// If no config, can't retry
		if (!config) {
			console.error('[Axios] Error without config, cannot retry:', error.message);
			throw error;
		}

		// Initialize retry count
		if (config._retryCount === undefined) {
			config._retryCount = 0;
		}

		const maxRetries = 5;

		// Check if we should retry
		if (isRetryableError(error) && config._retryCount < maxRetries) {
			config._retryCount++;

			const delay = exponentialBackoff(config._retryCount);
			const status = error.response?.status || 'network error';

			console.log(
				`[Axios Retry ${config._retryCount}/${maxRetries}] ${config.url} - Status: ${status} - Waiting ${delay}ms before retry...`,
			);

			// Wait before retrying
			await sleep(delay);

			// Retry the request
			return axiosInstance.request(config);
		}

		// Max retries exceeded or non-retryable error
		if (config._retryCount >= maxRetries) {
			console.error(`[Axios Retry Failed] ${config.url} - Exhausted all ${maxRetries} retries`);
		} else {
			console.error(`[Axios Error] ${config.url} - Non-retryable error:`, error.response?.status || error.code);
		}

		throw error;
	},
);

// Request interceptor for logging (optional, helps with debugging)
axiosInstance.interceptors.request.use(
	(config) => {
		// Reset retry count for new requests
		const retryConfig = config as RetryableAxiosRequestConfig;
		if (retryConfig._retryCount === undefined) {
			console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`);
		}
		return config;
	},
	(error) => {
		console.error('[Axios Request Error]', error);
		return Promise.reject(error);
	},
);
