import { MessageInfo } from "@protobuf-ts/runtime";


let _initQromaAppMessageTypes: Record<string, MessageInfo> | undefined = undefined;


export const getInitQromaAppMessageTypes = (initQromaAppMessageTypes: Record<string, MessageInfo>) => {
  return {
    ...initQromaAppMessageTypes,
  };
}


export const registerQromaAppMessageTypes = (initQromaAppMessageTypes: Record<string, MessageInfo>) => {

  if (_initQromaAppMessageTypes !== undefined) {
    throw Error("Qroma App Message types have already been defined")
  }
  _initQromaAppMessageTypes = initQromaAppMessageTypes;
}