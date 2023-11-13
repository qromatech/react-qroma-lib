import { MessageInfo } from "@protobuf-ts/runtime";
import { IQromaAppMessageTypesRegistry } from "./QromaAppMessageTypesRegistry";
import { IQromaAppWebSerial, IUseQromaAppWebSerialInputs, useQromaAppWebSerial } from "./webserial/QromaAppWebSerial";
import { IQromaWebSerial, IUseQromaWebSerialInputs, PortRequestResult, useQromaWebSerial } from "./webserial/QromaWebSerial";
import { IQromaCommWebSerial, IUseQromaCommWebSerialInputs, useQromaCommWebSerial } from "./webserial/QromaCommWebSerial";



export interface IQromaSiteAppContext {
  appMessageTypesRegistry: IQromaAppMessageTypesRegistry
  // qromaWebSerial: IQromaWebSerial | undefined
  // qromaWebSerialSubscription: IUseQromaWebSerialInputs
}

export interface IQromaSiteAppContextInternal extends IQromaSiteAppContext {
  // appMessageTypesRegistry: IQromaAppMessageTypesRegistry
  qromaWebSerial: IQromaWebSerial | undefined
  qromaWebSerialSubscribers: IUseQromaWebSerialInputs[]

}

const qromaSiteAppContext: IQromaSiteAppContextInternal = {
  appMessageTypesRegistry: {
    getMessageTypeForName: (name: string) => {
      throw new Error("NOT IMPL - getMessageTypeForName()");
    },
    getAllMessageTypes() {
      throw new Error("NOT IMPL - getAllMessageTypes()");
    },
  },
  qromaWebSerial: undefined,
  qromaWebSerialSubscribers: [],
};


export const useQromaSiteAppContext = (): IQromaSiteAppContext => {
  return {
    appMessageTypesRegistry: qromaSiteAppContext.appMessageTypesRegistry,
    // qromaWebSerial: qromaSiteAppContext.qromaWebSerial,
  }
}


export const registerQromaAppMessageTypes = (qromaAppMessageTypes: Record<string, MessageInfo>) => {
  qromaSiteAppContext.appMessageTypesRegistry = {
    getMessageTypeForName: (name: string) => qromaAppMessageTypes[name],
    getAllMessageTypes: () => qromaAppMessageTypes,
  };
}


export const subscribeToQromaWebSerial = (subscriber: IUseQromaWebSerialInputs) => {
  // if (!qromaSiteAppContext.qromaWebSerial) {
  //   throw new Error("No qromaWebSerial defined yet");
  // }

  qromaSiteAppContext.qromaWebSerialSubscribers.push(subscriber);
  console.log("subscribeToQromaWebSerial PUSH - " + qromaSiteAppContext.qromaWebSerialSubscribers.length);
  
  const removeSubscriberFunction = () => {
    qromaSiteAppContext.qromaWebSerialSubscribers = 
      qromaSiteAppContext.qromaWebSerialSubscribers.filter(s => s !== subscriber);
    console.log("subscribeToQromaWebSerial REMOVE - " + qromaSiteAppContext.qromaWebSerialSubscribers.length);
  }
  
  return removeSubscriberFunction;
}

export const useInitQromaWebSerial = (inputs: IUseQromaWebSerialInputs): IQromaWebSerial => 
{
  // if (qromaSiteAppContext.qromaWebSerial === undefined) {

  //   const webSerial = useQromaWebSerial(inputs);
  //   qromaSiteAppContext.qromaWebSerial = webSerial;
  // }
  // return qromaSiteAppContext.qromaWebSerial;

  const initSubscriber: IUseQromaWebSerialInputs = {
    onData: (data: Uint8Array): void => {
      console.log("INIT APP WS - onData()");
      inputs.onData(data);
      qromaSiteAppContext.qromaWebSerialSubscribers.forEach(s => s.onData(data));
    },
    onPortRequestResult: (requestResult: PortRequestResult): void => {
      console.log("INIT APP WS - onPortRequestResult()");
      console.log(requestResult.success);
      inputs.onPortRequestResult(requestResult);
      qromaSiteAppContext.qromaWebSerialSubscribers.forEach(s => 
        s.onPortRequestResult(requestResult));
    },
    onConnect: () => {
      console.log("INIT APP WS - onConnect()");
      if (inputs.onConnect !== undefined) {
        inputs.onConnect();
        qromaSiteAppContext.qromaWebSerialSubscribers.forEach(s => {
          if (s.onConnect) {
            s.onConnect();
          }
        });
      }
    },
    onDisconnect: () => {
      console.log("INIT APP WS - onDisconnect()");
      if (inputs.onDisconnect !== undefined) {
        inputs.onDisconnect();
        qromaSiteAppContext.qromaWebSerialSubscribers.forEach(s => {
          if (s.onDisconnect) {
            s.onDisconnect();
          }
        });
      }
    },
  };

  const qromaWebSerial = useQromaWebSerial(initSubscriber);

  // qromaSiteAppContext.qromaWebSerialSubscription = initSubscriber;
  qromaSiteAppContext.qromaWebSerialSubscribers.push(inputs);
  qromaSiteAppContext.qromaWebSerial = qromaWebSerial;

  return qromaSiteAppContext.qromaWebSerial;
}


export const useInitQromaCommWebSerial = (inputs: IUseQromaCommWebSerialInputs): IQromaCommWebSerial => 
{
  return useQromaCommWebSerial(inputs);
  // if (qromaSiteAppContext.qromaWebSerial === undefined) {
  //   const webSerial = useQromaCommWebSerial(inputs);
  //   qromaSiteAppContext.qromaWebSerial = webSerial;
  // }
  // return qromaSiteAppContext.qromaWebSerial;
}


export const useInitQromaAppWebSerial = 
  <TCommand extends object, TResponse extends object>
(inputs: IUseQromaAppWebSerialInputs<TCommand, TResponse>): IQromaAppWebSerial<TCommand> => 
{
  return useQromaAppWebSerial(inputs);
  // if (qromaSiteAppContext.qromaWebSerial === undefined) {
  //   const webSerial = useQromaAppWebSerial(inputs);
  //   qromaSiteAppContext.qromaWebSerial = webSerial;
  // }
  // return qromaSiteAppContext.qromaWebSerial;
}
