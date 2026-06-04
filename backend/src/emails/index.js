import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./client.js";
import { renderWelcomeEmail } from "./templates/welcome.js";
import { renderBirthdayEmail } from "./templates/birthday.js";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EMAIL_ASSETS_DIR = resolve(__dirname, "assets");

const WELCOME_ASSETS = [
  {
    filename: "Topheader.png",
    cid: "headerImage",
  },
  {
    filename: "bookLogo.png",
    cid: "facebookIcon",
  },
  {
    filename: "LinkedinLogo.png",
    cid: "linkedinIcon",
  },
];

const loadWelcomeAssets = async () => {
  return WELCOME_ASSETS.map((asset) => {
    const localPath = resolve(EMAIL_ASSETS_DIR, asset.filename);
    return {
      ...asset,
      localPath: existsSync(localPath) ? localPath : null,
    };
  });
};

export async function sendWelcomeEmail({
  title,
  name,
  email,
  department,
  designation,
  photoBuffer,
  welcomeTextLine1,
  welcomeTextLine2,
}) {
  const assets = await loadWelcomeAssets();
  const attachments = assets
    .filter((asset) => asset.localPath)
    .map((asset) => ({
      filename: asset.filename,
      content: readFileSync(asset.localPath),
      cid: asset.cid,
    }));

  if (photoBuffer) {
    attachments.push({
      filename: "profile-photo.png",
      content: photoBuffer,
      cid: "profilePhoto",
    });
  }

  const html = renderWelcomeEmail({
    name,
    title,
    designation,
    team: department,
    description: welcomeTextLine1,
    hobbies: welcomeTextLine2,
    photoCid: photoBuffer ? "profilePhoto" : null,
    headerSrc: "cid:headerImage",
    facebookSrc: "cid:facebookIcon",
    linkedinSrc: "cid:linkedinIcon",
  });

  await sendMail({
    to: config.emailTo,
    cc: email,
    subject: `Welcoming ${title}. ${name}`,
    html,
    attachments: attachments.length ? attachments : undefined,
  });
}

export async function sendBirthdayEmail({ name, email, cardBuffer }) {
  const cid = "birthdayCard";
  const html = renderBirthdayEmail({ name, cardCid: cid });

  await sendMail({
    to: config.emailTo,
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
