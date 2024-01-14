import React from "react"
import { FieldInfo, JsonValue } from "@protobuf-ts/runtime"
import { QromaPbOneofComponent } from "./QromaPbOneofComponent";
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent";
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent";
import { QromaPbMessageComponent } from "./QromaPbMessageComponent";


export interface IQromaPbFieldComponentProps {
  field: FieldInfo
  messageValue: any
  messageValueJsonData: JsonValue
  containingMessageFields: readonly FieldInfo[]

  setFieldValueInParentMessage: (fieldToReplace: FieldInfo, objectValue: JsonValue) => void
  setActiveOneofFieldInParent: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}

export const QromaPbFieldComponent = (props: IQromaPbFieldComponentProps) => {

  const onScalarValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - SCALAR ON CHANGE");
    console.log(props)
    console.log(objectKey)
    console.log(newValue)
    
    props.setFieldValueInParentMessage(props.field, newValue);
  }


  const onEnumValueChange = (objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - ENUM ON CHANGE");
    
    props.setFieldValueInParentMessage(props.field, newValue);
  }


  const onMessageValueChange = (newValue: any) => {
    console.log("QromaPbFieldComponent - MESSAGE ON CHANGE");
    console.log(props)
    console.log(newValue)

    if (props.field.kind === 'message') {
      const updateMessage = props.messageValueJsonData[props.field.name];
      console.log("HAVE PB FIELD MESSAGE UPDATE")
      console.log(props.field)
      console.log(updateMessage)
      props.setFieldValueInParentMessage(props.field, updateMessage);

    } else {
      console.log("HAVE PB FIELD MESSAGE VALUE UPDATE")
      console.log(props.field.name)
      console.log(newValue)
      props.setFieldValueInParentMessage(props.field, newValue);
    }
  }

  
  const onPbOneofChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbFieldComponent - onPbOneofChange");
    console.log(objectKey)
    console.log(objectValue)

    props.setFieldValueInParentMessage(props.field, objectValue);
  }

  
  const setActiveOneofField = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("WEIRD TIME TO BE CALLING replaceMessageField() IN QromaPbFieldComponent")
    console.log(props)
    console.log(oldActiveField)
    console.log(newActiveField)
    console.log(newFieldValue)

    props.setActiveOneofFieldInParent(oldActiveField, newActiveField, newFieldValue);

    // if (props.field.oneof !== undefined) {
    //   const updateMessageValue = {
    //     [newActiveField.name]: newFieldValue,
    //   }
  
    //   props.setActiveOneofFieldInParent(oldActiveField, newActiveField, updateMessageValue);
    // } else {

    //   props.setActiveOneofFieldInParent(oldActiveField, newActiveField, newFieldValue);
    // }
  }

  console.log("RENDERING QROMA PB FIELD COMPONENT - " + props.field.name)
  console.log(props)
  console.log(props.messageValue)
  console.log(props.messageValue[props.field.name])


  if (props.field.oneof !== undefined) {
    const selectedOneofGroupValue = props.messageValue[props.field.oneof];

    console.log("SELECTING ONE OF VALUE");
    console.log(props)
    console.log(selectedOneofGroupValue)

    const relatedOneofFieldsInParent = props.containingMessageFields.filter(f => f.oneof === props.field.oneof);

    const selectedOneofGroupKind = selectedOneofGroupValue.oneofKind;
    console.log("SELECTING ONE OF GROUP - KIND");
    console.log(selectedOneofGroupKind)

    return (
      <QromaPbOneofComponent
        key={props.field.name}
        activeOneofField={props.field}
        activeOneofValue={selectedOneofGroupKind}
        activeOneofValueJsonData={selectedOneofGroupValue[selectedOneofGroupValue.oneofKind]}
        relatedOneofFieldsInParent={relatedOneofFieldsInParent}
        updateFieldInParent={onPbOneofChange}
        updateOneofFieldInParent={setActiveOneofField}
        />
    )
  }

  const fieldNamesPathStr = props.field.name;

  switch (props.field.kind) {
    case "scalar":
      console.log("SCLARA PB FIELD VALUE FOR FIELD " + props.field.name);
      const value = props.messageValue[fieldNamesPathStr];
      console.log(props)
      console.log(value)

      return (
        <MessageScalarFieldInputComponent
          key={props.field.name}
          field={props.field}
          isFieldUsedAsOneof={false}
          value={value}
          updateFieldInParent={onScalarValueChange}
          />
      )

    case "enum":
      return (
        <MessageEnumFieldInputComponent
          key={props.field.name}
          field={props.field}
          isFieldUsedAsOneof={false}
          value={props.messageValue[fieldNamesPathStr]}
          updateFieldInParent={onEnumValueChange}
          />
      )

    case "message":
      console.log("MESSAGE COMPONENT")
      console.log(props.field)

      if (props.field.oneof === undefined) {

        const subMessageValue = props.messageValue[props.field.name];
        if (subMessageValue === undefined) {
          console.log("SUB MESSAGE VALUE UNDEFINED")
          console.log(props)
          return;
        }

        const subMessageValueJsonData = props.messageValueJsonData[props.field.name];

        return (
          <QromaPbMessageComponent
            key={props.field.name}
            messageName={props.field.name}
            messageType={props.field.T()}
            messageValue={subMessageValue}
            messageValueJsonData={subMessageValueJsonData}
            fieldInParent={props.field}
            isFieldUsedAsOneof={false}
            setFieldValueInParentMessage={onMessageValueChange}
            setActiveOneofFieldInParent={setActiveOneofField}
            />
        )
      }

    default:
      return (
        <div key={props.field.name}>
          {/* {field.name} - '{props.messageValue[fieldNamesPathStr]}' [{fieldNamesPathStr}] */}
          {props.field.name} - [{fieldNamesPathStr}]
        </div>
      )
  }
}

