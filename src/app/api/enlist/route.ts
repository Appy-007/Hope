import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { ngoName, contactPerson, email, phone, address, areaHint, description, services } = data;

    // Validate request
    if (!ngoName || !email || !phone || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Format services string for display
    const selectedServices = Object.entries(services || {})
      .filter(([, value]) => value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(", ") || "None specified";

    const emailSubject = `[Hope NGO Enlistment Request] ${ngoName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">New NGO Enlistment Request</h2>
        <p style="color: #4b5563; font-size: 14px;">A new animal welfare organization has submitted an enlistment request via the Hope application.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; width: 35%; color: #374151;">NGO Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${ngoName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Contact Person:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${contactPerson || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Public Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Phone / Helpline:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Address:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Area Coverage:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${areaHint || "Kolkata"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6; color: #374151;">Services Offered:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><strong>${selectedServices}</strong></td>
          </tr>
        </table>
        
        <div style="margin-top: 20px;">
          <p style="font-weight: bold; color: #374151; margin-bottom: 5px;">Description:</p>
          <div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6; color: #4b5563; font-size: 14px; white-space: pre-wrap;">${description || "No description provided."}</div>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 11px; color: #9ca3af;">
          Sent by Hope Animal Welfare Aggregator System
        </div>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!apiKey) {
      // Simulate submission in console if API key is not configured yet
      console.log("\n==================================================");
      console.log("SIMULATED EMAIL SUBMISSION (RESEND_API_KEY is not set)");
      console.log(`To: ${notificationEmail || "Admin (Unset)"}`);
      console.log(`Subject: ${emailSubject}`);
      console.log("Details:\n", JSON.stringify(data, null, 2));
      console.log("==================================================\n");

      return NextResponse.json({
        success: true,
        message: "Submission received in local simulation mode! Set RESEND_API_KEY to send real emails.",
      });
    }

    if (!notificationEmail) {
      return NextResponse.json(
        { error: "Server misconfiguration. NOTIFICATION_EMAIL is not set in environment variables." },
        { status: 500 }
      );
    }

    // Call Resend's API directly using fetch (zero package dependency)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Hope NGO Enlistment <onboarding@resend.dev>",
        to: notificationEmail,
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API Error details:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Failed to deliver email through service." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your enlistment request has been submitted successfully. We will review it shortly!",
    });
  } catch (error) {
    console.error("Enlistment route error:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
