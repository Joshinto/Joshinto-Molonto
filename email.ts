import sendMail from '../helpers/mailgun';
import { clientAppUrl, SENDER } from '../helpers';
import moment from 'moment';
import {
    AdminSettings,
    Branch,
    ReceiptSettings,
    Settings,
    WebLink,
} from '../models';

const sendWelcomeMail = async (Payload: {
    otp: string;
    email: string;
    businessName: string;
}) => {
    const { otp, email, businessName } = Payload;

    const adminSettings = await AdminSettings.find({}).lean().exec();

    if (!adminSettings) return false;

    const { email: sender, logo } = (adminSettings[0] as any) ?? {};

    const message = {
        from: sender,
        to: email,
        subject: `${businessName} Welcome Email`,
        html: `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
</head>
<body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB; border:0.5px solid #e9edf8; color: #363636;">

  <div style="max-width:600px; margin:0 auto; padding:10px; background-color:#fff;">

    <div style="text-align:center; margin:40px 0 20px;">
      <img style="width:100px; height:auto; border-radius:8px;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/final-08%20%281%29%201.png" alt="logo" />
    </div>

    <p style="padding:20px; text-align:center; background:linear-gradient(to right, #39669E, #368FFF); color:white; font-size:30px; border-top-right-radius:40px; border-bottom-left-radius:40px;">
      Welcome to Smarter Solutions
    </p>

    <div style="padding:0 40px; color:#363636;">
      <p style="font-size:20px; font-weight:700; text-transform:uppercase;">Hi ${businessName},</p>
      <p style="line-height:150%;">It's a pleasure to welcome you to OneFlare Tech Solutions. We're excited to start this journey with you. Your success is our priority, and we're here to support you every step of the way.</p>
      <p>Please use the OTP below to verify your email address and complete the sign-up process:</p>
      
      <h2 style="text-align:center; letter-spacing:2px;">${otp}</h2>
      <p style="text-align:center; font-size:14px; color:#666;">This OTP will expire in 5 minutes</p>
    </div>

    <hr />

    <div style="padding:20px 40px 40px; color:#363636;">
      <h3 style="font-size:20px; font-weight:700;">FREE WEBSITE FOR YOU</h3>
      <p style="line-height:150%;">Sync the products in the inventory of your POS software to your Oneflare E-commerce Website with automatic synchronization on both platforms in real time.</p>
      
      <div style="background-color:#EFEFEF; padding:30px 10px; text-align:center; border-radius:6px;">
        <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/PHOTO-2025-08-15-11-05-09.png" 
             alt="screenshot 1" 
             style="display:inline-block; max-width:48%; margin-right:2%; vertical-align:middle; border-radius:4px;" />
        <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/PHOTO-2025-08-15-11-05-09%20%281%29.png" 
             alt="screenshot 2" 
             style="display:inline-block; max-width:48%; vertical-align:middle; border-radius:4px;" />
      </div>
    </div>

    <hr />

    <p style="font-style:italic; text-align:center; color:#368FFF; font-weight:600; font-size:14px; margin-top:20px;">
      THANK YOU FOR CHOOSING ONEFLARE
    </p>
    <p style="text-align:center; font-size:14px; color:#666;">
      If you didn&apos;t create an account with Oneflare POS, you can ignore this email.
    </p>

    <div style="background:linear-gradient(to right, #39669E, #368FFF); margin:20px 0; padding:20px; color:#fff; display:flex; flex-wrap:wrap;">

      <div style="flex:1 1 50%; box-sizing:border-box; padding-right:10px; min-width:200px;">
        <h3>Connect with us</h3>
        <p><i class="fa-solid fa-phone"></i> +234 913 471 3980 <br> (Mon-Fri from 9am-5pm)</p>
        <div style="display:flex; gap:30px; font-size:18px;">
          <a href="https://www.instagram.com/oneflare.tech?igsh=djlyMWVwcjN2Y2c0" style="display:inline-block; margin-right:15px;">
  <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/ri_instagram-line.png" alt="Facebook" width="20" height="20" style="display:block;" />
</a>
<a href="https://vt.tiktok.com/ZSDjeuHs2" style="display:inline-block; margin-right:15px;">
  <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/ic_outline-tiktok.png" alt="Instagram" width="20" height="20" style="display:block;" />
</a>
<a href="https://facebook.com/oneflare" style="display:inline-block;">
  <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/ic_baseline-facebook.png" alt="TikTok" width="20" height="20" style="display:block;" />
</a>

        </div>
      </div>

      <div style="flex:1 1 50%; box-sizing:border-box; padding-left:10px; min-width:200px;">
        <h3>More about us</h3>
        <p>Do you have questions?  
          <a href="mailto:Info@oneflaretechsolutions.com" style="color:#fff;">Contact Support Team</a>
        </p>
        <p>3 Olu Koleosho Street Ikeja, Lagos, Nigeria</p>
      </div>
    </div>

  </div>

</body>
</html>
`,
    };

    return await sendMail(message);
};

const sendEmailConfirmationMail = async (Payload: {
    otp: string;
    email: string;
    name: string;
}) => {
    const { otp, email, name } = Payload;

    const adminSettings = await AdminSettings.find({}).lean().exec();

    if (!adminSettings) return false;

    const { email: sender, logo } = (adminSettings[0] as any) ?? {};

    const message = {
        from: sender,
        to: email,
        subject: `${name} Email Confirmation`,
        html: `<!DOCTYPE html>
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Password Reset</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                  <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB; border:0.5px solid #e9edf8; color: #363636;">
                  <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                  </div>
                  <div style="background-color: #F7F8FB; padding:20px;">
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px; display: flex; justify-content: center; margin:0 auto; text-align:center;">
                        <img style="width:100px; height:100%;" src=${
                            logo ||
                            'https://i.ibb.co/51RvsnM/oneflare-white.jpg'
                        } alt="logo" />
                      </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Email Confirmation</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${name}</h2>
                      <p>Thank you for signing up with Oneflare!</p>
                      <p>We are excited to have you on board.</p>
                      <p>Please use the below otp to verify your email address and complete the sign-up process:</p>
                      <h2 style="text-align:center; letter-spacing:2px;">${otp}</h2>
                      <p style="text-align:center; font-size:14px; color:#666;">This OTP will expire in 5 minutes</p>
          
                  
          
                      <div class="main">
                          <p>Thank You,<br />The Oneflaretech Team</p>
                      </div>
                      <div class="footer">
                          <p>Office: 3, Olu Koleosho Street, Off Medical Road, Ikeja, Lagos, Nigeria</p>
                          <p>Phone: +234 913 471 3980 (Mon-Fri from 9am-5pm)</p>
                          <p>Email: hello@oneflaretech.com</p>
                          <p>Oneflare POS, © 2023 Oneflaretech Solutions</p>
                      </div>
          
                  </div>
          
              </div>
              </div>
        
              </body>
            </html>`,
    };

    return await sendMail(message);
};

const sendPasswordResetMail = async (Payload: any) => {
    const { email, firstName, otp } = Payload;

    const adminSettings = await AdminSettings.find({}).lean().exec();

    if (!adminSettings) return false;

    const { email: sender, logo } = (adminSettings[0] as any) ?? {};

    const message = {
        from: sender,
        to: email,
        subject: `${firstName} password reset`,
        html: `<!DOCTYPE html>
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Password Reset</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB; border:0.5px solid #e9edf8; color: #363636;">
                <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                  <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                </div>
                  <div style="background-color: #F7F8FB; padding:20px;">
                    
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px; display: flex; justify-content: center; margin:0 auto; text-align:center;">
                        <img style="width:100px; height:100%;" src="${logo}" alt="logo" />
                      </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Password Reset</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                      <p>You initiated a password reset on your account.<br>
                      Please use the OTP below to change your password:</p>
                      
                      <h2 style="text-align:center; letter-spacing:2px;">${otp}</h2>
                      <p style="text-align:center; font-size:14px; color:#666;">This OTP will expire in 5 minutes</p>
                    </div>

                  </div>
                </body>
              </html>`,
    };

    return await sendMail(message);
};

const sendPasswordChangeMail = async (Payload: {
    email: string;
    firstName: string;
}) => {
    const { email, firstName } = Payload;

    const [adminSettings] = await AdminSettings.find({}).lean().exec();

    if (!adminSettings) return false;

    const settings = await Settings.findOne({ email }).lean().exec();

    const { email: sender, logo } = adminSettings;
    const message = {
        from: sender,
        to: email,
        subject: `${settings?.businessName || firstName} password change`,
        html: `<!DOCTYPE html>
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                <meta charset="UTF-8">
                <title>Password Change</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                 <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                  <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                </div>
                <div style="background-color:#F7F8FB; padding:20px;">
                 
                  <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px;">
                  <img style="width:100px; height:100%;" src="${
                      logo ??
                      'https://res.cloudinary.com/payne/image/upload/v1648077277/oneflarepos/placeholder-image.png'
                  }" alt="logo" />
                    </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Password Change</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                      <p>You updated the password on your account.</p>
                      <p style="margin-top: 1rem; font-size:14px;">If you did not initiate this, change your password immediately and send an email to help@oneflaretech.com.</p>
                      <p style="margin-top: 4rem; font-size:14px; color:#666;">Why send this email? We take security very seriously and we want to keep you in the loop of activities on your account.</p>
                    </div>
            </div>
            </body>
          </html>`,
    };

    return await sendMail(message);
};

const sendCreateCustomerMail = async (Payload: any) => {
    const { email, firstName, ref } = Payload;

    const settings: any = await Settings.findOne({ businessRef: ref })
        .lean()
        .exec();

    if (!settings) return false;

    const { businessName, logo } = settings;

    const adminSettings = await AdminSettings.find({}).lean().exec();

    if (!adminSettings) return false;

    const { email: sender } = adminSettings[0] as any;

    const message = {
        from: sender,
        to: email,
        subject: `${businessName} customer signup`,
        html: `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8">
        <title>customer signup</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
      </head>
      <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
        <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
          <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
        </div> 
        <div style="background-color:#F7F8FB; padding:20px;">

          <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
            <div style="overflow: hidden; border-radius: 8px;">
              <img style="width:100px; height:100%;" src="${
                  logo ??
                  'https://res.cloudinary.com/payne/image/upload/v1648077277/oneflarepos/placeholder-image.png'
              }" alt="logo" 
              />
            </div>
          </div>

          <div style="padding:20px; background-color:white; border-radius:12px;">
            <h1 style="font-weight:500; margin-bottom:10px;">Email verification</h1>
            <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
            <p>Your account  has been created.</p>
            <p>You can continue to login now or immediately change your password.</p>
            
            <div style="display:flex; gap: 10px; justify-content:center; margin-top: 50px;">
              <div style="text-align:center; margin: 2px 0">
                <a href="${clientAppUrl}/auth/login/"><button style="background-color: #368FFF; outline:none; border:none; color:white; border-radius: 6px; padding: 10px 0; cursor: pointer; width: 200px;">Login</button></a>      
              </div>
              <div style="text-align:center;  margin: 2px 0">
                <a href="${clientAppUrl}/password/validate"><button style="background-color: #368FFF; outline:none; border:none; color:white; border-radius: 6px; padding: 10px 0; cursor: pointer; width: 200px;">Change password</button></a>      
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`,
    };
    return await sendMail(message);
};

const sendSubscriptionUpdateMail = async (Payload: any) => {
    const { resources, firstName, ref } = Payload;

    let Resources: any = [];

    const settings: any = await Settings.findOne({ businessRef: ref })
        .lean()
        .exec();

    const { email, logo } = settings;

    Object.keys(resources).map(data => {
        Resources.push(`<span> ${data} </span>`);
    });

    const message = {
        from: SENDER,
        to: email,
        subject: 'OneflarePOS subscription update',
        html: `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Subscription Update</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                  <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                  </div> 
                  <div style="background-color:#F7F8FB; padding:20px;">
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px;">
                        <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg"
                          alt="logo"
                        />
                      </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Subscription update</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                      <p>Your subscription update payment for <strong>${Resources}</strong> has been confirmed and the resources added to your current subscription</p>
                    </div>
                  </div>
                </body>
              </html>`,
    };

    return await sendMail(message);
};

const sendSubscriptionMail = async (Payload: any) => {
    const { subName, firstName, expires, ref } = Payload;

    const settings: any = await Settings.findOne({ businessRef: ref })
        .lean()
        .exec();

    const adminSettings: any = await AdminSettings.find({}).lean().exec();

    if (!settings || !adminSettings.length) return false;

    const { email } = settings;
    const { email: sender, logo } = adminSettings[0];

    const message = {
        from: sender,
        to: email,
        subject: 'OneflarePOS subscription',
        html: `<!DOCTYPE html>
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta charset="UTF-8">
                <title>Subscription</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
              </head>
              <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                  <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                </div> 
                <div style="background-color:#F7F8FB; padding:20px;">
                  <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                    <div style="overflow: hidden; border-radius: 8px;">
                      <img style="width:100px; height:100%;" src="${
                          logo ??
                          'https://res.cloudinary.com/payne/image/upload/v1648077277/oneflarepos/placeholder-image.png'
                      }" alt="logo" 
                      />
                    </div>
                  </div>

                  <div style="padding:20px; background-color:white; border-radius:12px;">
                    <h1 style="font-weight:500; margin-bottom:10px;">Subscription update</h1>
                    <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                    <p>Your payment for the <strong>${subName}</strong> subscription plan has been confirmed and is valid for one month. Subscription expires ${moment(
                        expires
                    )}
                    </p>
                  </div>
                </div>
              </body>
            </html>`,
    };
    return await sendMail(message);
};

const sendFundCustomerAccountMail = async (Payload: any) => {
    const { email, firstName, amount, ref } = Payload;

    const settings: any = await Settings.findOne({ businessRef: ref })
        .lean()
        .exec();

    if (!settings) return false;

    const { email: sender, logo, businessName } = settings;

    const message = {
        from: sender,
        to: email,
        subject: `${businessName} customer account credit`,
        html: `<!DOCTYPE html>
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
              <meta charset="UTF-8">
              <title>Fund customer account</title>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
            </head>
      <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
        <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
          <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
        </div>
        <div style="background-color:#F7F8FB; padding:20px;">
          <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
            <div style="overflow: hidden; border-radius: 8px;">
              <img style="width:100px; height:100%;" src=${
                  logo ??
                  'https://res.cloudinary.com/payne/image/upload/v1648077277/oneflarepos/placeholder-image.png'
              } alt="logo"
              />
            </div>
          </div>

          <div style="padding:20px; background-color:white; border-radius:12px;">
            <h1 style="font-weight:500; margin-bottom:10px;">Subscription update</h1>
            <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
            <p>You have successfully credited your account with ${amount}</p>
          </div>
        </div>
      </body>
      </html>`,
    };

    return await sendMail(message);
};

const sendCouponPaymentMail = async (Payload: any) => {
    const { firstName, code: couponCodes, ref } = Payload;

    const settings: any = await Settings.findOne({ businessRef: ref })
        .lean()
        .exec();

    if (!settings) return false;

    const { email, businessName } = settings;

    let coupon_table = `
 <table width="100%" cellpadding="8" cellspacing="0"
    style="border-collapse: collapse; font-family: 'Poppins', sans-serif; font-size:14px; text-align:left;">
    <thead>
      <tr style="background-color:#368FFF; color:#ffffff;">
        <th style="padding:8px; text-align:center; border-top-left-radius:6px; border-bottom-left-radius:6px;">S/N</th>
        <th style="padding:8px; text-align:center; border-top-right-radius:6px; border-bottom-right-radius:6px;">CODE</th>
      </tr>
    </thead>
    <tbody>`;

    couponCodes.forEach((codeObject: { code: any }, idx: number) => {
        coupon_table += `
        <tr style="border: 1px solid #DCDCDD;">
          <td style="padding:8px; text-align:center;">${idx + 1}</td>
          <td style="padding:8px; text-align:center;">${codeObject.code}</td>
        </tr>`;
    });

    coupon_table += `
      </tbody>
      </table>`;

    const message = {
        from: SENDER,
        to: email,
        subject: `${businessName} coupon creation`,
        html: `<!DOCTYPE html>
              <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta charset="UTF-8">
                <title>Fund customer account</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
              </head>
              <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
              <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                  <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                </div>  
              <div style="background-color:#F7F8FB; padding:20px;">
                  <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                    <div style="overflow: hidden; border-radius: 8px;">
                      <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg" alt="logo" />
                    </div>
                  </div>

                  <div style="padding:20px; background-color:white; border-radius:12px;">
                    <h1 style="font-weight:500; margin-bottom:10px;">Subscription Update</h1>
                    <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                    <p> Your payment for the following coupon codes have been confirmed and the coupon is now activated for use. </p>

                    
                          ${coupon_table}
                        
     </div>
      </body>
      </html>`,
    };

    return await sendMail(message);
};

const sendEmailToCustomerUponSuccessfulReservation = async (
    payload: any,
    customer: any
) => {
    const { businessRef, details, date } = payload;
    const { firstName, lastName, email } = customer;

    const settings: any = await Settings.findOne({ businessRef }).lean().exec();

    const { businessName } = settings;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const message = {
        from: SENDER,
        to: email,
        subject: `Scuccesful Reservation from ${businessName}`,
        html: `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Subscription Expiration - One Flare</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                  <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                  </div>
                  <div style="background-color:#F7F8FB; padding:20px;">
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px;">
                        <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg"
                          alt="logo"
                        />
                      </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Reservation Confirmation</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${firstName}</h2>
                      <p>Successful Reservation</p>
                      <p style="margin: 0; padding: 4px 0;">Here are the details:</p>
                      <p style="margin: 0; padding: 4px 0;"><strong>Customer Name: ${firstName} ${lastName}</strong></p>
                      <p style="margin: 0; padding: 4px 0;"><strong>${details}</strong></p>
                      <p style="margin: 0; padding: 4px 0;"><strong>Date: ${formatDate(date)}</strong></p>
                    </div>
                  </div>
                </body>
              </html>`,
    };

    return await sendMail(message);
};

const sendReceiptToMail = async (Payload: any) => {
    const {
        saleRef,
        createdAt,
        staff: { role, firstName: staffFirstName, lastName: staffLastName },
        paymentMethods,
        customer,
        items,
        amount,
        businessRef,
        tax,
        discountAmount,
        deliveryDetails,
        email: recipientEmail,
    } = Payload;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const Items = () => {
        return items
            .map((data: any) => {
                const itemTotal = data.price * data.quantity;
                return `
      <tr style="border-bottom: 1px solid #DCDCDD;">
        <td style="padding: 0.5rem; text-align: left; text-transform: capitalize;">${
            data.name
        }</td>
        <td style="padding: 0.5rem; text-align: center;">${data.quantity}</td>
          <td style="padding: 0.5rem; text-align: right;"> ${data.price}</td>
        <td style="padding: 0.5rem; text-align: right;">${
            currency?.symbol
        } ${itemTotal.toFixed(2)}</td>
      </tr>`;
            })
            .join('');
    };

    const settings = await Settings.findOne({ businessRef }).lean().exec();
    if (!settings) return false;

    const { logo, businessName, currency, email } = settings;

    const receiptSettings = await ReceiptSettings.findOne({ businessRef })
        .lean()
        .exec();

    const message = {
        from: SENDER,
        to: recipientEmail,
        subject: `${businessName} Sales Receipt`,
        html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Receipt</title>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
          <style>
            .main-cont {
              margin: 0 auto;
              padding: 0;
              font-family: 'Poppins', sans-serif;
              background-color: #F7F8FB;
            }
            .receipt-container {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color:white; 
              border-radius: 12px;
            }
            .receipt-header {
              text-align: center;
              padding: 10px 0;
              margin-bottom: 5px;
            }
            .receipt-header img {
              width: 100%;
              max-width: 150px;
            }
            .receipt-header p {
              margin: 5px 0;
            }
            .receipt-header .store-name {
              font-weight: 600;
              color: #474747;
              font-size: 16px;
              margin: 20px 0;
              padding: 6px 12px;
              border-left: 5px solid #39669E;
              border-right: 5px solid #368FFF;
            }
            .receipt-header .store-details {
              font-weight: 500;
              color: #474747;
              font-size: 16px;
              margin-top: 5px;
            }

            .receipt-header p {
              margin: 12px 0;
            }

            .receipt-header .contact-info {
              font-weight: 500;
              color: #474747;
              font-size: 16px;
            }
            .receipt-items {
              width: 100%;
              margin-bottom: 10px;
              border-collapse: collapse;
              color: #363636;
              font-size: 14px;
            }
            .receipt-items th, .receipt-items td {
              padding: 0.5rem;
              text-align: left;
            }
            .receipt-items th {
              font-weight: bold;
              text-align: center;
            }
            .receipt-item-justify {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              width: 100%;
              text-transform: capitalize;
            }
            .receipt-total {
              text-align: right;
              font-weight: bold;
              margin-top: 10px;
            }
            .receipt-footer {
              text-align: center;
              font-size: 12px;
              margin-top: 10px;
              color: #474747;
            }
          </style>
        </head>
        <body>
          <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
            <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
          </div>  

          <div class="main-cont">
          <div class="receipt-container">
            <div class="receipt-header">
              <img src="${logo}" alt="Store Logo" />
              
              <div style="text-align:center; margin: 20px 0;">
                <span style="
                  display:inline-block;
                  font-weight:600;
                  color:#474747;
                  font-size:16px;
                  padding:6px 12px;
                  border-left:5px solid #39669E;
                  border-right:5px solid #368FFF;
                ">
                ${businessName.toUpperCase()}
                </span>
              </div>
              
              <p class="store-details">Address: ${receiptSettings?.address}</p>
              <p class="contact-info">Email: ${email}</p>
              <p class="contact-info">Phone: ${receiptSettings?.phone}</p>
            </div>

            <table class="receipt-items">
              <tbody>
                <tr>
                  <td colspan="2">Date</td>
                  <td colspan="2" style="text-align: right;">${formatDate(createdAt)}</td>
                </tr>
                <tr>
                  <td colspan="2">Receipt No</td>
                  <td colspan="2" style="text-align: right;">#${saleRef}</td>
                </tr>
                
                <tr style="text-transform: capitalize;">
                  <td colspan="2">${role}</td>
                  <td colspan="2" style="text-align: right;">${staffFirstName} ${staffLastName}</td>
                </tr>
                <tr>
                  <td colspan="2">Payment Method</td>
                  <td colspan="2" style="text-align: right; text-transform: capitalize;">${paymentMethods
                      ?.map((method: { type: string }) => method.type)
                      ?.join(', ')}
                  </td>
                </tr>
                <tr>
                  <td colspan="2">Customer</td>
                  <td colspan="2" style="text-align: right; text-transform: capitalize;">${
                      customer?.firstName
                          ? `${customer.firstName} ${customer.lastName}`
                          : 'Guest'
                  }
                  </td>
                </tr>
                <tr>
                  <td style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                  <td style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                  <td style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                  <td style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                </tr>
                <tr><td colspan="4" style="height: 15px;"></td></tr>
                <tr>
                  <th>Item Name</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
                ${Items()}
                
                <tr><td colspan="4" style="height: 15px;"></td></tr>
                <tr>
                  <td colspan="3">Sub-Total</td>
                  <td style="text-align: right;">${currency?.symbol} ${items
                      .reduce(
                          (
                              total: number,
                              item: { price: number; quantity: number }
                          ) => total + item.price * item.quantity,
                          0
                      )
                      .toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colspan="3">Tax</td>
                  <td style="text-align: right;">${tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3">Discount</td>
                  <td style="text-align: right;">${discountAmount.toFixed(2)}
                </td>
                </tr>
                <tr>
                  <td colspan='4' style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                </tr>
                <tr><td colspan="4" style="height: 15px;"></td></tr>
                <tr style="font-size: 16px;">
                  <td colspan="3">Grand Total:</td>
                  <td style="text-align: right;">${currency?.symbol} ${amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan='4' style="border-bottom: 6px dotted #39669E; padding: 5px 0;"></td>
                </tr>
                <tr><td colspan="4" style="height: 15px;"></td></tr>
              </tbody>
            </table>

            <div class="receipt-footer">
              <p>Thank you for shopping with us!</p>
            </div>
            
          </div>
          </div>
        </body>
      </html>`,
    };

    return await sendMail(message);
};

const sendInvoiceReceiptToMail = async (Payload: any) => {
    const {
        saleRef,
        createdAt,
        customer,
        items,
        amount,
        businessRef,
        tax,
        discountAmount,
        email: recipientEmail,
        status,
        invoicePayment,
        balance,
    } = Payload;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const Items = () => {
        return items
            .map((data: any) => {
                const itemTotal = data.price * data.quantity;
                return `
      <tr style="border-bottom: 1px dashed #000;">
        <td style="padding: 0.5rem; text-align: left; text-transform: capitalize;">${
            data.name
        }</td>
        <td style="padding: 0.5rem; text-align: center;">${data.quantity}</td>
          <td style="padding: 0.5rem; text-align: right;"> ${data.price}</td>
        <td style="padding: 0.5rem; text-align: right;">${
            currency?.symbol
        } ${itemTotal.toFixed(2)}</td>
      </tr>`;
            })
            .join('');
    };

    const settings = await Settings.findOne({ businessRef }).lean().exec();
    if (!settings) return false;

    const { logo, businessName, currency, email, location } = settings;

    const receiptSettings = await ReceiptSettings.findOne({ businessRef })
        .lean()
        .exec();

    const message = {
        from: SENDER,
        to: recipientEmail,
        subject: `${businessName} Sales Invoice`,
        html: `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Invoice Receipt</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
            <style>
            body {
              margin:0; 
              padding:0;
              font-family: 'Poppins', sans-serif; 
              border:0.5px solid #e9edf8;
              background-color: #F7F8FB;
              font-size: 14px;
            }

            .all {
              width: 100%;
              overflow: hidden;
              background-color: #F7F8FB;
            }

            .cont {
              background-color: #F7F8FB; 
              padding:20px;
            }

            .logo-cont {
              display: flex; 
              justify-content: center; 
              margin:0 auto; 
              text-align:center; 
              margin-bottom:20px; 
              margin-top:40px;
            }

            .logo {
              overflow: hidden; 
              border-radius: 8px; 
              display: flex; 
              justify-content: center; 
              margin:0 auto; 
              text-align:center;
            }

            .main {
              padding:20px; 
              background-color:white; 
              border-radius:12px;
              max-width:600px;
              margin:0 auto;
            }

            .main p, .details p {
              margin: 0; 
              padding: 0;
            }

            .details {
              display: flex;
              justify-content: space-between;
              margin: 0;
            }

            .info {
            margin: 20px 0;
            }

            .invoice-details {
              text-align: right;
            }

            .customer-details, .supplier-details {
              width: 48%; 
              background-color: #A2BCFD33;
              padding: 0 0 10px 0;
            }

            .customer-details {
              margin-left: 6px;
            }

            .supplier-details {
              margin-right: 6px;
            }

            .customer-details h2, .supplier-details h2 {
              color: white;
              margin: 0;
              margin-bottom: 10px;
              padding: 4px 0;
              text-align: center;
              background-color: #368FFF;
              font-size: 14px;
              border-radius: 6px;
            }

            table {
              margin-top: 20px;
              border-collapse: collapse; 
              font-family: 'Poppins', sans-serif; 
              font-size:14px; 
              text-align:left;
            }

            thead tr {
              border: 1px solid #368FFF;
              color: #368FFF;
            }

            thead tr th {
              text-align: center;
              font-weight: 500;
            }

            tbody tr {
              border: 1px solid #DCDCDD;
            }

            tbody tr td {
              padding: 8px;
              text-align: center;
            }
          </style>
</head>
<body>
  <div class="all">
    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
  </div>
  <div class="cont">
    <div class="logo-cont">
      <div class="logo">
        <img style="width:100px; height:100%;" src="${logo}" alt="logo" />
      </div>
    </div>
    <div class="main" style="max-width:600px; margin:0 auto;">
      <div class="info">
        <h1 style="font-weight:500; margin-bottom:10px;">Sales Invoice</h1>
        <p><strong>Invoice No:</strong> #${saleRef}</p>
        <p><strong>Date:</strong> ${formatDate(createdAt)}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
      <div class="details">
        <div class="supplier-details">
          <h2>Supplier</h2>
          <div style="padding: 0 4px;">
            <p><strong>${businessName}</strong></p>
            <p>${receiptSettings?.address || location?.address}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${receiptSettings?.phone}</p>
          </div>
        </div>

        <div class="customer-details">
          <h2>Customer Details</h2>
          <div style="padding: 0 4px;">
            <p><strong>${
                customer?.firstName
                    ? `${customer.firstName} ${customer.lastName}`
                    : 'Guest'
            } </strong>
            </p>
            <p>${customer?.address || 'N/A'}</p>
            <p>Phone: ${customer.phone || 'N/A'}</p>
            <p>Email: ${recipientEmail || 'N/A'}</p>
          </div>
        </div>
      </div>  

      <table width="100%" cellpadding="8" cellspacing="0" style="max-width:600px; margin:20px auto; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding:8px; text-align:center; border-top-left-radius:6px; border-bottom-left-radius:6px;">S/N</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th style="padding:8px; text-align:center; border-top-right-radius:6px; border-bottom-right-radius:6px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items
              .map(
                  (item: any, index: any) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${currency?.symbol} ${item.price.toFixed(2)}</td>
                <td>${currency?.symbol} ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          <tr>
            <td></td>
            <td></td>
            <td style="color: white">.</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Sub-Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${currency?.symbol} ${items
                .reduce(
                    (total: any, item: any) =>
                        total + item.price * item.quantity,
                    0
                )
                .toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>Tax</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${currency?.symbol} ${tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${currency?.symbol} ${discountAmount.toFixed(2)}</td>
          </tr>
          <tr class="total-row" style="color: #368FFF; font-size: 16px;">
            <td>Grand Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${currency?.symbol} ${amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 20px;">
        <p style="font-weight: 600; margin-left: 20px;">Previous Payment Details</p>
        <table width="100%" cellpadding="8" cellspacing="0" style="margin: 0;">
          <thead>
            <tr>
              <th>Amount Paid</th>
              <th>Payment Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${invoicePayment
                .map(
                    (data: any) => `
            <tr>
              <td>${currency?.symbol} ${data.amountPaid.toFixed(2)}</td>
              <td>${data.paymentMethods
                  ?.map((method: any) => method.type)
                  .join(', ')}
              </td>
              <td>${formatDate(data.createdAt)}</td>
            </tr>
            `
                )
                .join('')}
            <tr class="total-row" style="color: #368FFF; font-size: 16px;">
              <td>Balance</td>
              <td></td>
              <td>${currency?.symbol} ${balance.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <p>${
            receiptSettings?.message ||
            'Thank you for shopping with us, Product bought in good condition cannot be returned.'
        }</p>
      </div>
    </div>
  </div>
</div>
</body>
</html>`,
    };

    return await sendMail(message);
};

const sendPurchaseReceiptToMail = async (Payload: any) => {
    const {
        purchaseRef,
        createdAt,
        supplier,
        destination,
        items,
        amount,
        businessRef,
        discount,
        shippingFee,
        email: recipientEmail,
    } = Payload;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const Items = () => {
        return items
            .map((data: any) => {
                const itemTotal = data.price * data.quantity;
                return `
      <tr style="border-bottom: 1px solid #DCDCDD;">
        <td style="padding: 0.5rem; text-align: left; text-transform: capitalize;">${
            data.name
        }</td>
        <td style="padding: 0.5rem; text-align: center;">${data.quantity}</td>
          <td style="padding: 0.5rem; text-align: right;"> ${data.price}</td>
        <td style="padding: 0.5rem; text-align: right;">${
            currency?.symbol
        } ${itemTotal.toFixed(2)}</td>
      </tr>`;
            })
            .join('');
    };

    const settings = await Settings.findOne({ businessRef }).lean().exec();
    if (!settings) return false;

    const { logo, businessName, currency, email } = settings;

    const receiptSettings = await ReceiptSettings.findOne({ businessRef })
        .lean()
        .exec();

    const message = {
        from: SENDER,
        to: recipientEmail,
        subject: `${businessName} Sales Receipt`,
        html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Receipt</title>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
          <style>
            .main-cont {
              margin: 0 auto;
              padding: 0;
              font-family: 'Poppins', sans-serif;
              background-color: #F7F8FB;
            }
            .receipt-container {
              width: 100%;
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color:white; 
              border-radius: 12px;
            }
            .receipt-header {
              text-align: center;
              padding: 10px 0;
              margin-bottom: 5px;
            }
            .receipt-header img {
              width: 100%;
              max-width: 150px;
            }
            .receipt-header p {
              margin: 5px 0;
            }
            .receipt-header .store-name {
              font-weight: 600;
              color: #474747;
              font-size: 16px;
              margin: 20px 0;
              padding: 6px 12px;
              border-left: 5px solid #39669E;
              border-right: 5px solid #368FFF;
            }
            .receipt-header .store-details {
              font-weight: 500;
              color: #474747;
              font-size: 16px;
              margin-top: 5px;
            }

            .receipt-header p {
              margin: 12px 0;
            }

            .receipt-header .contact-info {
              font-weight: 500;
              color: #474747;
              font-size: 16px;
            }
            .receipt-items {
              width: 100%;
              margin-bottom: 10px;
              border-collapse: collapse;
              color: #363636;
              font-size: 14px;
            }
            .receipt-items th, .receipt-items td {
              padding: 0.5rem;
              text-align: left;
            }
            .receipt-items th {
              font-weight: bold;
              text-align: center;
            }
            .receipt-item-justify {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              width: 100%;
              text-transform: capitalize;
            }
            .receipt-total {
              text-align: right;
              font-weight: bold;
              margin-top: 10px;
            }
            .receipt-footer {
              text-align: center;
              font-size: 12px;
              margin-top: 10px;
              color: #474747;
            }
          </style>
        </head>
        <body>
          <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
            <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
          </div>

          <div class="main-cont">
          <div class="receipt-container">
            <div class="receipt-header">
              <img src="${logo}" alt="Store Logo" />

              <div style="text-align:center; margin: 20px 0;">
                <span style="
                  display:inline-block;
                  font-weight:600;
                  color:#474747;
                  font-size:16px;
                  padding:6px 12px;
                  border-left:5px solid #39669E;
                  border-right:5px solid #368FFF;
                ">
                ${businessName.toUpperCase()}
                </span>
              </div>


              <p class="store-details">Address: ${receiptSettings?.address}</p>
              <p class="contact-info">Email: ${email}</p>
              <p class="contact-info">Phone: ${receiptSettings?.phone}</p>
            </div>

            <table class="receipt-items">
              <tbody>
                <tr>
                  <td colspan="4" style="text-align: center; font-weight: bold;">Receipt Details</td>
                </tr>
                <tr>
                  <td colspan="2" style="font-weight: 700;">Receipt No:</td>
                  <td colspan="2" style="text-align: right;">#${purchaseRef}</td>
                </tr>
                <tr>
                  <td colspan="2">Date:</td>
                  <td colspan="2" style="text-align: right;">${formatDate(
                      createdAt
                  )}</td>
                </tr>
                <tr style="text-transform: capitalize;">
                  <td colspan="2">Supplier:</td>
                  <td colspan="2" style="text-align: right;">${
                      supplier?.name || supplier?.company
                  }</td>
                </tr>
                <tr>
                  <td colspan="2">Destination:</td>
                  <td colspan="2" style="text-align: right; text-transform: capitalize;">${destination}</td>
                </tr>
                <tr>
                  <td colspan="4" style="border-bottom: 1px dashed #000; padding: 5px 0;"></td>
                </tr>
                <tr><td colspan="4" style="height: 15px;"></td></tr>
                <tr>
                  <th>Item Name</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
                ${Items()}

                <tr><td colspan="4" style="height: 15px;"></td></tr>
                <tr>
                  <td colspan="3" style="font-weight: 700;">Sub-Total</td>
                  <td style="text-align: right;">${currency?.symbol} ${items
                      .reduce(
                          (
                              total: number,
                              item: { price: number; quantity: number }
                          ) => total + item.price * item.quantity,
                          0
                      )
                      .toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3">Shipping Fee</td>
                  <td style="text-align: right;">${shippingFee}</td>
                </tr>
                <tr>
                  <td colspan="3">Discount</td>
                  <td style="text-align: right;">${discount}</td>
                </tr>
                <tr>
                  <td colspan="4" style="border-bottom: 1px dashed #000; padding: 5px 0;"></td>
                </tr>
                <tr style="font-weight: 700;">
                  <td colspan="3">Grand Total:</td>
                  <td style="text-align: right;">${
                      currency?.symbol
                  } ${amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="4" style="border-bottom: 1px dashed #000; padding: 5px 0;"></td>
                </tr>
              </tbody>
            </table>

            <div class="receipt-footer">
              <p>Thank you for shopping with us!</p>
            </div>
          </div>
        </body>
      </html>`,
    };

    return await sendMail(message);
};

const lowStockNotification = async (Payload: any) => {
    const {
        businessSettings: { businessName, email },
        products,
    } = Payload;

    // Row Data
    let rowsTemplate = '';
    products.forEach(
        (product: { name: any; quantity: number }, idx: number) => {
            rowsTemplate += `<tr style="border: 1px solid #DCDCDD;">
        <td style="padding:8px; text-align:center;">${idx + 1}</td>
        <td style="padding:8px; text-align:center;">${product.name}</td>
        <td style="padding:8px; text-align:center;">${
            product?.quantity || 'unknown'
        }</td>
      </tr>`;
        }
    );

    // Now construct the email body
    const message = {
        from: SENDER,
        to: email,
        subject: `Low Stock Notification for ${businessName}`,
        html: `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Low Stock Notification - One Flare</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                  <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                  </div>
                  <div style="background-color:#F7F8FB; padding:20px;">
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px;">
                        <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg"
                          alt="logo"
                        />
                      </div>
                    </div>
                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Low Stock Alert</h1>
                      <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${businessName}</h2>
                      <p>Just a quick heads up - The stock for the following products have dropped below your set limit</p>
                      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: 'Poppins', sans-serif; font-size:14px; text-align:left;">
                        <thead>
                          <tr style="background-color:#368FFF; color:#ffffff;">
                            <th style="padding:8px; text-align:center; border-top-left-radius:6px; border-bottom-left-radius:6px;">S/N</th>
                            <th style="padding:8px; text-align:center;">Name</th>
                            <th style="padding:8px; text-align:center; border-top-right-radius:6px; border-bottom-right-radius:6px;">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${rowsTemplate}
                        </tbody>
                      </table>
                    </div>
                  </body>
                </html>`,
    };

    return await sendMail(message);
};

const productExpiryNotification = async (Payload: any) => {
    const {
        businessSettings: { businessName, email },
        products,
    } = Payload ?? {};

    // Row Data
    let rowsTemplate = '';
    products.forEach(
        (product: { name: string; expiryDate: Date }, idx: number) => {
            rowsTemplate += `<tr style="border: 1px solid #DCDCDD;">
          <td style="padding:8px; text-align:center;">${idx + 1}</td>
          <td style="padding:8px; text-align:center;">${product.name}</td>
          <td style="padding:8px; text-align:center;">${
              product.expiryDate || 'unknown'
          }</td>
        </tr>`;
        }
    );

    // Now construct the email body
    const message = {
        from: SENDER,
        to: email,
        subject: `Products Expiration for ${businessName}`,
        html: `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Products Expiration - One Flare</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
              <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                  <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                </div>
                <div style="background-color:#F7F8FB; padding:20px;">
                  <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                    <div style="overflow: hidden; border-radius: 8px;">
                      <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg"
                        alt="logo"
                      />
                    </div>
                  </div>
                  <div style="padding:20px; background-color:white; border-radius:12px;">
                    <h1 style="font-weight:500; margin-bottom:10px;">Product Expiry Alert</h1>
                    <h2 style="font-weight:500; color:#368FFF; margin-top:0;">Hello, ${businessName}</h2>
                    <p>Just a quick heads up - The following products are nearing their expiration</p>
                    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: 'Poppins', sans-serif; font-size:14px; text-align:left;">
                      <thead>
                        <tr style="background-color:#368FFF; color:#ffffff;">
                          <th style="padding:8px; text-align:center; border-top-left-radius:6px; border-bottom-left-radius:6px;">S/N</th>
                          <th style="padding:8px; text-align:center;">Name</th>
                          <th style="padding:8px; text-align:center; border-top-right-radius:6px; border-bottom-right-radius:6px;">Expiration</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rowsTemplate}
                      </tbody>
                    </table>
                  </div>
                </body>
              </html>`,
    };

    return await sendMail(message);
};

const subscriptionExpirationNotification = async ({ Payload }: any) => {
    const {
        business: { businessName, email },
        subscription: { price, expires, name, curremcy },
    } = Payload;

    // Row Data
    let rowsTemplate = `<tr><td>${name}</td><td>${expires}</td><td>${price}</td></tr>`;

    // Now construct the email body
    const message = {
        from: SENDER,
        to: email,
        subject: `Subscription Expiration for ${businessName}`,
        html: `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                  <meta charset="UTF-8">
                  <title>Subscription Expiration - One Flare</title>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                </head>
                <body style="margin:0; padding:0; font-family: 'Poppins', sans-serif; background-color:#F7F8FB;">
                  <div style="width:100%; overflow: hidden; background-color: #F7F8FB;">
                    <img style="width: 100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Group%204%20%281%29.png" />
                  </div>
                  <div style="background-color:#F7F8FB; padding:20px;">
                    <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px;">
                        <img style="width:100px; height:100%;" src="https://i.ibb.co/51RvsnM/oneflare-white.jpg"
                          alt="logo"
                        />
                      </div>
                    </div>

                    <div style="padding:20px; background-color:white; border-radius:12px;">
                      <h1 style="font-weight:500; margin-bottom:10px;">Subscription Expiration</h1>
                      <p style="color: #363636"><strong>Details:</strong></p>
                      <p style="color: #363636; margin: 0;">Plan: ${name}</p>
                      <p style="color: #363636; margin: 0;">Amount: ${curremcy?.code}: ${price}</p>
                      <p style="color: #363636; margin: 0;">Expiration date: ${expires}</p>
                    </div>
                  </div>
                </body>
              </html>`,
    };

    return await sendMail(message);
};

const sendDailySalesReportMail = async (Payload: any) => {
    const { businessName, logo, email, todaySalesObject } = Payload;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const message = {
        from: SENDER,
        to: email,
        subject: `${businessName} Daily Sales Report`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily Sales Report</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#F7F8FB;">
  
  <div style="max-width:600px; margin:0 auto; padding:20px; background:#fff;">

    <div style="text-align:center; margin:40px 0 20px;">
      <img src="${logo || 'https://i.ibb.co/51RvsnM/oneflare-white.jpg'}" alt="logo" style="width:100px; height:auto; border-radius:8px;" />
    </div>

    <h1 style="margin:0 0 10px; font-weight:500;">Your Daily Report</h1>
    <h2 style="margin:0 0 20px; font-weight:500; color:#368FFF;">${formattedDate}</h2>
    <p style="margin:4px 0;">Hello ${businessName},</p>
    <p style="margin:0 0 20px;">Here is a breakdown of how you performed Today.</p>
    
    <div style="background-color:#F2F9FF; border-radius:12px; padding:20px 30px; margin:40px 0;">
      <p style="margin:0;">Today's profit:</p>
      <h2 style="margin:5px 0;">NGN ${todaySalesObject.netProfit || 0}</h2>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px; margin-right: 20px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Sales Count</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.salesCount || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Sales Transactions</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.totalTransactions || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px; margin-right: 20px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Expenses</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.todayExpenses || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Expenses Amount</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.totalExpenses || 0}</h3>
      </div>
    </div>


     <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px; margin-right: 20px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Reservations</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.todayReservations || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Profit</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.totalProfit || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px; margin-right: 20px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Loss</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.totalLoss || 0}</h3>
      </div>
    </div>

    <div style="display:inline-block; width:45%; vertical-align:top; margin-bottom:30px;">
      <div style="background-color:#F2F9FF; padding: 20px 10px; border-top-left-radius:20px; border-top-right-radius:20px; color:#39669E;">
        <p style="margin:0;">Total Net Profit</p>
      </div>
      <div style="background:linear-gradient(to right,#39669E,#368FFF); padding: 34px 10px; border-bottom-left-radius:20px; color:#fff;">
        <h3 style="margin:0;">${todaySalesObject?.totalProfit || 0}</h3>
      </div>
    </div>
  </div>
</body>
</html>
  `,
    };

    return await sendMail(message);
};

const sendMonthlySalesReportMail = async (Payload: any) => {
    const {
        businessName,
        email,
        currentMetrics,
        previousMetrics,
        analysis,
        month,
        currency,
        logo,
    } = Payload;

    const performanceText =
        analysis.salesGrowth > 0
            ? `Yayyy, your sales increased by ${analysis.salesGrowth}%, You can do more next month.`
            : `Oops! Sales dipped by ${analysis.salesGrowth}% this month. No worries, you've got this! Let's aim higher next month.`;
    const formattedSaleAmount = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(currentMetrics.salesCount);

    const message = {
        from: SENDER,
        to: email,
        subject: `Monthly Sales Report - ${month} | ${businessName}`,
        html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Monthly Sales Report</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#F7F8FB;">

  <div style="max-width:600px; margin:0 auto; padding:20px; background:#fff;">

    <div style="text-align:center; margin:40px 0 20px;">
      <img src="${logo || 'https://i.ibb.co/51RvsnM/oneflare-white.jpg'}" alt="logo" style="width:100px; height:auto; border-radius:8px;" />
    </div>

    <h1 style="margin:0 0 10px; font-weight:600; color:#39669E; text-align:center;">Monthly Sales Report</h1>

    <h2 style="margin:20px 0 0; font-weight:500;">Hello ${businessName},</h2>
    <h3 style="margin: 10px 0 6px; font-weight:500;">Here is a breakdown of how you performed in <span style="color: #368FFF;">${month}</span></h3>

    <div style="background:#F2F9FF; border-radius:12px; padding:10px; margin-bottom:20px;">
      <p style="margin:0 0; font-size: 16px; font-weight: 600;">Total Sales</p>
      <p style="font-size: 18px;">${currency}${formattedSaleAmount} </p>
      <p>${performanceText}</p>
    </div>

    <div style="background:#F2F9FF; border-radius:12px; padding:20px; margin-bottom:20px;">
      <h3 style="margin:0 0 10px; color:#39669E;">Current Month Performance</h3>
      <p style="margin:5px 0;">Total Revenue: <strong>${currency}${currentMetrics.totalTransactions.toFixed(
          2
      )}</strong></p>
      <p style="margin:5px 0;">Net Profit: <strong>${currency}${currentMetrics.netProfit.toFixed(2)}</strong></p>
      <p style="margin:5px 0;">Average Sale Value: <strong>${currency}${currentMetrics.averageSaleValue.toFixed(
          2
      )}</strong></p>
    </div>

    <div style="background:#FFF5F5; border-radius:12px; padding:20px; margin-bottom:20px;">
      <h3 style="margin:0 0 10px; color:#E57373;">Previous Month Performance</h3>
      <p style="margin:5px 0;">Total Sales: <strong>${previousMetrics.salesCount}</strong></p>
      <p style="margin:5px 0;">Total Revenue: <strong>${currency}${previousMetrics.totalTransactions.toFixed(
          2
      )}</strong></p>
      <p style="margin:5px 0;">Net Profit: <strong>${currency}${previousMetrics.netProfit.toFixed(2)}</strong></p>
      <p style="margin:5px 0;">Average Sale Value: <strong>${currency}${previousMetrics.averageSaleValue.toFixed(
          2
      )}</strong></p>
    </div>

    <div style="background:#F9F9F9; border-radius:12px; padding:20px; margin-bottom:20px;">
      <h3 style="margin:0 0 10px; color:#39669E;">Performance Analysis</h3>
      <p style="margin:5px 0;">Sales Growth: <strong>${analysis.salesGrowth.toFixed(1)}%</strong></p>
      <p style="margin:5px 0;">Revenue Growth: <strong>${analysis.revenueGrowth.toFixed(1)}%</strong></p>
      <p style="margin:5px 0;">Profit Growth: <strong>${analysis.profitGrowth.toFixed(1)}%</strong></p>
    </div>

    <div style="background:#E8F5E9; border-radius:12px; padding:20px; margin-bottom:20px;">
      <h3 style="margin:0 0 10px; color:#388E3C;">Performance Review</h3>
      <p style="margin:5px 0;">${analysis.performance}</p>
    </div>

    <p style="margin-top:20px; font-size:12px; text-align:center; color:#999;">
      Thank you for using our service.
    </p>

  </div>
</body>
</html>
  `,
    };

    return await sendMail(message);
};

const sendAdminNotification = async (payload: any) => {
    const { type, subject, data } = payload;
    const adminEmail = process.env.ADMIN_EMAIL || 'oneflaretech@gmail.com';
    const SENDER = process.env.SENDER || 'help@oneflaretech.com';

    const formatDate = (date: Date): string => {
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const message = {
        from: SENDER,
        to: adminEmail,
        subject: subject,
        html: `
    <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8">
        <title>Failed Bank Transfer Alert</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
      </head>

<body style="margin:0; padding:0; font-family: 'Poppins', sans-serif;">
  <div style="display: flex; justify-content: center; margin:0 auto; text-align:center; margin-bottom:20px; margin-top:40px;">
                      <div style="overflow: hidden; border-radius: 8px; display: flex; justify-content: center; margin:0 auto; text-align:center;">
                        <img style="width:100px; height:100%;" src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Oneflare%20logo.jpg" alt="logo" />
                      </div>
                    </div>
      <div style="margin-top: 20px;">
        <h2 style="font-family: 'Poppins', sans-serif; font-weight:500; margin-bottom:10px;">${type}</h2>
      </div>
  
    <div class="container">
    <tr>
        
        <p>Alert: Bank Transfer Failed After Maximum Attempts</p>
      </tr>
    
    <table style="table-layout: fixed; width: 100%; margin: auto; padding: 0; border-spacing: 2px 10px;">
      <tbody>  
        <tr style="text-align: left; margin: 2px 0; background: linear-gradient(to right, #39669E, #368FFF);">
          <td style="padding: 14px; text-align: left; color: #363636;">Order Reference</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.orderReference}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background-color: #EBEDF0;">
          <td style="padding: 14px; text-align: left; color: #363636;">Business Reference</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.businessRef}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background: linear-gradient(to right, #39669E, #368FFF);">
          <td style="padding: 14px; text-align: left; color: #363636;">Transfer Amount</td>
          <td style="padding: 14px; text-align: left; color: #363636;">&#8358; ${data.amount.toLocaleString()}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background-color: #EBEDF0;">
          <td style="padding: 14px; text-align: left; color: #363636;">Account Name</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.accountDetails.accountName}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background: linear-gradient(to right, #39669E, #368FFF);">
          <td style="padding: 14px; text-align: left; color: #363636;">Account Number</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.accountDetails.accountNumber}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background-color: #EBEDF0;">
          <td style="padding: 14px; text-align: left; color: #363636;">Bank Code</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.accountDetails.bankCode}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background: linear-gradient(to right, #39669E, #368FFF);">
          <td style="padding: 14px; text-align: left; color: #363636;">Failed Attempts</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.attempts}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background-color: #EBEDF0;">
          <td style="padding: 14px; text-align: left; color: #363636;">Last Attempt</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${formatDate(data.lastAttempt)}</td>
        </tr>
        <tr style="text-align: left; margin: 2px 0; background: linear-gradient(to right, #39669E, #368FFF);">
          <td style="padding: 14px; text-align: left; color: #363636;">Error Message</td>
          <td style="padding: 14px; text-align: left; color: #363636;">${data.error}</td>
        </tr>  
      </table>
          <br />
          <p>This bank transfer has failed after multiple retry attempts and requires manual intervention.</p>
          <p>Please review the details and process this transfer manually or investigate the issue.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.ADMIN_DASHBOARD_URL}/transfers/${
                data.orderReference
            }"><button style="border-radius: 6px; background-color: #368FFF; color: #fff; border: none; padding: 12px 24px; font-size: 16px; cursor: pointer;">
              View in Dashboard
            </button></a>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: center; padding: 15px; font-size: 12px; color: #666;">
          <p>This is an automated notification from the Oneflare Payment System.</p>
          <p>Please do not reply to this email.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `,
    };

    return await sendMail(message);
};

const subscribedToNewsletter = async ({
    businessRef,
    email,
}: {
    businessRef: string;
    email: string;
}) => {
    const settings = await Settings.findOne({ businessRef }).lean();
    if (!settings) return false;

    const weblink = await WebLink.findOne({
        businessRef,
        type: 'website',
    }).lean();
    if (!weblink) return false;

    const { logo, businessName } = settings;
    const socialLinks = weblink.customization?.socialMediaLinks || [];

    const iconSources: Record<string, string> = {
        facebook: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
        instagram: 'https://cdn-icons-png.flaticon.com/512/733/733558.png',
        twitter: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
        linkedin: 'https://cdn-icons-png.flaticon.com/512/733/733561.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    };

    const renderedSocialIcons = socialLinks
        .map((url: string) => {
            const lower = url.toLowerCase();
            const platform = Object.keys(iconSources).find(key =>
                lower.includes(key)
            );

            if (!platform) return '';

            return `
      <a href="${url}" target="_blank" title="${platform}">
        <img src="${iconSources[platform]}" alt="${platform}" style="width:24px;height:24px;margin:0 6px;" />
      </a>
    `;
        })
        .filter(Boolean)
        .join('');

    const message = {
        from: SENDER,
        to: email,
        subject: `🎉 Welcome to ${businessName} Newsletter!`,
        html: `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: 'Roboto', sans-serif; background-color: #f4f4f4; color: #333; padding: 0; margin: 0; }
            .container { max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .header { background-color: #004aad; color: white; text-align: center; padding: 20px; }
            .content { padding: 20px; text-align: left; }
            .btn { display: inline-block; margin-top: 20px; background-color: #004aad; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            a { color: white; text-decoration: none; }
            .socials { margin-top: 30px; }
            .footer { font-size: 0.85rem; color: #888; text-align: center; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${
                  logo ||
                  'https://res.cloudinary.com/payne/image/upload/v1648077277/oneflarepos/placeholder-image.png'
              }" alt="Business Logo" style="max-width: 120px;" />
              <h2>Welcome to ${businessName}!</h2>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for subscribing to our newsletter. You’ll now receive exclusive updates, offers, and insights directly in your inbox.</p>
              <div class="benefits">
                <div class="benefits-title">What to expect:</div>
                  <ul class="benefits-list">
                    <li>Exclusive promotions and discounts</li>
                    <li>Product updates and new releases</li>
                    <li>Helpful tips and best practices</li>
                    <li>Industry news and insights</li>
                  </ul>
              </div>
            
              <div class="message">
                <p>If you have any questions or suggestions, please don't hesitate to reach out to us. We're here to help!</p>
                <p>Best regards,<br>The ${businessName} Team</p>
              </div>
              
              <a href="${
                  weblink.url
              }" class="btn" style="color: white">Visit Our Website</a>
              <div class="socials">
                ${renderedSocialIcons}
              </div>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} ${businessName}. You’re receiving this email because you subscribed on our website.
            </div>
          </div>
        </body>
      </html>
    `,
    };

    return await sendMail(message);
};

interface EmailPayload {
    recipients: string[];
    title: string;
    message: string;
    businessName?: string;
    actionButton?: {
        text: string;
        url: string;
    };
    footerNote?: string;
}

const sendNotificationEmail = async (payload: EmailPayload) => {
    const { recipients, title, message, businessName = 'Oneflare' } = payload;

    const SENDER = process.env.SENDER || 'help@oneflaretech.com';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f6f8fb;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px 40px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header img {
      max-height: 60px;
    }

    h2 {
      color: #333333;
      margin-top: 10px;
    }

    p {
      font-size: 15px;
      color: #555555;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin-top: 25px;
    }

    .action-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://oneflarepos-images.nyc3.digitaloceanspaces.com/Oneflare%20logo.jpg" alt="${businessName} Logo" />
      <h2>${title}</h2>
    </div>

    <p>${message}</p>

    <div class="footer">
      <p>Powered by Oneflare team!</p>
    </div>
  </div>
</body>
</html>
`;

    const result = await sendMail({
        from: SENDER,
        to: recipients.join(','),
        subject: title,
        html,
    });

    return result;
};

export {
    sendPasswordResetMail,
    sendPasswordChangeMail,
    sendCreateCustomerMail,
    sendCouponPaymentMail,
    sendSubscriptionMail,
    sendSubscriptionUpdateMail,
    sendDailySalesReportMail,
    sendWelcomeMail,
    sendEmailConfirmationMail,
    sendEmailToCustomerUponSuccessfulReservation,
    sendFundCustomerAccountMail,
    sendReceiptToMail,
    sendInvoiceReceiptToMail,
    sendPurchaseReceiptToMail,
    lowStockNotification,
    productExpiryNotification,
    subscriptionExpirationNotification,
    sendMonthlySalesReportMail,
    sendAdminNotification,
    subscribedToNewsletter,
    sendNotificationEmail,
};
