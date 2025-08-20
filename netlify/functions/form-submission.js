// netlify/functions/form-submission.js
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    // Parse form data
    const params = new URLSearchParams(event.body);
    const formData = Object.fromEntries(params);
    const formType = formData['form-name'];
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let htmlContent, subject;

    // Generate email content based on form type
    switch (formType) {
      case 'enquiry':
        ({ htmlContent, subject } = generateEnquiryEmail(formData));
        break;
      case 'contact':
        ({ htmlContent, subject } = generateContactEmail(formData));
        break;
      case 'newsletter':
        ({ htmlContent, subject } = generateNewsletterEmail(formData));
        break;
      default:
        throw new Error('Unknown form type');
    }

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: subject,
      html: htmlContent,
      replyTo: formData.email || formData.parent_email || process.env.EMAIL_USER
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing form submission' })
    };
  }
};

function generateEnquiryEmail(formData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 700px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 10px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #1e7fb8 0%, #2c5aa0 100%); 
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 300;
        }
        .header .subtitle {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .form-data { 
          padding: 40px; 
        }
        .section {
          margin-bottom: 35px;
          border-left: 4px solid #1e7fb8;
          padding-left: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e7fb8;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }
        .field-grid.single {
          grid-template-columns: 1fr;
        }
        .field { 
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        .field-label { 
          font-weight: 600; 
          color: #495057; 
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .field-value { 
          color: #212529; 
          font-size: 16px;
          font-weight: 500;
        }
        .highlight {
          background: #e3f2fd;
          border-color: #1e7fb8;
        }
        .footer { 
          background: #f8f9fa; 
          padding: 25px; 
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .timestamp {
          font-size: 14px; 
          color: #6c757d;
          margin-bottom: 10px;
        }
        .branding {
          color: #1e7fb8;
          font-weight: 600;
          text-decoration: none;
        }
        .consent-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .consent-title {
          color: #856404;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .consent-text {
          color: #856404;
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Student Enquiry</h1>
          <p class="subtitle">International Education Application</p>
        </div>
        
        <div class="form-data">
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="field-grid">
              <div class="field highlight">
                <div class="field-label">Full Name</div>
                <div class="field-value">${formData.first_name || ''} ${formData.last_name || ''}</div>
              </div>
              <div class="field">
                <div class="field-label">Application Date</div>
                <div class="field-value">${formData.date || 'Not provided'}</div>
              </div>
            </div>
            
            <div class="field-grid">
              <div class="field highlight">
                <div class="field-label">Email Address</div>
                <div class="field-value">${formData.email || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Phone Number</div>
                <div class="field-value">${formData.phone || 'Not provided'}</div>
              </div>
            </div>
            
            <div class="field-grid">
              <div class="field">
                <div class="field-label">Nationality</div>
                <div class="field-value">${formData.nationality || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Current School</div>
                <div class="field-value">${formData.current_school || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Parent/Guardian Information</div>
            <div class="field-grid">
              <div class="field">
                <div class="field-label">Parent's Email</div>
                <div class="field-value">${formData.parent_email || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Parent's Phone</div>
                <div class="field-value">${formData.parent_phone || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Academic Details</div>
            <div class="field-grid single">
              <div class="field">
                <div class="field-label">Education Details</div>
                <div class="field-value">${formData.education_details || 'Not provided'}</div>
              </div>
            </div>
            
            <div class="field-grid">
              <div class="field highlight">
                <div class="field-label">Level of Study</div>
                <div class="field-value">${formData.level_of_study ? formData.level_of_study.charAt(0).toUpperCase() + formData.level_of_study.slice(1) : 'Not specified'}</div>
              </div>
              <div class="field highlight">
                <div class="field-label">Preferred Country</div>
                <div class="field-value">${getCountryName(formData.preferred_country)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Study Preferences</div>
            <div class="field-grid">
              <div class="field highlight">
                <div class="field-label">Preferred Course</div>
                <div class="field-value">${formData.preferred_course || 'Not specified'}</div>
              </div>
              <div class="field">
                <div class="field-label">Preferred Institution</div>
                <div class="field-value">${formData.preferred_institution || 'Open to suggestions'}</div>
              </div>
            </div>
            
            <div class="field-grid single">
              <div class="field">
                <div class="field-label">Year of Entry</div>
                <div class="field-value">${formData.year_of_entry || 'Not specified'}</div>
              </div>
            </div>
          </div>

          ${formData.consent ? `
          <div class="consent-box">
            <div class="consent-title">✓ Authorization Consent Provided</div>
            <div class="consent-text">
              The student has authorized Melford to act on their behalf in all official correspondence and interactions with universities concerning their academic affairs.
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <div class="timestamp">
            Application submitted on ${new Date().toLocaleString('en-GB', { 
              timeZone: 'Africa/Nairobi',
              dateStyle: 'full',
              timeStyle: 'medium'
            })} EAT
          </div>
          <div>
            Submitted via <a href="https://melfordintlgroup.com" class="branding">Melford International Group</a> enquiry form
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    htmlContent,
    subject: `New Student Enquiry - ${formData.first_name} ${formData.last_name} (${formData.preferred_course || 'General Enquiry'})`
  };
}

function generateContactEmail(formData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 10px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #1e7fb8 0%, #2c5aa0 100%); 
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 26px; 
          font-weight: 300;
        }
        .header .subtitle {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .form-data { 
          padding: 40px; 
        }
        .field { 
          background: #f8f9fa;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          border-left: 4px solid #1e7fb8;
        }
        .field-label { 
          font-weight: 600; 
          color: #1e7fb8; 
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .field-value { 
          color: #212529; 
          font-size: 16px;
          font-weight: 500;
        }
        .message-field {
          background: #e3f2fd;
          border-left-color: #2196f3;
        }
        .message-field .field-value {
          white-space: pre-wrap;
          line-height: 1.6;
        }
        .footer { 
          background: #f8f9fa; 
          padding: 25px; 
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .timestamp {
          font-size: 14px; 
          color: #6c757d;
          margin-bottom: 10px;
        }
        .branding {
          color: #1e7fb8;
          font-weight: 600;
          text-decoration: none;
        }
        .contact-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Message</h1>
          <p class="subtitle">General Inquiry</p>
        </div>
        
        <div class="form-data">
          <div class="contact-info">
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${formData.name || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${formData.email || 'Not provided'}</div>
            </div>
          </div>

          <div class="contact-info">
            <div class="field">
              <div class="field-label">Phone</div>
              <div class="field-value">${formData.phone || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Education Level</div>
              <div class="field-value">${formatEducationLevel(formData['education-level'])}</div>
            </div>
          </div>

          <div class="field message-field">
            <div class="field-label">Message</div>
            <div class="field-value">${formData.message || 'No message provided'}</div>
          </div>
        </div>
        
        <div class="footer">
          <div class="timestamp">
            Message sent on ${new Date().toLocaleString('en-GB', { 
              timeZone: 'Africa/Nairobi',
              dateStyle: 'full',
              timeStyle: 'medium'
            })} EAT
          </div>
          <div>
            Submitted via <a href="https://melfordintlgroup.com" class="branding">Melford International Group</a> contact form
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    htmlContent,
    subject: `New Contact Message - ${formData.name || 'Anonymous'}`
  };
}

function generateNewsletterEmail(formData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 500px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 10px; 
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #ffd900 0%, #ffb700 100%); 
          color: #333; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: 600;
        }
        .header .subtitle {
          margin: 10px 0 0 0;
          opacity: 0.8;
          font-size: 16px;
        }
        .form-data { 
          padding: 40px; 
          text-align: center;
        }
        .subscriber-email {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #1e7fb8;
          margin-bottom: 20px;
        }
        .email-label {
          font-weight: 600; 
          color: #1e7fb8; 
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .email-value {
          color: #212529; 
          font-size: 18px;
          font-weight: 600;
        }
        .welcome-text {
          color: #6c757d;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .footer { 
          background: #f8f9fa; 
          padding: 25px; 
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        .timestamp {
          font-size: 14px; 
          color: #6c757d;
          margin-bottom: 10px;
        }
        .branding {
          color: #1e7fb8;
          font-weight: 600;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Newsletter Subscription!</h1>
          <p class="subtitle">Someone joined our community</p>
        </div>
        
        <div class="form-data">
          <div class="subscriber-email">
            <div class="email-label">New Subscriber</div>
            <div class="email-value">${formData.email}</div>
          </div>
          
          <div class="welcome-text">
            A new visitor has subscribed to receive updates and newsletters from Melford International Group.
          </div>
        </div>
        
        <div class="footer">
          <div class="timestamp">
            Subscription on ${new Date().toLocaleString('en-GB', { 
              timeZone: 'Africa/Nairobi',
              dateStyle: 'full',
              timeStyle: 'medium'
            })} EAT
          </div>
          <div>
            Subscribed via <a href="https://melfordintlgroup.com" class="branding">Melford International Group</a> newsletter
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    htmlContent,
    subject: `📧 New Newsletter Subscription - ${formData.email}`
  };
}

// Helper functions
function getCountryName(countryCode) {
  const countries = {
    'uk': 'United Kingdom',
    'ireland': 'Ireland',
    'canada': 'Canada',
    'australia': 'Australia',
    'germany': 'Germany',
    'france': 'Dubai',
    'netherlands': 'Malaysia',
    'dubai': 'Dubai'
  };
  return countries[countryCode] || 'Not specified';
}

function formatEducationLevel(level) {
  const levels = {
    'high-school': 'High School',
    'bachelor': "Bachelor's Degree",
    'master': "Master's Degree",
    'phd': 'PhD',
    'other': 'Other'
  };
  return levels[level] || 'Not specified';
}