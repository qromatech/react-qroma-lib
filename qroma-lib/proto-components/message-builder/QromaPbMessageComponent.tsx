import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { IQromaPbFieldComponentProps, QromaPbFieldComponent } from "./QromaPbFieldComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  updateFieldInParentMessage: (objectKey: string, objectValue: JsonValue) => void
  updateOneofFieldInParentMessage: (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => void
}


export const QromaPbMessageComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

  console.log("RENDERING QromaPbMessageComponent (top)")
  console.log(props)

  if (props.messageValue === undefined) {
    console.log("UNDEFINED MESSAGE VALUE IN PB MESSAGE COMPONENT")
    console.log(props.messageName)
  }

  const fields = props.messageType.fields;
  
  console.log("RENDERING QromaPbMessageComponent - " + props.messageName)
  console.log(props.messageValue)
  

  const updateMessageField = (sourceField: FieldInfo, objectKey: string, objectValue: JsonValue) => {
    console.log("QromaPbMessageComponent - UPDATE PARENT FOR " + objectKey);
    console.log(props)
    console.log(sourceField)
    console.log(objectKey);
    console.log(objectValue);
    

    if (sourceField.kind === 'message') {
      const updateMessage = props.messageValueJsonData[objectKey];
      updateMessage[sourceField.name] = objectValue
      console.log("HAVE MESSAGE UPDATE")
      console.log(updateMessage)
      props.updateFieldInParentMessage(objectKey, updateMessage);

    } else {
      console.log("HAVE MESSAGE VALUE UPDATE")
      console.log(objectKey)
      console.log(objectValue)
      props.updateFieldInParentMessage(objectKey, objectValue);
    }

    // const updateMessage = props.messageValueJsonData[objectKey];
    // updateMessage[objectKey] = objectValue
    // console.log("HAVE MESSAGE UPDATE")
    // console.log(updateMessage)
    // props.updateFieldInParentMessage(objectKey, updateMessage);
  }

  const updateOneofFieldInParentMessage = (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => {
    console.log("PB MESSAGE COMPONENT - updateOneofFieldInParentMessage")
    console.log(props)
    console.log(fieldToReplace)
    console.log(newFieldOneofKind)
    console.log(newFieldValue)

    props.updateOneofFieldInParentMessage(fieldToReplace, newFieldOneofKind, newFieldValue);
  }

  // const renderedOneofFieldNames = new Set();
  const messageFieldComponents = [];

  fields.forEach(field => {
    if (field.oneof !== undefined) {
      // if (renderedOneofFieldNames.has(field.oneof)) {
      //   console.log("IGNORING " + field.oneof + " [" + field.name + "]")
      //   return;
      // }
      // renderedOneofFieldNames.add(field.oneof);
      // if (Object.keys(props.messageValueJsonData).find(field.name)) {
      if (props.messageValueJsonData[field.name] === undefined) {
        return;
      }
    }

    console.log("CREATING ONEOF FIELD COMPONENT FOR MESSAGE - " + field.name)
    const fieldComponentProps: IQromaPbFieldComponentProps = {
      field,
      messageValue: props.messageValue,
      messageValueJsonData: props.messageValueJsonData,
      containingMessageFields: fields,
      updateFieldInParentMessage: updateMessageField,
      updateOneofFieldInParentMessage,
    };
    console.log(fieldComponentProps)

    const messageFieldComponent = 
      <QromaPbFieldComponent
        key={field.name}
        {...fieldComponentProps}
        />;
        messageFieldComponents.push(messageFieldComponent);
  });


  return (
    <div>
      {props.messageName} [{props.messageType.typeName}] +++
      <fieldset>
        {messageFieldComponents}
      </fieldset>
    </div>
  )
}
