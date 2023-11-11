import { Buffer } from 'buffer';


export const sleep = async (waitTime: number) =>
  new Promise(resolve => setTimeout(resolve, waitTime)
);


export const convertBase64ToBinary = (base64Content: string) => {
  return Buffer.from(base64Content, "base64");
}


export const convertBinaryToBase64 = (binaryContent) => {
  const b64 = Buffer.from(binaryContent).toString('base64');
  return b64;
}
