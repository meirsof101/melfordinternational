// netlify/functions/form-submission.js
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
    // Create transporter - FIXED: createTransport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Parse form data
    const params = new URLSearchParams(event.body);
    const formData = {};
    for (const [key, value] of params.entries()) {
      formData[key] = value;
    }

    // Determine form type
    const formType = formData['form-name'] || 'contact';
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
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.email}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Submitted:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          <div style="background: #667eea; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Newsletter Service</p>
          </div>
        </div>
      `;
    } else if (formType === 'enquiry') {
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
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.fullname || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Date of Birth:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.dob || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Academic Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Education Level:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.education || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Preferred Country:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.country || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Preferred Course:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.course || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Additional Information</h3>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0 0 0;">${formData.message || 'No additional message provided'}</p>
            </div>
          </div>
          <div style="background: #28a745; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Student Enquiry System</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Submitted: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;
    } else {
      // Contact form
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
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.name || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">Education Level:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${formData.education || 'N/A'}</td>
              </tr>
            </table>

            <h3 style="color: #333;">Message</h3>
            <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545;">
              <p style="margin: 0;">${formData.message || 'No message provided'}</p>
            </div>
          </div>
          <div style="background: #dc3545; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0;">Melford International Group - Contact Form</p>
            <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Submitted: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `;
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: emailSubject,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    // Return success redirect instead of JSON
    return {
    statusCode: 302,
    headers: {
        Location: event.headers.referer || '/', // reload same page, fallback to homepage
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