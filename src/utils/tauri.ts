import { BinaryFileContents, writeBinaryFile } from '@tauri-apps/api/fs';
import { path, dialog } from '@tauri-apps/api';
import { getPDF, htmlToImg } from './chat';
import { Theme } from '@type/theme';

export function isTauri() {
  return window.__TAURI_IPC__ !== undefined;
}

export function stringToArrayBuffer(str: string): Uint8Array {
	const encoder = new TextEncoder();
  return encoder.encode(str);
}

export async function downloadFileInTauri(data: object | string | BinaryFileContents, defaultName: string, ext: `.${string}`)  {
  const basePath = await path.downloadDir();
  let selPath = await dialog.save({
    defaultPath: basePath,
  });
  if(!selPath) {
    console.info("user canceled downloadFileInTauri");
    return;
  }
  selPath = selPath.replace(/Untitled$/, defaultName);
  if(!selPath.split("/").at(-1)?.includes(".")) {
    selPath += ext;
  }
  let contents: BinaryFileContents;
  if(typeof data === "string") {
    contents = stringToArrayBuffer(data);
  } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    contents = data;
  } else {
    contents = stringToArrayBuffer(JSON.stringify(data));
  }
  await writeBinaryFile({ contents, path: selPath });
}

export async function htmlToImgInTauri(html: HTMLDivElement): Promise<Uint8Array>{
  const dataURL = await htmlToImg(html);
  // TODO: use atob seems not good enough because it seems deprecated. Here use stringToArrayBuffer not work, I don't have the energy to investigate it now.
  const binaryStr = atob(dataURL.replace(/^data:image\/\w+;base64,/, ''));
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

export async function downloadPDFInTauri(imageData: string, theme: Theme, fileName: string) {
    const pdf = getPDF(imageData, theme);
    // TODO: This is an inappropriate section of intrusive processing because I haven't found a suitable API
    const buffer = (pdf as any).__private__.output( "arraybuffer") as ArrayBuffer;
    return downloadFileInTauri(buffer, fileName, ".pdf");
}