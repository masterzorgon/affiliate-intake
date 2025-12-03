import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  // endpoint to submit form data to google sheets

  try {
    const data = await request.json();

    // Validate required environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set');
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY environment variable is not set');
    }
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID environment variable is not set');
    }
    
    // Process private key: handle various formats (quoted strings, escaped newlines, etc.)
    let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    // Remove surrounding quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    // Trim whitespace
    privateKey = privateKey.trim();
    
    // Validate private key format
    if (!privateKey.includes('BEGIN PRIVATE KEY') && !privateKey.includes('BEGIN RSA PRIVATE KEY')) {
      throw new Error('Invalid private key format: must include BEGIN PRIVATE KEY or BEGIN RSA PRIVATE KEY markers');
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim(),
        private_key: privateKey,
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
      ],
    })

    const sheets = google.sheets({ version: 'v4', auth });

    // Support both old twitter field and new socialPlatformLink field for backward compatibility
    const socialLink = data.socialPlatformLink || data.twitter || '';
    
    const values = [
      [
        data.region, 
        data.country, 
        data.name,
        data.email, 
        data.telegram, 
        data.socialPlatform, // social platform choice
        socialLink, // social platform link
        data.preferredContactMethod
      ],
    ];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Main!A:H',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values,
      },
    });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    
    // Check if the error is related to unsupported document format (e.g., .xlsx file)
    const errorMessage = error.message || '';
    const errorDetails = error.response?.data || {};
    const isUnsupportedFormatError = 
      errorMessage.includes('This operation is not supported for this document') ||
      errorMessage.includes('not supported') ||
      error.code === 400;
    
    let userFriendlyError = error.message || 'Failed to submit form data';
    let helpfulMessage = '';
    
    if (isUnsupportedFormatError) {
      userFriendlyError = 'Unsupported document format';
      helpfulMessage = 'The Google Sheet ID points to an Excel file (.xlsx) instead of a Google Sheet. ' +
        'To fix this: 1) Open Google Sheets, 2) Go to File > Import, 3) Upload your Excel file, ' +
        '4) Import it as a Google Sheet, 5) Use the new Google Sheet ID (from the URL) in your environment variables.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: userFriendlyError,
        helpfulMessage: helpfulMessage || undefined,
        details: errorDetails || error.toString()
      },
      { status: 500 }
    );
  }
}