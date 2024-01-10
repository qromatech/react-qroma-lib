import { FieldInfo, IMessageType, ScalarType } from "@protobuf-ts/runtime";
import { OneofGroup } from "./defs";
import { MyAppCommand, NoArgCommands } from "./hello-qroma";


// export const createMessageInstanceWithDefaultValues = <T extends object>(messageType: IMessageType<T>) => {
export const createMessageInstanceWithDefaultValues = <T extends object>(messageType: IMessageType<T>) => {

  // const initJsonStr = '{"helloQromaRequest":{"name":"yay"}}';
  // const initObject = {helloQromaRequest:{name:"boy"}};
  // const initObject = {noArgCommand:'Nac_GetBoardDetailsRequest'};

  // const initObject = {noArgCommand:0};
  // const initObjectJsonStr = JSON.stringify(initObject);
  // const initValue = MyAppCommand.fromJsonString(initObjectJsonStr);
  
  
  const initValue = MyAppCommand.create();
  // initValue.command.oneofKind = 'helloQromaRequest';
  initValue.command = {
    oneofKind: 'helloQromaRequest',
    helloQromaRequest: {
      name: "yay"
    }
  };
  initValue.myAppBool = true;
  initValue.myAppInt = 123;
  initValue.myAppStr = "abc";
  initValue.myAppResponse = {
    success: true,
    message: "urkkk"
  }
  
  console.log(initValue)

  
  // const initValue = MyAppCommand.create();
  // // initValue.command.oneofKind = 'helloQromaRequest';
  // initValue.command = {
  //   oneofKind: 'noArgCommand',
  //   noArgCommand: NoArgCommands.Nac_GetBoardDetailsRequest,
  // };
  // console.log(initValue)

  console.log("INIT MESSAGE VALUE")
  console.log(initValue)
  return initValue;
}


const createValueForScalar = (scalarType: ScalarType) => {
  switch (scalarType) {
    case ScalarType.BOOL: 
      return false;
      break;
    case ScalarType.STRING:
      return "";
      break;
    case ScalarType.DOUBLE: 
    case ScalarType.FLOAT: 
      return 0.0;
      break;
    case ScalarType.INT64:
    case ScalarType.UINT64:
    case ScalarType.INT32:
    case ScalarType.FIXED64:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
    case ScalarType.SFIXED64:
    case ScalarType.SINT32:
    case ScalarType.SINT64:
      return 0;
      break;
    case ScalarType.BYTES:
      return [];
      break;
  }
}


export const createValueForField = (field: FieldInfo) => {
  if (field.kind === 'scalar') {
    return createValueForScalar(field.T);
  }

  if (field.kind === 'enum') {
    const enumValues = field.T()[1];
    let firstEnumChoice = undefined;

    for (var r in enumValues) {
      console.log(r)
      if (firstEnumChoice === undefined) {
        firstEnumChoice = parseInt(r);
      }
    }

    console.log("CREATING ENUM")
    console.log(field)
    console.log(enumValues)
    console.log(firstEnumChoice)

    return firstEnumChoice;
  }

  if (field.kind === 'message') {
    const messageValue = createPopulatedMessageObject(field.T());
    return messageValue;
  }

  throw Error("Unsupported field kind: " + field.kind);
}

export const createPopulatedMessageObject = <T extends object>(messageType: IMessageType<T>) => {
  const initValue = {};

  const fields = messageType.fields;

  console.log("IN createPopulatedMessageObject")
  console.log(fields);

  const oneofsAdded: string[] = [];

  fields.forEach(field => {
    if (field.oneof !== undefined) {
      if (oneofsAdded.find(x => x === field.oneof) === undefined) {
        if (Object.keys(initValue).find(x => x === field.name) === undefined) {
          console.log("HAVE TO ADD " + field.name)
          const subValue = createValueForField(field)
          initValue[field.oneof] = {
            oneofKind: field.name,
            [field.name]: subValue,
          }
        }
        oneofsAdded.push(field.oneof)
      }
    } else {
      initValue[field.name] = createValueForField(field);
    }
  })

  console.log("JUST BUILT INITIAL VALUE")
  console.log(initValue)
  
  return initValue;
}


// export const updateMessageOneofField = (messageValue: any, oneof: OneofGroup, oneofSelection: string) => {
//   console.log("PRE UPDATE MESSAGE ONEOF")
//   console.log(messageValue)
//   console.log(oneof);
//   console.log(oneofSelection)

//   let newOneofValue = undefined;

//   const newOneofField = oneof.oneofFields.find(f => f.name === oneofSelection);
//   if (newOneofField.kind === "message") {
//     newOneofValue = newOneofField.T().create();
//     // console.log(newOneofValue);

//   } else if (newOneofField.kind === "enum") {
//     const enumInfo = newOneofField.T();
//     const enumName = enumInfo[0];
//     const enumValues = enumInfo[1];
//     console.log(enumInfo);
//     for (const e in enumValues) {
//       newOneofValue = e;
//     }

//   } else if (newOneofField.kind === 'scalar') {
//     const scalarType = newOneofField.T;
//     newOneofValue = 0;
//   }

//   console.log("newOneofValue")
//   console.log(newOneofValue)

//   messageValue[oneof.oneofFieldName] = newOneofValue;

//   return messageValue;
// }


export const getScalarValueFromParentObject = (field: FieldInfo, parentObject: any) => {
  return parentObject[field.name];
}