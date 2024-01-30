import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { isFieldOneof } from "./builder_utils"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { QromaPbOneofContainerComponent } from "./QromaPbOneofContainerComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  fieldInParent: FieldInfo | null
  isFieldUsedAsOneof: boolean

  setFieldValueInParentMessage: (fieldToReplace: FieldInfo, objectValue: JsonValue) => void
  setActiveOneofFieldInParentMessage: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}


export const QromaPbMessageComponent2 = <T extends object>(props: IMessageInputComponentProps<T>) => {

  if (props.messageValue === undefined) {
    console.log("UNDEFINED MESSAGE VALUE IN PB MESSAGE 2 COMPONENT")
    console.log(props.messageName)
  }

  const onScalarValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbMessageComponent2 - SCALAR ON CHANGE");
    console.log(props)
    console.log(objectKey)
    console.log(newValue)
    
    props.setFieldValueInParentMessage(sourceField, newValue);
  }


  const onEnumValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbMessageComponent2 - ENUM ON CHANGE");
    
    props.setFieldValueInParentMessage(sourceField, newValue);
  }


  const onChildMessageValueChange = (sourceField: FieldInfo, fieldToReplace: FieldInfo, objectValue: JsonValue) => {
    console.log("QromaPbMessageComponent2 - MESSAGE ON CHANGE");
    console.log(props)
    console.log(sourceField)
    console.log(fieldToReplace)
    console.log(objectValue)

    if (sourceField.kind === 'message') {
        const updateMessage = props.messageValue[sourceField.name]

        updateMessage[fieldToReplace.name] = objectValue;
        console.log("UPDATING MESSAGE")
        console.log(updateMessage)
        props.setFieldValueInParentMessage(sourceField, updateMessage);

    } else {
      console.log("HAVE PB FIELD MESSAGE 2 VALUE UPDATE")
      console.log(sourceField.name)
      console.log(objectValue)
      props.setFieldValueInParentMessage(sourceField, objectValue);
    }
  }

  const onChildOneofValueChange = (sourceField: FieldInfo, objectValue: JsonValue) => {
    console.log("QromaPbMessageComponent2 - onChildOneofValueChange");
    console.log(props)
    console.log(sourceField)
    console.log(objectValue)

    // const valueToSet = {
    //   // ...props.oneofValue[activeOneofSelection],
    //   [sourceField.name]: objectValue,
    // }
    // // delete valueToSet[oldActiveField.name];

    console.log("HAVE PB FIELD MESSAGE VALUE UPDATE")
    console.log(sourceField.name)
    console.log(objectValue)
    props.setFieldValueInParentMessage(sourceField, objectValue);
  }

  const setActiveOneofField = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("setActiveOneofField() IN QromaPbFieldComponent")
    console.log(props)
    console.log(oldActiveField)
    console.log(newActiveField)
    console.log(newFieldValue)

    
    // const newRootMessageJsonData = {
    //   ...rootMessageJsonData,
    //   [newActiveField.name]: newFieldValue
    // };
    // delete newRootMessageJsonData[oldActiveField.name];

    props.setActiveOneofFieldInParentMessage(oldActiveField, newActiveField, newFieldValue);
  }


  const messageFieldComponents = [];

  console.log("RENDERING 2 MESSAGE PB COMPONENT")
  console.log(props)

  const renderedOneofFieldNames = [] as string[];

  props.messageType.fields.forEach(field => {

    if (!isFieldOneof(field)) {

      // console.log("NOT ONE OF")
      // console.log(field)

      switch (field.kind) {
        case "scalar":
          const value = props.messageValue[field.name];
          messageFieldComponents.push (
            <MessageScalarFieldInputComponent
              key={field.name}
              field={field}
              isFieldUsedAsOneof={false}
              value={value}
              updateFieldInParent={(objectKey, newValue) => onScalarValueChange(field, objectKey, newValue)}
              />
          )
          break;
    
        case "enum":
          messageFieldComponents.push (
            <MessageEnumFieldInputComponent
              key={field.name}
              field={field}
              isFieldUsedAsOneof={false}
              value={props.messageValue[field.name]}
              updateFieldInParent={(objectKey, newValue) => onEnumValueChange(field, objectKey, newValue)}
              />
          )
          break;
    
        case "message":
          // console.log("MAKE MESSAGE")
          // console.log(field)

          const subMessageValue = props.messageValue[field.name];
          const subMessageValueJsonData = props.messageValue[field.name];
    
          messageFieldComponents.push (
            <QromaPbMessageComponent2
              key={field.name}
              messageName={field.name}
              messageType={field.T()}
              messageValue={subMessageValue}
              messageValueJsonData={subMessageValueJsonData}
              fieldInParent={field}
              isFieldUsedAsOneof={false}
              setFieldValueInParentMessage={(fieldToReplace, objectValue) => onChildMessageValueChange(field, fieldToReplace, objectValue)}
              setActiveOneofFieldInParentMessage={setActiveOneofField}
              />
            )
            break;
          // }
    
        default:
          return (
            <div key={field.name}>
              {field.name} - [{field.name}]
            </div>
          )
      }

    } else {
      // this is a oneof property
      if (renderedOneofFieldNames.find(f => f === field.oneof) === undefined) {
        console.log("RENDERING ONEOF")
        console.log(field)
        console.log(props.messageValue)

        const oneofValue = props.messageValue[field.oneof];
        console.log(oneofValue)

        messageFieldComponents.push (
          <QromaPbOneofContainerComponent
            key={field.name}
            allFieldsInParent={props.messageType.fields}
            oneofFieldName={field.oneof}
            oneofValue={oneofValue}
            updateOneofFieldValueInParent={onChildOneofValueChange}
            setActiveOneofFieldInParentMessage={setActiveOneofField}
            />
        )
        renderedOneofFieldNames.push(field.oneof);
      }
      
    }
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
