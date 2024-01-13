import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { IQromaPbFieldComponentProps, QromaPbFieldComponent } from "./QromaPbFieldComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  fieldInParent: FieldInfo | null
  updateFieldInParentMessage: (fieldToReplace: FieldInfo, objectValue: JsonValue) => void
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
  

  const updateMessageField = (sourceField: FieldInfo, objectValue: JsonValue) => {
    console.log("QromaPbMessageComponent - UPDATE PARENT FOR " + sourceField.name);
    console.log(props)
    console.log(sourceField)
    console.log(objectValue);

    // if (sourceField.kind === 'message') {
    if (sourceField.kind === 'message') {
      console.log("HAVE MESSAGE UPDATE")
      const updateMessage = props.messageValueJsonData[sourceField.name];
      // updateMessage[sourceField.name] = objectValue
      console.log(updateMessage)
      props.updateFieldInParentMessage(sourceField, updateMessage);

    } else {
      if (props.fieldInParent.kind !== 'message') {
        console.log("HAVE MESSAGE VALUE UPDATE")
        console.log(sourceField)
        console.log(objectValue)
        props.updateFieldInParentMessage(sourceField, objectValue);
      } else {
        console.log("HAVE MESSAGE IN MESSAGE UPDATE")
        console.log(sourceField)
        console.log(objectValue)
        console.log(props.messageValueJsonData)

        const updateMessage = props.messageValueJsonData;
        updateMessage[sourceField.name] = objectValue
        console.log("NEW VLUAE")
        console.log(updateMessage)
        props.updateFieldInParentMessage(props.fieldInParent, updateMessage);
      }
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
