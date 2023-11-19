import { MessageInfo } from "@protobuf-ts/runtime";


export interface IQromaAppMessageTypesRegistry {
  getMessageTypeForName: (name: string) => MessageInfo | undefined
  getAllMessageTypes: () => Record<string, MessageInfo>
}


export const createQromaAppMessageTypesRegistry = (
  qromaAppMessageTypes: Record<string, MessageInfo>,
  setQromaAppMessageTypes: (updatedTypes: Record<string, MessageInfo>) => void
): IQromaAppMessageTypesRegistry => {
  
  const getMessageTypeForName = (name: string) => qromaAppMessageTypes[name];

  const getAllMessageTypes = () => qromaAppMessageTypes;

  return {
    getAllMessageTypes,
    getMessageTypeForName,
  };
}
