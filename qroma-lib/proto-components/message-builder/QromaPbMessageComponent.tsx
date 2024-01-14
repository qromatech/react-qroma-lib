import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { IQromaPbFieldComponentProps, QromaPbFieldComponent } from "./QromaPbFieldComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  fieldInParent: FieldInfo | null
  isFieldUsedAsOneof: boolean
  setFieldValueInParentMessage: (fieldToReplace: FieldInfo, objectValue: JsonValue) => void
  setActiveOneofFieldInParent: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
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

      props.setFieldValueInParentMessage(props.fieldInParent, newValueForField);
      return;
    }

    if (sourceField.kind === 'message') {
      if (sourceField.oneof === undefined) {
        console.log("HAVE MESSAGE UPDATE")
        const updateMessage = props.messageValueJsonData[sourceField.name];
        console.log(updateMessage)
        console.log(objectValue)
        props.setFieldValueInParentMessage(sourceField, updateMessage);
  
      } else {
        console.log("HAVE MESSAGE ONEOF UPDATE")
        props.setFieldValueInParentMessage(sourceField, objectValue);  
      }

    } else {
      if (props.fieldInParent.kind !== 'message') {
        console.log("HAVE MESSAGE VALUE UPDATE")
        console.log(sourceField)
        console.log(objectValue)
        props.setFieldValueInParentMessage(sourceField, objectValue);
      } else {
        console.log("HAVE MESSAGE IN MESSAGE UPDATE")
        console.log(sourceField)
        console.log(objectValue)
        console.log(props.messageValueJsonData)

        const updateMessage = props.messageValueJsonData;
        updateMessage[sourceField.name] = objectValue
        console.log("NEW VLUAE")
        console.log(updateMessage)
        props.setFieldValueInParentMessage(props.fieldInParent, updateMessage);
      }
    }
  }

  const setActiveOneofFieldInParent = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("PB MESSAGE COMPONENT - updateOneofFieldInParentMessage")
    console.log(props)
    console.log(oldActiveField)
    console.log(newActiveField)
    console.log(newFieldValue)

    // works for no arg commands
    if (props.fieldInParent.oneof === undefined) {
      console.log("SETTING AS VALUE")

      if (props.fieldInParent.kind === 'message') {
        const updateMessageValue = props.messageValueJsonData;
        updateMessageValue[newActiveField.name] = newFieldValue;
        delete updateMessageValue[oldActiveField.name];
        console.log(updateMessageValue)

        props.setFieldValueInParentMessage(props.fieldInParent, updateMessageValue);

      } else {
        props.setActiveOneofFieldInParent(oldActiveField, newActiveField, newFieldValue);
      }

    } else {
      const updateMessageValue = {
        [props.fieldInParent.name]: newFieldValue,
      }
      
      console.log("SETTING AS ONEOF")
      props.setFieldValueInParentMessage(props.fieldInParent, updateMessageValue);
    }
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
      setFieldValueInParentMessage: updateMessageField,
      setActiveOneofFieldInParent,
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
      <fieldset>
        {props.messageName} [{props.messageType.typeName}] +++
        <div style={{marginLeft: 20}}>
          {messageFieldComponents}
        </div>
      </fieldset>
    </div>
  )
}
