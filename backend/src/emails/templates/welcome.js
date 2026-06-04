export function renderWelcomeEmail({ name, title, designation, team, description, hobbies, photoUrl }) {
  const pronoun = title === "Mr" ? "him" : "her";
  const salutation = title ? `${title}.` : "";

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
    div[style*="margin: 16px 0"] { margin: 0 !important; }
    #MessageViewBody, #MessageWebViewDiv { width: 100% !important; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; }
    img { -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    a[x-apple-data-detectors], .unstyle-auto-detected-links a, .aBn { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    .im { color: inherit !important; }
    .a6S { display: none !important; opacity: 0.01 !important; }
    img.g-img + div { display: none !important; }
    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u~div .email-container { min-width: 320px !important; } }
    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u~div .email-container { min-width: 375px !important; } }
    @media only screen and (min-device-width: 414px) { u~div .email-container { min-width: 414px !important; } }
    @media screen and (max-width: 767px) {
      .padding18 { padding: 18px !important; }
      .paddingLRB { padding: 20px 15px 30px !important; }
    }
    @media screen and (max-width: 480px) {
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .stack-column-center { text-align: center !important; }
      .center-on-narrow { text-align: center !important; display: block !important; margin-left: auto !important; margin-right: auto !important; float: none !important; }
      table.center-on-narrow { display: inline-block !important; }
      .email-container p { font-size: 17px !important; }
    }
  </style>
</head>
<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #ffffff;">
  <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #ffffff;">
    <div style="max-height:0; overflow:hidden; mso-hide:all;" aria-hidden="true">Welcome to LMS family!!!</div>
    <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family:Arial;">&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;</div>
    <div style="max-width:680px;margin:0 auto;" class="email-container">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:auto;border:1px solid #ccc;">
        <tbody>
          <tr>
            <td style="background-color:#ff0e0d;height:3px;width:100%;overflow:hidden;box-sizing:border-box;"></td>
          </tr>
          <tr>
            <td dir="ltr" style="background-color:#0F6BB0;overflow:hidden;min-height:40px;max-height:40px;">
              <img src="https://lmsin.com/welcome_email/profileimages/Topheader.png" width="100%" alt="LMS" border="0" style="max-width:100%;height:auto;min-height:40px;margin:auto;display:block;margin-bottom:8px;" class="g-img" />
            </td>
          </tr>
          <tr>
            <td class="paddingLRB" dir="ltr" height="100%" valign="top" style="font-size:0;padding:0 20px 30px;background-color:#0F6BB0;">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                          <tr>
                            <td dir="ltr" style="padding:0 10px 10px 10px;width:100px;height:100px;">
                              <img src="${photoUrl}" width="100" height="100" border="0" alt="LMS" class="center-on-narrow" style="width:100px;height:100px;" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td valign="top" dir="ltr" style="font-family:Arial;color:#ffffff;padding:5px 10px 0;text-align:left;">
                              <span style="margin:0 0 8px 0;font-family:Arial;font-size:24px;line-height:25px;color:#ffffff;font-weight:500;display:block;">${name}</span>
                              <span style="margin:0 0 8px;font-size:16px;font-family:Arial;display:block">${designation}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="padding18" style="padding:30px;font-weight:400;background-color:#ffffff;">
              <table width="100%" cellspacing="5" cellpadding="0">
                <tr>
                  <td style="padding-bottom:30px;">
                    <font face="Arial" size="4" color="#08090B" style="line-height:28px;">Dear Team,</font>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:30px;">
                    <font face="Arial" size="4" color="#08090B" style="line-height:28px;">
                      I am very pleased to introduce our new teammate ${salutation} ${name} who has joined us as ${designation} in our ${team} Team.
                    </font>
                  </td>
                </tr>
                ${description ? `<tr><td style="padding-bottom:30px;"><font face="Arial" size="4" color="#08090B" style="line-height:28px;">${description}</font></td></tr>` : ""}
                ${hobbies ? `<tr><td style="padding-bottom:30px;"><font face="Arial" size="4" color="#08090B" style="line-height:28px;">${hobbies}</font></td></tr>` : ""}
                <tr>
                  <td>
                    <font face="Arial" size="4" color="#08090B" style="line-height:28px;">
                      Let&apos;s welcome and wish ${pronoun} luck to achieve great accomplishments in future.
                    </font>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;">
              <div style="border:1px solid #000000;max-width:400px;width:100%;margin:0 auto;"></div>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;display:block;padding:25px;background-color:#ffffff;" colspan="4">
              <a style="display:inline-block;padding:0 10px;" href="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043">
                <img src="https://lmsin.com/welcome_email/profileimages/bookLogo.png" alt="Facebook" />
              </a>
              <a style="display:inline-block;padding:0 10px;" href="https://in.linkedin.com/company/lms-solutions-india-pvt-ltd">
                <img src="https://lmsin.com/welcome_email/profileimages/LinkedinLogo.png" alt="LinkedIn" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="color:#201F1E;font-size:15px;background-color:white;margin:0;text-align:left;margin-top:20px;">
        <span style="font-size:11pt;font-family:Arial;text-align:left;">Regards,</span>
      </div>
      <div style="color:#201F1E;font-size:15px;background-color:white;margin:0;text-align:left;">
        <span style="font-size:11pt;font-family:Arial;text-align:left;">Team HR</span>
      </div>
      <div style="color:#201F1E;font-size:15px;background-color:white;margin:0;text-align:left;">
        <span style="font-size:11pt;font-family:Arial;text-align:left;">LMS Solutions (India) Pvt. Ltd.</span>
      </div>
      <div style="color:#201F1E;font-size:15px;background-color:white;margin:0;text-align:left;">
        <span style="font-size:11pt;font-family:Arial;text-align:left;">Mobile : +91 91655 89776</span>
      </div>
      <div style="color:#201F1E;font-size:15px;background-color:white;margin:0;text-align:left;">
        <span style="font-size:11pt;font-family:Arial;text-align:left;">Email : hr@lmsin.com</span>
      </div>
      <div style="text-align:left;padding-bottom:15px;">
        <b>
          <span style="font-size:11pt;font-family:Arial;text-align:left;">
            <a href="http://www.lmsin.com/" target="_blank" rel="noopener noreferrer" style="color:#0C64C0;">lmsin.com</a>
          </span>
          <span style="font-size:11pt;font-family:Arial;text-align:left;margin-left:3px;margin-right:3px;">
            <a href="https://www.linkedin.com/company/lms-solutions-india-pvt-ltd/mycompany/" target="_blank" rel="noopener noreferrer" style="color:#0C64C0;">LinkedIn</a>
          </span>
        </b>
        <span style="font-size:11pt;font-family:Arial;text-align:left;">
          <a href="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043" target="_blank" rel="noopener noreferrer" style="color:#0C64C0;">Facebook</a>
        </span>
      </div>
    </div>
  </center>
</body>
</html>`;
}
