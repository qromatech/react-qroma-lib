import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { IQromaPbFieldComponentProps, QromaPbFieldComponent } from "./QromaPbFieldComponent"
import { createPopulatedMessageObject } from "./builder_utils"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  fieldInParent: FieldInfo | null
  isFieldUsedAsOneof: boolean
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

    if (props.isFieldUsedAsOneof) {
      const newValueForField = props.messageType.toJson(props.messageValue);

      console.log("PRE NEW ONEOF MESSAGE VALUE")
      console.log(newValueForField)

      newValueForField[sourceField.name] = objectValue;

      console.log("NEW ONEOF MESSAGE VALUE")
      console.log(newValueForField)

      props.updateFieldInParentMessage(props.fieldInParent, newValueForField);
      return;
    }

    if (sourceField.kind === 'message') {
      if (sourceField.oneof === undefined) {
        console.log("HAVE MESSAGE UPDATE")
        const updateMessage = props.messageValueJsonData[sourceField.name];
        console.log(updateMessage)
        props.updateFieldInParentMessage(sourceField, updateMessage);
  
      } else {
        console.log("HAVE MESSAGE ONEOF UPDATE")
        props.updateFieldInParentMessage(sourceField, objectValue);  
      }

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
  }

  const updateOneofFieldInParentMessage = (fieldToReplace: FieldInfo, newFieldOneofKind: string, newFieldValue: JsonValue) => {
    console.log("PB MESSAGE COMPONENT - updateOneofFieldInParentMessage")
    console.log(props)
    console.log(fieldToReplace)
    console.log(newFieldOneofKind)
    console.log(newFieldValue)

    props.updateOneofFieldInParentMessage(fieldToReplace, newFieldOneofKind, newFieldValue);
  }

  const messageFieldComponents = [];

  fields.forEach(field => {
    if (field.oneof !== undefined) {
      if (props.messageValueJsonData[field.name] === undefined) {
        return;
      }
      console.log("CREATING ONEOF FIELD COMPONENT FOR MESSAGE - " + field.name)
    }

    const fieldComponentProps: IQromaPbFieldComponentProps = {
      field,
      messageValue: props.messageValue,
      messageValueJsonData: props.messageValueJsonData,
      containingMessageFields: fields,
      updateFieldInParentMessage: updateMessageField,
      updateOneofFieldInParentMessage,
    };

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
