import { MessageInfo } from "@protobuf-ts/runtime";


export interface IQromaAppMessageTypesRegistry {
  getMessageTypeForName: (name: string) => MessageInfo | undefined
  getAllMessageTypes: () => Record<string, MessageInfo>
}