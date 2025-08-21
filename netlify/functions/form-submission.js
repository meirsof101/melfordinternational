const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Parse form data
    const params = new URLSearchParams(event.body);
    const rawFormData = {};
    for (const [key, value] of params.entries()) {
      rawFormData[key] = value ? value.trim() : '';
    }

    // Determine form type
    const formType = rawFormData['form-name'] || 'contact';
    let emailHTML = '';
    let emailSubject = '';

    // Generate email based on form type
    if (formType === 'newsletter') {
      emailSubject = '🎉 New Newsletter Subscription - Melford International Group';
      emailHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📧 New Newsletter Subscription!</h1>
          </div>
          <div style="background: white; padding: 30px; border-left: 4px solid #667eea;">
            <h2 style="color: #333; margin-top: 0;">Subscription Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Email Address:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Submitted:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${kenyaTime}</td>
              </tr>
            </table>
          </div>
          <div style="background: #667eea; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Newsletter Service</p>
          </div>
        </div>
      `;
    } else if (formType === 'enquiry') {
      // Map enquiry form fields correctly
      const fullName = `${rawFormData.first_name || ''} ${rawFormData.last_name || ''}`.trim();
      
      emailSubject = '📋 New Student Enquiry - Melford International Group';
      emailHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎓 New Student Enquiry</h1>
          </div>
          <div style="background: white; padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Personal Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Full Name:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Date of Birth:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.date || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Nationality:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.nationality || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Current School:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.current_school || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Parent Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Parent's Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.parent_email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Parent's Phone:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.parent_phone || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Academic Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Level of Study:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.level_of_study || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Preferred Country:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.preferred_country || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Preferred Course:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.preferred_course || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Preferred Institution:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.preferred_institution || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Year of Entry:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.year_of_entry || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Education Details</h3>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>Education Background:</strong></p>
              <p style="margin: 10px 0 0 0;">${rawFormData.education_details || 'No education details provided'}</p>
            </div>

            <div style="background: #e8f5e8; padding: 10px; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px;"><strong>Consent:</strong> ${rawFormData.consent ? '✅ Student has provided consent for Melford to act on their behalf' : '❌ Consent not provided'}</p>
            </div>
          </div>
          <div style="background: #28a745; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Student Enquiry System</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Submitted: ${kenyaTime}</p>
          </div>
        </div>
      `;
    } else {
      // Contact form - fix the education-level field name
      emailSubject = '📞 New Contact Form Submission - Melford International Group';
      emailHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📞 New Contact Message</h1>
          </div>
          <div style="background: white; padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Name:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.name || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Education Level:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${rawFormData['education-level'] || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Message</h3>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545;">
              <p style="margin: 0;">${rawFormData.message || 'No message provided'}</p>
            </div>
          </div>
          <div style="background: #dc3545; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Contact Form</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Submitted: ${kenyaTime}</p>
          </div>
        </div>
      `;
    }

    // Get current time in Kenya timezone (EAT - UTC+3)
    const kenyaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    
    // Return success redirect with success parameter
    const redirectUrl = new URL(event.headers.referer || event.headers.origin || 'https://your-domain.com');
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('form', formType);
    
    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl.toString(),
      },
      body: ''
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error processing form submission',
        error: error.message 
      })
    };
  }
};