import { MessageInfo } from "@protobuf-ts/runtime";
import { IQromaAppMessageTypesRegistry } from "./QromaAppMessageTypesRegistry";



export interface IQromaSiteAppContext {
  appMessageTypesRegistry: IQromaAppMessageTypesRegistry
}

const qromaSiteAppContext: IQromaSiteAppContext = {
  appMessageTypesRegistry: {
    getMessageTypeForName: (name: string) => {
      throw new Error("NOT IMPL - getMessageTypeForName()");
    },
    getAllMessageTypes() {
      throw new Error("NOT IMPL - getAllMessageTypes()");
    },
  },
};


export const useQromaSiteAppContext = (): IQromaSiteAppContext => {
  return {
    appMessageTypesRegistry: qromaSiteAppContext.appMessageTypesRegistry,
  }
}


export const registerQromaAppMessageTypes = (qromaAppMessageTypes: Record<string, MessageInfo>) => {
  // console.log("REGISTERING QROMA TYPES");
  // console.log(qromaAppMessageTypes)
  // console.log(qromaAppMessageTypes["QromaLightsConfig"])

  qromaSiteAppContext.appMessageTypesRegistry = {
    getMessageTypeForName: (name: string) => qromaAppMessageTypes[name],
    getAllMessageTypes: () => qromaAppMessageTypes,
  };
}