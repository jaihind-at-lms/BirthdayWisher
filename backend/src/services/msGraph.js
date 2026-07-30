import axios from "axios";
import { config } from "../config/env.js";

let accessToken = null;
let tokenExpiresAt = 0;

async function acquireToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const params = new URLSearchParams({
    client_id: config.msAuthClientId,
    client_secret: config.msAuthClientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await axios.post(
    `https://login.microsoftonline.com/${config.msAuthTenantId}/oauth2/v2.0/token`,
    params.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  accessToken = res.data.access_token;
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;
  return accessToken;
}

export async function uploadToDrive(buffer, fileName, folder) {
  const token = await acquireToken();
  const targetFolder = folder || config.msBirthdayCardsFolder;

  const uploadUrl = `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/${targetFolder}/${fileName}:/content`;
  await axios.put(uploadUrl, buffer, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/png",
    },
  });

  const linkRes = await axios.post(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/${targetFolder}/${fileName}:/createLink`,
    { type: "view", scope: "organization" },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return linkRes.data.link.webUrl;
}

export async function downloadFromDrive(fileName, folder) {
  const token = await acquireToken();
  const targetFolder = folder || config.msEmployeeImagesFolder;

  const res = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/${targetFolder}/${fileName}:/content`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(res.data);
}

export async function deleteFromDrive(fileName, folder) {
  const token = await acquireToken();
  const targetFolder = folder || config.msEmployeeImagesFolder;

  await axios.delete(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/${targetFolder}/${fileName}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
