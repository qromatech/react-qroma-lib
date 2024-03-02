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


export const concatenateUint8Arrays = (array1: Uint8Array, array2: Uint8Array): Uint8Array => {
  const concatenatedArray = new Uint8Array(array1.length + array2.length);
  concatenatedArray.set(array1, 0);
  concatenatedArray.set(array2, array1.length);
  return concatenatedArray;
}