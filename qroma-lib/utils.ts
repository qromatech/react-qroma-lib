import { Buffer } from 'buffer';


export const sleep = async (waitTimeInMs: number) =>
  new Promise(resolve => setTimeout(resolve, waitTimeInMs)
);


export const convertBase64ToBinary = (base64Content: string) => {
  return Buffer.from(base64Content, "base64");
}


export const convertBinaryToBase64 = (binaryContent) => {
  const b64 = Buffer.from(binaryContent).toString('base64');
  return b64;
}
