import { FieldInfo, IMessageType, JsonObject, ScalarType } from "@protobuf-ts/runtime";


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
      if (firstEnumChoice === undefined) {
        firstEnumChoice = parseInt(r);
      }
    }
    
    return firstEnumChoice;
  }

  if (field.kind === 'message') {
    const messageValue = createPopulatedMessageObject(field.T());
    return messageValue;
  }

  throw Error("Unsupported field kind: " + field.kind);
}

export const createPopulatedMessageObject = <T extends object>(messageType: IMessageType<T>): JsonObject => {
  const initValue = {};

  const fields = messageType.fields;

  const oneofsAdded: string[] = [];

  fields.forEach(field => {
    if (field.oneof !== undefined) {
      if (oneofsAdded.find(x => x === field.oneof) === undefined) {
        if (Object.keys(initValue).find(x => x === field.name) === undefined) {
          const subValue = createValueForField(field)

          initValue[field.name] = subValue;
        }
        oneofsAdded.push(field.oneof)
      } else {
        // console.log("SKIPPED ADDING ENTRY FOR ONE OF: " + field.oneof + " [" + field.name + "]")
      }
    } else {
      const fieldValue = createValueForField(field);
      initValue[field.name] = fieldValue;
    }
  })
  
  return initValue;
}


export const getScalarValueFromParentObject = (field: FieldInfo, parentObject: any) => {
  return parentObject[field.name];
}


export const isFieldOneof = (field: FieldInfo) => {
  return field.oneof !== undefined;
}