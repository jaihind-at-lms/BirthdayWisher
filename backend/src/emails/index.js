import { sendMail } from "./client.js";
import { renderWelcomeEmail } from "./templates/welcome.js";
import { renderBirthdayEmail } from "./templates/birthday.js";
import { config } from "../config/env.js";

export async function sendWelcomeEmail({
  title,
  name,
  email,
  department,
  designation,
  photoUrl,
  welcomeTextLine1,
  welcomeTextLine2,
}) {
  const html = renderWelcomeEmail({
    name,
    title,
    designation,
    team: department,
    description: welcomeTextLine1,
    hobbies: welcomeTextLine2,
    photoUrl,
  });

  await sendMail({
    to: config.welcomeEmailTo,
    cc: email,
    subject: `Welcoming ${title}. ${name}`,
    html,
  });
}

export async function sendBirthdayEmail({ name, email, cardBuffer }) {
  const cid = "birthdayCard";
  const html = renderBirthdayEmail({ name, cardCid: cid });

  await sendMail({
    to: config.welcomeEmailTo,
    cc: email,
    subject: `Happy Birthday, ${name}!`,
    html,
    attachments: [
      {
        filename: "birthday-card.png",
        content: cardBuffer,
        cid,
      },
    ],
  });
}
