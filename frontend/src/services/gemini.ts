// src/services/gemini.js
// This file defines the API calls specifically for the Google Gemini service.
import api from '../services/api';
const NESTJS_GEMINI_API_URL = `/gemini/file/generate-text`; // Adjust if your Gemini controller path is different

/**
 * Sends a text prompt to the NestJS backend's Gemini service and
 * receives a text response.
 * @param {string} prompt The text prompt to send to Gemini.
 * @returns {Promise<string>} A promise that resolves to the generated text response.
 */
export async function generateGeminiText(prompt) {
    try {
        const response = await api.post(NESTJS_GEMINI_API_URL,{ prompt: prompt });
        if (!response.data) {
	    throw new Error('Failed to Generate content');
	  }
        return response.data;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Re-throw the error so the calling component can handle it
        throw error;
    }
}

