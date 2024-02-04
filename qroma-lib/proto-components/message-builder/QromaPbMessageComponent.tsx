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

  updateFieldValueInParentMessage: (fieldToUpdate: FieldInfo, objectValue: JsonValue) => void
  setActiveOneofFieldInParentMessage: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}


export const QromaPbMessageComponent = <T extends object>(props: IMessageInputComponentProps<T>) => {

  if (props.messageValue === undefined) {
    console.log("UNDEFINED MESSAGE VALUE IN PB MESSAGE 2 COMPONENT")
    console.log(props.messageName)
  }

  const onScalarValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    // console.log("QromaPbMessageComponent2 - SCALAR ON CHANGE");
    // console.log(props)
    // console.log(objectKey)
    // console.log(newValue)
    
    updateMessageField(sourceField, newValue);
  }


  const onEnumValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    // console.log("QromaPbMessageComponent2 - ENUM ON CHANGE");
    // console.log(props)
    // console.log(sourceField)
    // console.log(objectKey)
    // console.log(newValue)
    
    updateMessageField(sourceField, newValue);
  }


  const updateMessageField = (sourceField: FieldInfo, objectValue: JsonValue) => {
    // console.log("QromaPbMessageComponent2 - MESSAGE ON CHANGE");
    // console.log(props)
    // console.log(sourceField)
    // console.log(objectValue)

    if (props.messageName === "__rootMessage__") {
      // console.log("ROOT MESSAGE UPDATING")
      // console.log(props)
      // console.log(sourceField)
      // console.log(objectValue)

      props.updateFieldValueInParentMessage(sourceField, objectValue);
    } else {
      const messageJsonStr = props.messageType.toJsonString(props.messageValue);
      const messageJsonData = JSON.parse(messageJsonStr);
      // console.log(messageJsonData)

      const myUpdatedValue = {
        ...messageJsonData,
        [sourceField.name]: objectValue,
      }

      // console.log("MESSAGE UPDATING PARENT")
      // console.log(props)
      // console.log(myUpdatedValue)

      props.updateFieldValueInParentMessage(props.fieldInParent, myUpdatedValue);
    }
  }

  const setActiveOneofInMessage = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
    console.log("setActiveOneofField() IN QromaPbMessageComponent: " + props.messageType.typeName)
    console.log(props)
    console.log(oldActiveField)
    console.log(newActiveField)
    console.log(newFieldValue)

    console.log("QROMA PB MESSAGE UPDATE - IN setActiveOneofInMessage() FOR NON MESSAGE")
    console.log(newFieldValue)

    if (props.messageName === "__rootMessage__") {
      props.setActiveOneofFieldInParentMessage(oldActiveField, newActiveField, newFieldValue);
    } else {
      const messageJsonStr = props.messageType.toJsonString(props.messageValue);
      const messageJsonData = JSON.parse(messageJsonStr);
      console.log(JSON.parse(messageJsonStr))

      if (newActiveField.kind === 'message') {
        console.log("QROMA NONROOT MESSAGE UPDATE - IN setActiveOneofInMessage() FOR MESSAGE")
  
        const newMessageJsonData = {
          ...messageJsonData,
          [newActiveField.name]: newFieldValue,
        }
        delete newMessageJsonData[oldActiveField.name];
  
        console.log(messageJsonData)
        console.log(newMessageJsonData);

        props.updateFieldValueInParentMessage(props.fieldInParent, newMessageJsonData);
  
      } else {
        console.log("QROMA PB NONROOT MESSAGE UPDATE - IN setActiveOneofInMessage() FOR NONMESSAGE")
        console.log(newFieldValue)
  
        const newMessageJsonData = {
          ...messageJsonData,
          [newActiveField.name]: newFieldValue,
        }
        delete newMessageJsonData[oldActiveField.name];
  
        props.updateFieldValueInParentMessage(props.fieldInParent, newMessageJsonData);
      }
    }
  }


  const messageFieldComponents = [];

  // console.log("RENDERING 2 MESSAGE PB COMPONENT")
  // console.log(props)

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
            <QromaPbMessageComponent
              key={field.name}
              messageName={field.name}
              messageType={field.T()}
              messageValue={subMessageValue}
              messageValueJsonData={subMessageValueJsonData}
              fieldInParent={field}
              updateFieldValueInParentMessage={(fieldToReplace, objectValue) => updateMessageField(fieldToReplace, objectValue)}
              setActiveOneofFieldInParentMessage={setActiveOneofInMessage}
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
        // console.log("RENDERING ONEOF")
        // console.log(field)
        // console.log(props.messageValue)

        const oneofValue = props.messageValue[field.oneof];
        // console.log(oneofValue)

        messageFieldComponents.push (
          <QromaPbOneofContainerComponent
            key={field.name}
            allFieldsInParent={props.messageType.fields}
            oneofFieldName={field.oneof}
            oneofValue={oneofValue}
            // updateOneofFieldValueInParent={onChildOneofValueChange}
            updateFieldValueInParentMessage={updateMessageField}
            setActiveOneofFieldInParentMessage={setActiveOneofInMessage}
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
