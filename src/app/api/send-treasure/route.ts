import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email, description, coordinates, image } = await request.json();

        // Prepare attachments array
        const attachments = [];

        if (image) {
            // Convert base64 to buffer for attachment
            // Remove the data:image/...;base64, prefix
            const base64Data = image.split(',')[1];
            const imageType = image.split(';')[0].split('/')[1]; // Gets 'jpeg', 'png', etc.

            attachments.push({
                filename: `treasure.${imageType}`,
                content: base64Data,
            });
        }

        const data = await resend.emails.send({
            from: 'Treasure Finder <onboarding@resend.dev>', // Use your verified domain later
            to: [email],
            subject: 'Your Treasure Discovery 🏴‍☠️',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Treasure Found! 🏴‍☠️</h1>
          
          ${image ? '<p style="color: #7f8c8d;"><em>See attached image of your treasure!</em></p>' : ''}
          
          <h2 style="color: #34495e;">Description:</h2>
          <p style="color: #2c3e50; line-height: 1.6;">${description || 'No description provided'}</p>
          
          <h2 style="color: #34495e;">Location:</h2>
          <p style="color: #2c3e50;">
            <strong>Latitude:</strong> ${coordinates?.latitude?.toFixed(6) || 'N/A'}<br/>
            <strong>Longitude:</strong> ${coordinates?.longitude?.toFixed(6) || 'N/A'}
          </p>
          
          ${coordinates?.latitude && coordinates?.longitude
                    ? `<p style="margin-top: 20px;">
                <a href="https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}" 
                   style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                  View on Google Maps
                </a>
              </p>`
                    : ''}
        </div>
      `,
            attachments: attachments.length > 0 ? attachments : undefined,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to send email',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}