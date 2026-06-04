<?php
session_start(); // Start the session

// Check if the user is logged in by checking the session
if ($_SESSION['logged_in'] == true) {
    // If not logged in, redirect to the login page
   
?>
<!DOCTYPE html>
<html>
<head>
<title>Welcome Email Utility</title>
<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="./css/style.css" >
<link rel="stylesheet" type="text/css" href="./css/animate.css" >
<link rel="shortcut icon" href="favicon.ico" type="https://lmsin.com/image/x-icon" />
<script>
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href); 
    }
</script>
</head>
<body>
  <main class="contact-wrap">
    <section>
      <nav class="navbar bg-body-tertiary">
        <div class="container">
          <a class="navbar-brand" href="#">
            <img src="https://lmsin.com/images/lms-logo.png" alt="logo" width="80" />
          </a>
           <button type="submit" name="submit" class="submit-btn logout-btn"><span>
                <a class=" text-decoration-none text-white d-flex align-items-center justify-content-center" href="logout.php">Logout
                </a>
            </span>
        </button>
           
            
          
        </div>
      </nav>
      <div class="container">
        <div class="top-border-red mb-3"></div>
        <h1 class="text-white wow fadeIn contactus-heading my-3 wow animate__fadeInDown d-flex align-items-center" data-wow-duration="2s">
          Welcome Email <span class="red-color ps-2">&nbsp;Utility</span>
        </h1>
        <div class="loader"></div>
        <form method="post" action="" id="contact" class="contact-form" enctype="multipart/form-data" onsubmit="showLoader()">
          <div class="row wow fadeIn">
            <div class="col-lg-8">
              <div class="row">
                <div class="col-md-4 mb-4">
                  <select class="form-select bg-transparent" aria-label="Default select example" name="nameTitle" id="nameTitle" required>
                        <option value="">Select Salutation</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                    
                  </select>
                </div>
                <div class="col-md-4 mb-4">
                  <input required type="text" class="form-control bg-transparent" placeholder="Enter full name of new joinee" name="name" id="name" required>
                </div>
                
                <div class="col-md-4 mb-4">
                  <input required type="email" class="form-control bg-transparent" placeholder="Enter email id of new Joinee" name="email_new" id="email_new" required>
                </div>
                
                <div class="col-md-6 mb-4">
                  <select class="form-select bg-transparent" aria-label="Default select example" name="team" id="team" required>
                        <option value="">Select Team</option>
                        
                        <option value="Java">Java</option>
                        <option value=".Net">.Net</option>
                        <option value="PHP">PHP</option>

                        <option value="Node Js">Node Js</option>
                        <option value="React Js">React Js</option>
                        <option value="Vue Js">Vue JS</option>
                        <option value="Angular Js">Angular Js</option>

                        <option value="Android">Android</option>
                        <option value="ios">ios</option>
                        <option value="Flutter">Flutter</option>

                        <option value="Salesforce">Salesforce</option>
                        <option value="Architect">Architect</option>

                        <option value="HTML/CSS">HTML/CSS</option>
                        <option value="UI/UX">UI/UX</option>

                        <option value="BA">BA</option>
                        <option value="Pre-Sales">Pre-Sales</option>

                        <option value="Accounts">Accounts</option>

                        <option value="HR">HR</option>

                        <option value="IT Support">IT Support</option>
                        
                        <option value="Admin">Admin</option>
                        <option value="Office Staff">Office Staff</option>

                        <option value="Manual QA">Manual QA</option>
                        <option value="Automation QA">Automation QA</option>

                        <option value="otherteam">Other</option>
                  </select>
                  <input style="display:none;margin-top:5%;" type="text" name="other_team" id="other_team" class="form-control" class="form-control bg-transparent" placeholder="Enter Team Name *" value=""/>
                </div>
                <div class="col-md-6 mb-4">
                  <select class="form-select bg-transparent" aria-label="Default select example" name="designation" id="designation" required>
                        <option value="">Select Designation</option>
                        <option value="Trainee Software Engineer">Trainee Software Engineer</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Senior Software Engineer">Senior Software Engineer</option>
                        <option value="Module Lead Engineer">Module Lead Engineer</option>
                        <option value="Architect Engineering">Architect Engineering</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Vice President Technology">Vice President Technology</option>
                        <option value="Director Engineering">Director Engineering</option>
                        
                        <option value="Senior UI Designer">Senior UI Designer</option>
                        <option value="Head UI UX Designer">Head UI UX Designer</option>
                        <option value="Principal UI/IX Designer">Principal UI/IX Designer</option>
                        <option value="Module Lead Designer">Module Lead Designer</option>

                        <option value="Account Manager">Account Manager</option>

                        <option value="Office Attendant">Office Attendant</option>
                        <option value="NetOps Engineer">NetOps Engineer</option>

                        <option value="Assistant Manager Admin">Assistant Manager Admin</option>

                        <option value="Module Lead BA">Module Lead BA</option>

                        <option value="Senior Manager HR">Senior Manager HR</option>
                        <option value="Senior HR Executive">Senior HR Executive</option>

                        <option value="Trainee QA Engineer">Trainee QA Engineer</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Senior QA Engineer">Senior QA Engineer</option>
                        <option value="Project Lead QA">Project Lead QA</option>
                        <option value="Principal QA Engineer">Principal QA Engineer</option>
                        <option value="Module Lead QA">Module Lead QA</option>
                        <option value="Architect QA">Architect QA</option>
                        <option value="Assistant Vice President QA">Assistant Vice President QA</option>

                        <option value="Project Lead Engineer">Project Lead Engineer</option>
                        <option value="Senior Manager Accounts">Senior Manager Accounts</option>
                        <option value="Manager Business Development">Manager Business Development</option>
                        <option value="Senior Project Manager">Senior Project Manager</option>
                        <option value="Senior Accounts Executive">Senior Accounts Executive</option>
                        <option value="UI Designer">UI Designer</option>
                        <option value="Principal Software Engineer">Principal Software Engineer</option>

                        <option value="other">Other</option>
                  </select>
                  <input style="display:none;margin-top:5%;" type="text" name="other_des" id="other_des" class="form-control bg-transparent" placeholder="Enter Designation" value="" />
                </div>
                <div class="col-md-12 mb-4">
                  <textarea class="form-control resize-none" name="txtMsg" id="exampleFormControlTextarea1" rows="4" placeholder="Qualifications" required></textarea>
                </div>
                <div class="col-md-12 mb-4">
                  <textarea class="form-control resize-none" name="txtMsg2" id="exampleFormControlTextarea1" rows="4" placeholder="Hobbies" required></textarea>
                </div>
                <div class="col-md-12 file-upload">
                  <input id="file-upload" class="custom-file-upload w-100" type="file" name="file" required />
                  <!-- <div class="custom-file-upload">Choose file</div>     -->
                  <p class="py-3">Add Profile Picture (Upto 100kb)</p>
                </div>
   

                <div class="col-md-12 mb-4">
                    <div class="wow zoomIn">
                    <!-- <input type="submit" name="submit" value="Send Email" class="bg-transparent border-0 w-100 h-100 text-white fw-bold" /> -->
                    <button type="submit" name="submit" class="submit-btn wow zoomIn"><span>Send Email</span></button> 
                   <!-- <svg width="180px" height="45px" viewBox="0 0 180 45">
                    <polyline points="179,1 179,44 1,44 1,1 179,1" style="stroke-width:3.5" class="bg-line"></polyline>
                    <polyline points="179,1 179,44 1,44 1,1 179,1" style="stroke-width:3.5" class="hl-line"></polyline>
                    </svg> -->
                    </div>
                </div>  
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
    



  </main>
  
</body>
</html>
<script src="js/wow.min.js"></script>
<script src="js/jquery.min.js"></script>
<script>
    new WOW().init();
</script>

<script>

$(document).ready(function() { 
    
    $('#team').change(function(){
        
        var get_team = $('#team').val();
        if(get_team == 'otherteam'){
            $('#other_team').attr('required',true);    
            $('#other_team').css('display','block');
        }
        else{
            $('#other_team').attr('required',false);    
            $('#other_team').css('display','none'); 
        }
    });

    $('#designation').change(function(){
        
        var get_des = $('#designation').val();
       
        if(get_des == 'other'){
            $('#other_des').attr('required',true);       
            $('#other_des').css('display','block');
        }
        else{
            $('#other_des').attr('required',false);       
            $('#other_des').css('display','none'); 
        }
    });

     $("input[type='file']").on("change", function () {
     if(this.files[0].size > 102400) {
       alert("Please upload file less than or equal to 100KB only. Thanks!!");
       $(this).val('');
     }
    });
     
});  
</script>
<script>
function showLoader() {
    document.querySelector('.loader').classList.add('active');
}
</script>
<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
if (isset($_POST['submit'])) 
{

    $name        = ucwords($_POST['name']);
    $nameTitle = ucwords($_POST['nameTitle']);
    
    $teamName = trim($_POST['team']);
    if($teamName == 'otherteam'){
        $teamName = ucwords($_POST['other_team']); 
    }
    else{
        $teamName = ucwords($_POST['team']); 
    }

    $designation = trim($_POST['designation']);
    if($designation == 'other'){
        $designation = ucwords($_POST['other_des']); 
    }
    else{
        $designation = ucwords($_POST['designation']); 
    }

    $description = $_POST['txtMsg'];
    $des2 = $_POST['txtMsg2'];
    
    $newJoineeEmail = trim($_POST['email_new']);
   
    $url = '';
    $gen = '';
    if ($nameTitle == 'Mr.') {
        $gen = 'him';
    } else {
        $gen = 'her';
    }
    
    //file upload
    if (isset($_FILES['file'])) {

        $errors = array();
        $file_name = $_FILES['file']['name'];
        $file_size = $_FILES['file']['size'];
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_type = $_FILES['file']['type'];
        $file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));

        $extensions = array("jpeg", "jpg", "png");

        if (in_array($file_ext, $extensions) === false) {
            $errors[] = "extension not allowed, please choose a JPEG or PNG file.";
        }
        
        // Maximum allowed file size (400KB)
        $max_size = 100 * 1024; // 400KB in bytes
        if ($file_size > $max_size) {
            $errors[] = 'The file size is less than or equal to 400KB.';
            echo "The file size is less than 400KB.";
            return;
        }

        if (empty($errors) == true) {
           
            // Remove spaces from the file name
            $file_name = str_replace(' ', '', $file_name);
            move_uploaded_file($file_tmp, "profileimages/" . $file_name);
            $url = 'https://lmsin.com/welcome_email/profileimages/'. $file_name;
            // echo "Success";
            //die;
        } else {
            print_r($errors);
            die;
        }
    }

    // Convert image to base64
    // $imagePath1 = 'profileimages/' . $file_name;
    // $imageData1 = base64_encode(file_get_contents($imagePath1));
    // $imageType1 = pathinfo($imagePath1, PATHINFO_EXTENSION);
    // $base64Image1 = 'data:image/' . $imageType1 . ';base64,' . $imageData1;
    
    $base64Image1 = $url;

    // $topHeaderPath1 = 'profileimages/Topheader.png';
    // $topheaderData1 = base64_encode(file_get_contents($topHeaderPath1));
    // $topimageType = pathinfo($topHeaderPath1, PATHINFO_EXTENSION);
    // $topbase64Image = 'data:image/' . $topimageType . ';base64,' . $topheaderData1;
    $topbase64Image = 'https://lmsin.com/welcome_email/profileimages/Topheader.png';

    //
    $body = '
           <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <base href="https://raw.githubusercontent.com/TedGoas/Cerberus/master/cerberus-hybrid.html">
    <meta charset="utf-8"> 
    <meta name="viewport" content="width=device-width,initial-scale=1"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta name="x-apple-disable-message-reformatting"> 
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title></title> 
    <style>
       
        :root {
            color-scheme: light;
            supported-color-schemes: light;
        }

        
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
        }

       
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

       
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

      
        #MessageViewBody,
        #MessageWebViewDiv {
            width: 100% !important;
        }

       
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

       
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            
        }

       
        img {
            -ms-interpolation-mode: bicubic;
        }

       
        a {
            text-decoration: none;
        }

       
        a[x-apple-data-detectors],
        
        .unstyle-auto-detected-links a,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        
        .im {
            color: inherit !important;
        }

        
        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }

       
        img.g-img+div {
            display: none !important;
        }

        
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }

        
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }

       
        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }

         
    </style>
    
    <style>
            @media screen and (max-width: 767px) {
               .padding18 {
                  padding: 18px !important; 
               }
               .paddingLRB {
                  padding: 20px 15px 30px !important;    
               }
            }
        
        @media screen and (max-width: 480px) {

            .stack-column,
            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }

           
            .stack-column-center {
                text-align: center !important;
            }

           
            .center-on-narrow {
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
                float: none !important;
            }

            table.center-on-narrow {
                display: inline-block !important;
            }

            
            .email-container p {
                font-size: 17px !important;
            }
        }
    </style>
   

</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #ffffff;">
    <center role="article" aria-roledescription="email" lang="en" style="width: 100%; background-color: #ffffff;">';

    $body .= "<div style='max-height:0; overflow:hidden; mso-hide:all;'' aria-hidden='true'>
            Welcome to LMS family!!!
        </div>";

    $body .= ' <div
            style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: Arial;">
            &zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;&zwnj;
        </div>
       
        <div style="max-width: 680px; margin: 0 auto;" class="email-container"> 
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto; border: 1px solid #ccc;">
                <tbody>
                    <tr>
                        <td style="background-color: #ff0e0d; height: 3px; width: 100%; overflow:hidden; box-sizing: border-box;"></td>
                    </tr>  
                    <tr>
                        <td dir="ltr" style="background-color: #0F6BB0; overflow:hidden; min-height: 40px;max-height:40px;">   
                            <img src="'.$topbase64Image.'" width="100%"   
                                alt="LMS" border="0"
                                style="max-width: 100%; height: auto; min-height: 40px; margin: auto; display: block; margin-bottom: 8px;"   
                                class="g-img" />   
                           <!--<img src="https://www.lmsin.com/Email/img/Topheader.png" width="680" height="" alt="LMS" border="0" width="100%" bgcolor="#0F6BB0" style="max-height: 161px;" />-->  
                        </td>
                    </tr>
                   
                    <tr>
                       
                       <td class="paddingLRB" dir="ltr" height="100%" valign="top"
  style="font-size:0; padding: 0 20px 30px; background-color: #0F6BB0;">         
  <table>
    <tbody>
      <tr>
        <td>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td dir="ltr" style="padding: 0 10px 10px 10px;width: 100px; height: 100px;">  
                    <img src="' . $base64Image1 . '" width="100" height="100" border="0" alt="LMS"
                        class="center-on-narrow" style="width: 100px; height: 100px;" />  
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
              <tr>
                <td valign="top" dir="ltr" style="font-family: Arial; color: #ffffff; padding: 5px 10px 0; text-align: left;">
                    <span 
                        style="margin: 0 0 8px 0; font-family: Arial; font-size:24px; line-height: 25px; color: #ffffff; font-weight: 500;display: block;">
                        ' . $name . '</span>
                    <span style="margin: 0 0 8px; font-size: 16px; font-family: Arial;display: block">' . $designation . '</span>                   
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
                        <td class="padding18" style="padding:30px;font-weight: 400; background-color: #ffffff;">
                          <table width="100%" cellspacing="5" cellpadding="0">
                            <tr>
                              <td style="padding-bottom:30px;">
                                <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">
                                  Dear Team,
                                </font>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom:30px;">
                               <!-- <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">
                                  I am very pleased to introduce our new teammate <b style="font-weight:700;color:#0F578D;">' . $nameTitle . '. ' . $name . ' </b> who has joined us as <b style="font-weight:700;color:#0F578D;">' . $designation . '</b> with our ' . $teamName . ' Team. 
                                </font>-->
                                <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">
                                  I am very pleased to introduce our new teammate ' . $nameTitle . ' ' . $name . ' </b> who has joined us as ' . $designation . '</b> in our ' . $teamName . ' Team. 
                                </font>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom:30px;">
                                <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">
                                    ' . $description . '
                                </font>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom:30px;">
                                <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">
                                    ' . $des2 . '
                                </font>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <font face="Arial" size="4" color="#08090B" style="line-height: 28px;">';
    $body .= "Let's welcome and wish " . $gen . " luck to achieve great accomplishments in future.";
    $body .= '   </font>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #ffffff;">
                          <div style="border:1px solid #000000;max-width: 400px;width:100%;margin: 0 auto;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: center; display: block; padding: 25px; background-color: #ffffff;" colspan="4">
                          <a style="display:inline-block; padding: 0 10px;" href="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043">
                            <img src="https://lmsin.com/welcome_email/profileimages/bookLogo.png"/>
                          </a>
                          <a style="display:inline-block; padding: 0 10px;" href="https://in.linkedin.com/company/lms-solutions-india-pvt-ltd">
                            <img src="https://lmsin.com/welcome_email/profileimages/LinkedinLogo.png"/>
                          </a>
                        </td>
                      </tr> 
                </tbody>
            </table>
           
            <![endif]-->
            <div class="paddingL18">
            <div style="color:#201F1E;font-size:15px;background-color:white;margin:0; text-align:left; margin-top: 20px;"><span style="font-size:11pt;font-family:Arial; text-align:left;">Regards,</span></div>
            <div style="color:#201F1E;font-size:15px;background-color:white;margin:0; text-align:left;"><span style="font-size:11pt;font-family:Arial; text-align:left;">Team HR</span><br aria-hidden="true">  
            </div>

            <div style="color:#201F1E;font-size:15px;background-color:white;margin:0; text-align:left;"><span style="font-size:11pt;font-family:Arial;"></span><span style="font-size:11pt;font-family:Arial; text-align:left;">LMS Solutions (India) Pvt. Ltd.</span></div>      

            <div style="color:#201F1E;font-size:15px;background-color:white;margin:0; text-align:left;"><span style="font-size:11pt;font-family:Arial; text-align:left;"></span><span style="font-size:11pt;font-family:Arial; text-align:left;">Mobile : +91 91655 89776</span></div>

            <div style="color:#201F1E;font-size:15px;background-color:white;margin:0; text-align:left;"><span style="font-size:11pt;font-family:Arial; text-align:left;"></span><span style="font-size:11pt;font-family:Arial; text-align:left;">Email : hr@lmsin.com</span></div> 

            <div style="text-align:left; padding-bottom: 15px;"><b><span style="font-size:11pt;font-family:Arial; text-align:left;"><a href="http://www.lmsin.com/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" title="http://www.lmsin.com/" data-linkindex="3"><span style="color:#0C64C0;">lmsin.com</span></a></span><span style="color:#0C64C0;font-size:11pt;font-family:Arial; text-align:left; text-align:left;"></span>
            <span style="font-size:11pt;font-family:Arial; text-align:left; margin-left: 3px;
    margin-right: 3px;">  
                <a href="https://www.linkedin.com/company/lms-solutions-india-pvt-ltd/mycompany/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" title="https://www.linkedin.com/company/lms-solutions-india-pvt-ltd/mycompany/" style="font-size:14px;background-color:white;margin:0; text-align:left;" data-linkindex="4"><span style="color:#0C64C0; text-align:left;">LinkedIn</span></a></span>  
                <span  style="color:#0C64C0;font-size:11pt;font-family:Arial;text-align:left;"></span></b><span style="font-size:11pt;font-family:Arial; text-align:left;"><a href="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" title="https://www.facebook.com/LMS-Solutions-India-Pvt-Ltd-2131957133590043" data-linkindex="5"><span style="color:#0C64C0; text-align:left;"><b>Facebook</b></span></a></span><br aria-hidden="true">   
            </div>
            <div>
        </div>
       
    </center>
</body>

</html>
        ';
        
   // echo $body;
   // die("test here");
    
    //mail
    require 'phpmailer/PHPMailerAutoload.php';
    require 'phpmailer/class.phpmailer.php';
    
    $email = $_SESSION['email'];
    $pwd = $_SESSION['password'];

    $mail = new PHPMailer;
    //$mail->SMTPDebug = 3;
    $mail->SMTPDebug = 0;  // Disable debugging output 
    $mail->isSMTP();
    $mail->Host = 'smtp.office365.com';
    $mail->SMTPAuth = true;
    $mail->Username = $email;
    $mail->Password = $pwd;
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587; // TCP port to connect to
    //$mail->setFrom('hr@lmsin.com');
    $mail->setFrom($email);
   
   //$mail->addAddress('roshni.khare@lmsin.com');
    //$mail->addAddress('ruchika.sengar@lmsin.com');
   // $mail->addAddress('madhuri.singh@lmsin.com');
   // $mail->addAddress('aharif@lmsin.com');
    $mail->addAddress('all@lmsin.com');
    $mail->AddCC($newJoineeEmail);
   
    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = 'Welcoming ' . $nameTitle . ' ' . $name;
    $mail->Body    = $body;
    
    // echo "<pre>"; 
    // print_r($mail);  
   

    if (!$mail->send()) {
        //echo 'Mail could not be sent.';
        //echo 'Mailer Error: ' . $mail->ErrorInfo;
        echo '<script>alert("Mail could not be sent due to authentication issue.")</script>';
    } else {
        echo '<script>alert("Mail has been sent.");
        document.getElementById("contact").reset();
        
        </script>';
        // session_start();
        // session_destroy();
       
        //echo '<span style="margin-top:20px;">Mail has been sent.</span>';
    }
   
}
}
else{
    session_start();
    session_destroy();
    header("Location:index.php");
    exit;
}



?>
