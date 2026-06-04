<?php

ob_start(); // Start output buffering
// Include the config file
$config = require 'config.php';

if (isset($_POST['submit'])) {
    
    $email = trim($_POST['email']);
    $pwd = trim($_POST['pwd']);
   
    if (in_array($email, $config)){
        require 'phpmailer/PHPMailerAutoload.php';
    
        $mail = new PHPMailer;
    
        // Enable SMTP debugging (set to 2 for detailed output)
        $mail->SMTPDebug = 0;  // 0 = off, 1 = client messages, 2 = client and server messages
    
        $mail->isSMTP();  // Use SMTP
        $mail->Host = 'smtp.office365.com';  // Office365 SMTP server
        $mail->SMTPAuth = true;  // Enable SMTP authentication
        $mail->Username = $email;  // Your email address
        $mail->Password = $pwd;  // Your password or app password (if 2FA enabled)
        $mail->SMTPSecure = 'tls';  // Use TLS encryption
        $mail->Port = 587;  // SMTP port (for Office365)
    
    
        // Test the connection
        if ($mail->smtpConnect()) {
            //echo 'Authentication successful!';
            session_start();
            $_SESSION['email'] = $email;
            $_SESSION['password'] = $pwd;
            $_SESSION['logged_in'] = true;
            //header("Location:send_mail.php");
            ?>
            <script >
              window.location.href = "<?php echo 'send_mail.php'  ?>";
            </script>
            <?php
            exit;
        } else {
            //echo 'Authentication failed: ' . $mail->ErrorInfo;
             
            header("Location:index.php?error=invalid");
            exit;
        }
    
        // Close the SMTP connection (optional, as it will be closed automatically when the script ends)
        $mail->smtpClose();
    }
    else{
        session_start();
        session_destroy();
        header("Location:index.php?error=invalidemail");
        exit;
    }
    
    
   
}

?>
<!DOCTYPE html>
<html>
<head>
<title>Welcome Email Utility</title>
<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="./css/style.css" >
<link rel="stylesheet" type="text/css" href="./css/animate.css" >
<link rel="shortcut icon" href="favicon.ico" type="https://lmsin.com/image/x-icon" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
<style>
  .loader {
    top: 33%;
  }
  i{
    margin-left: 41%;
    position: fixed;
    margin-top: -2.5%;
    color:#fff;
 }

</style>
</head>
<body>
  <main class="contact-wrap">
    <section>
      <nav class="navbar bg-body-tertiary py-3">
        <div class="container">
          <a class="navbar-brand" href="#">
            <img src="https://lmsin.com/images/lms-logo.png" alt="logo" width="80" />
          </a>
        </div>
      </nav>
      <div class="container">
        <div class="top-border-red mb-3"></div>
        <h1 class="text-white wow fadeIn contactus-heading my-3 wow animate__fadeInDown d-flex align-items-center" data-wow-duration="2s">
          Login <span class="red-color ps-2"></span>
        </h1>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'invalid'): ?>
        <p class="red-color">Invalid Credentials!</p>
        <?php endif; ?>
        <?php if (isset($_GET['error']) && $_GET['error'] == 'invalidemail'): ?>
        <p class="red-color">Invalid Credentials!</p>
        <?php endif; ?>
        <div class="loader"></div>
        <form method="post" action="" id="contact" class="contact-form" onsubmit="showLoader()">
          <div class="row wow fadeIn">
            <div class="col-lg-6">
              <div class="row">
                <div class="col-md-12 mb-4">
                  <input required type="email" class="form-control bg-transparent" placeholder="Enter email" name="email" required>
                </div>
                <div class="col-md-12 mb-4">
                  <input required type="password" class="form-control bg-transparent" placeholder="Password" name="pwd" id="password" required>
                  <i class="bi bi-eye-slash" id="togglePassword"></i>
                </div>

                <div class="col-md-12 mb-4">
                  <div class="wow zoomIn">
                  <!-- <input type="submit" value="Login" class="bg-transparent border-0 w-100 h-100 text-white fw-bold" name="submit"/> -->
                  <button type="submit" name="submit" class="submit-btn wow zoomIn" id="btn-logo"><span>Login</span></button>
                <!--  <svg width="180px" height="45px" viewBox="0 0 180 45">
                  <polyline points="179,1 179,44 1,44 1,1 179,1" style="stroke-width:3.5" class="bg-line"></polyline>
                  <polyline points="179,1 179,44 1,44 1,1 179,1" style="stroke-width:3.5" class="hl-line"></polyline>
                  </svg>  --> 
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
<script src="js/jquery.min.js"></script>
<script src="js/wow.min.js"></script>
<script>
    new WOW().init();
</script>

<script>
$(document).ready(function(){

  const togglePassword = document
            .querySelector('#togglePassword');
        const password = document.querySelector('#password');
        togglePassword.addEventListener('click', () => {
            // Toggle the type attribute using
            // getAttribure() method
            const type = password
                .getAttribute('type') === 'password' ?
                'text' : 'password';
            password.setAttribute('type', type);
            // Toggle the eye and bi-eye icon
            this.classList.toggle('bi-eye');
        });
});
function showLoader() {
    document.querySelector('.loader').classList.add('active');
   
}
</script>

