export function renderBirthdayEmail({ name, cardSrc }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>
    :root { color-scheme: light; supported-color-schemes: light; }
    html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; display: block; }
    a { text-decoration: none; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .card-img { width: 100% !important; height: auto !important; }
    }
  </style>
</head>
<body width="100%" style="margin: 0; padding: 0; mso-line-height-rule: exactly; background-color: #f4f4f4;">
  <center style="width: 100%; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
        <tr>
          <td style="padding: 0; text-align: center;">
            <img src="${cardSrc}" alt="Birthday Card" class="card-img" style="max-width: 100%; height: auto; display: block;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 20px; background-color: #ffffff;">
            <p style="font-family: Arial; font-size: 14px; color: #333; margin: 0 0 5px;">Regards,</p>
            <p style="font-family: Arial; font-size: 14px; color: #333; margin: 0 0 5px;"><strong>Team HR</strong></p>
            <p style="font-family: Arial; font-size: 14px; color: #333; margin: 0 0 5px;">LMS Solutions (India) Pvt. Ltd.</p>
            <p style="font-family: Arial; font-size: 14px; color: #333; margin: 0 0 5px;">Mobile : +91 91655 89776</p>
            <p style="font-family: Arial; font-size: 14px; color: #333; margin: 0 0 5px;">Email : hr@lmsin.com</p>
            <p style="font-family: Arial; font-size: 14px; color: #0C64C0; margin: 0;">
              <a href="http://www.lmsin.com/" style="color: #0C64C0;">lmsin.com</a>&nbsp;&nbsp;
              <a href="https://www.linkedin.com/company/lms-solutions-india-pvt-ltd/mycompany/" style="color: #0C64C0;">LinkedIn</a>&nbsp;&nbsp;
              <a href="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043" style="color: #0C64C0;">Facebook</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>`;
}
