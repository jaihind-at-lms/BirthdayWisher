import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

const accountName = config.azureStorageAccountName;
const accountKey = config.azureStorageAccountKey;
const containerName = config.azureStorageContainerName;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Upload a buffer to Azure Blob Storage.
 * @param {Buffer} buffer - File content
 * @param {string} fileName - File name (e.g. "123.png")
 * @param {string} folder - Virtual folder path (e.g. "employee-images")
 * @returns {string} The blob name (folder/fileName) used as identifier
 */
export async function uploadToBlob(buffer, fileName, folder) {
  const blobName = `${folder}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: "image/png" },
  });

  logger.info(`Uploaded blob: ${blobName}`);
  return blobName;
}

/**
 * Download a blob by its name and return as Buffer.
 * @param {string} blobName - Full blob path (e.g. "employee-images/123.png")
 * @returns {Buffer}
 */
export async function downloadBlob(blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const response = await blockBlobClient.download(0);

  const chunks = [];
  for await (const chunk of response.readableStreamBody) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Get a public URL for a blob.
 * @param {string} blobName - Full blob path
 * @returns {string} The blob URL
 */
export function getBlobUrl(blobName) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
}

/**
 * List all blobs in a given folder (virtual directory).
 * @param {string} folder - Virtual folder prefix (e.g. "employee-images")
 * @returns {Array<{name: string, url: string}>}
 */
export async function listBlobs(folder) {
  const blobs = [];
  for await (const blob of containerClient.listBlobsFlat({ prefix: `${folder}/` })) {
    blobs.push({
      name: blob.name,
      url: getBlobUrl(blob.name),
    });
  }
  return blobs;
}

/**
 * Delete a blob by its name.
 * @param {string} blobName - Full blob path (e.g. "employee-images/123.png")
 */
export async function deleteBlob(blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
  logger.info(`Deleted blob: ${blobName}`);
}
