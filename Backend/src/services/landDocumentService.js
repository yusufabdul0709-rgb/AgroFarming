import { GoogleGenAI } from '@google/genai';
import path from 'path';

let aiInstance = null;
function getClient() {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
}

/**
 * Auto-detects MIME type based on file path extension.
 * @param {string} filePath - Local file path.
 * @returns {string} - MIME type.
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.pdf':
            return 'application/pdf';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        default:
            return 'application/octet-stream';
    }
}

/**
 * Uploads a land document, extracts structured land data using Gemini, and cleans up.
 * @param {string} filePath - Local path to the uploaded document file.
 * @returns {Promise<Object>} - The parsed JSON data of the land document.
 */
export async function extractLandDocumentData(filePath) {
    const ai = getClient();
    
    // Step 1: Upload the file (Supports PDF, PNG, JPEG)
    const uploadedFile = await ai.files.upload({
        file: filePath,
        mimeType: getMimeType(filePath),
    });

    try {
        // Step 2: Define structured legal parsing prompt
        const prompt = `
        You are an expert legal document analyst and land registration specialist.
        Carefully read the provided land document (deed, title certificate, or registration paper).
        Extract all relevant data fields accurately into the requested JSON schema.
        
        If a specific field cannot be found in the document, explicitly set its value to null.
        
        Extract these exact keys:
        - document_type: (e.g., Sale Deed, Title Deed, Lease Agreement)
        - owner_name: (Full name of the primary owner or buyer)
        - co_owners: (Array of strings containing names of any co-owners, or empty array [])
        - property_area: (Total area string with units, e.g., "2400 sq ft" or "1.5 acres")
        - location_details: {
            "survey_number": (Survey/Plot/Khata number string or null),
            "village_or_locality": (Village, colony, or street name or null),
            "district": (District name or null),
            "state": (State/Province name or null)
          }
        - boundaries: {
            "north": (Description of northern boundary or null),
            "south": (Description of southern boundary or null),
            "east": (Description of eastern boundary or null),
            "west": (Description of western boundary or null)
          }
        - registration_date: (Date of registration in YYYY-MM-DD format if available, else null)
        - additional_notes: (Any critical legal conditions, encumbrances, or remarks mentioned)
        `;

        // Step 3: Call the model with structured JSON configuration
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                {
                    fileData: {
                        fileUri: uploadedFile.uri,
                        mimeType: uploadedFile.mimeType
                    }
                },
                prompt
            ],
            config: {
                responseMimeType: 'application/json',
                temperature: 0.0 // Zero temperature for precise, non-hallucinated extractions
            }
        });

        // Step 4: Parse and return the JSON object
        const parsedData = JSON.parse(response.text);
        return parsedData;

    } finally {
        // Step 5: Clean up the file from cloud storage
        if (uploadedFile && uploadedFile.name) {
            await ai.files.delete({ name: uploadedFile.name });
        }
    }
}
