import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  // endpoint to submit form data to google sheets

  const data = await request.json();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'A1:D1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [data.name, data.email, data.phone, data.message],
      ],
    },
  });

  return NextResponse.json({ success: true, response });
}