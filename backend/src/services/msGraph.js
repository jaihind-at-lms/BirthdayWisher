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

  const res = await axios.put(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/${folder}/${fileName}:/content`,
    buffer,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/png",
      },
    }
  );

  return res.data.id;
}

export async function getAllUploadedItems() {
  const token = await acquireToken();

  const allFiles = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/root:/employee-images:/children`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return allFiles.data
}

export async function getDownloadUrlByItemId(itemId) {
  const token = await acquireToken();

  const res = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/items/${itemId}?select=@microsoft.graph.downloadUrl`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data["@microsoft.graph.downloadUrl"];
}

export async function downloadByItemId(itemId) {
  const token = await acquireToken();

  const res = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/items/${itemId}/content`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(res.data);
}
export async function deleteByItemId(itemId) {
  const token = await acquireToken();

  await axios.delete(
    `https://graph.microsoft.com/v1.0/drives/${config.msDriveId}/items/${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
