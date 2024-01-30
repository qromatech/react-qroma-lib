import React from "react"
import { FieldInfo, IMessageType, JsonObject, JsonValue } from "@protobuf-ts/runtime"
import { IQromaPbFieldComponentProps, QromaPbFieldComponent } from "./QromaPbFieldComponent"
import { isFieldOneof } from "./builder_utils"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"


interface IMessageInputComponentProps<T extends object> {
  messageType: IMessageType<T>
  messageName: string
  messageValue: T
  messageValueJsonData: JsonObject
  fieldInParent: FieldInfo | null
  isFieldUsedAsOneof: boolean
  setFieldValueInParentMessage: (fieldToReplace: FieldInfo, objectValue: JsonValue) => void
  // setActiveOneofFieldInParent: (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => void
}


export const QromaPbMessageComponent2 = <T extends object>(props: IMessageInputComponentProps<T>) => {

  if (props.messageValue === undefined) {
    console.log("UNDEFINED MESSAGE VALUE IN PB MESSAGE 2 COMPONENT")
    console.log(props.messageName)
  }

  // const updateMessageField = (sourceField: FieldInfo, objectValue: JsonValue) => {
  //   console.log("QromaPbMessageComponent - UPDATE PARENT FOR " + sourceField.name);
  //   console.log(props)
  //   console.log(sourceField)
  //   console.log(objectValue);

  //   if (props.isFieldUsedAsOneof) {
  //     try {
  //       const newValueForField = props.messageValue;

  //       console.log("PRE NEW ONEOF MESSAGE VALUE")
  //       console.log(newValueForField)
  
  //       newValueForField[sourceField.name] = objectValue;
  
  //       console.log("NEW ONEOF MESSAGE VALUE")
  //       console.log(newValueForField)
  
  //       props.setFieldValueInParentMessage(props.fieldInParent, newValueForField);
  
  //     } catch (e) {
  //       console.log("ERROR UPDATING MESSAGE FIELD")
  //       console.log(e)
  //     }
  //     return;
  //   }

  //   if (sourceField.kind === 'message') {
  //     if (sourceField.oneof === undefined) {
  //       console.log("HAVE MESSAGE UPDATE")
  //       const updateMessage = props.messageValueJsonData[sourceField.name];
  //       console.log(updateMessage)
  //       console.log(objectValue)
  //       props.setFieldValueInParentMessage(sourceField, updateMessage);
  
  //     } else {
  //       console.log("HAVE MESSAGE ONEOF UPDATE")
  //       props.setFieldValueInParentMessage(sourceField, objectValue);  
  //     }

  //   } else {
  //     if (props.fieldInParent.kind !== 'message') {
  //       console.log("HAVE MESSAGE VALUE UPDATE")
  //       console.log(sourceField)
  //       console.log(objectValue)
  //       props.setFieldValueInParentMessage(sourceField, objectValue);
  //     } else {
  //       console.log("HAVE MESSAGE IN MESSAGE UPDATE")
  //       console.log(sourceField)
  //       console.log(objectValue)
  //       console.log(props.messageValueJsonData)

  //       const updateMessage = props.messageValueJsonData;
  //       updateMessage[sourceField.name] = objectValue
  //       console.log("NEW VLUAE")
  //       console.log(updateMessage)
  //       props.setFieldValueInParentMessage(props.fieldInParent, updateMessage);
  //     }
  //   }
  // }

  // const setActiveOneofFieldInParent = (oldActiveField: FieldInfo, newActiveField: FieldInfo, newFieldValue: JsonValue) => {
  //   console.log("PB MESSAGE COMPONENT - updateOneofFieldInParentMessage")
  //   console.log(props)
  //   console.log(oldActiveField)
  //   console.log(newActiveField)
  //   console.log(newFieldValue)

  //   if (props.fieldInParent.oneof === undefined) {
  //     console.log("SETTING AS VALUE")

  //     if (props.fieldInParent.kind === 'message') {
  //       const updateMessageValue = props.messageValueJsonData;
  //       updateMessageValue[newActiveField.name] = newFieldValue;
  //       delete updateMessageValue[oldActiveField.name];
  //       console.log(updateMessageValue)

  //       props.setFieldValueInParentMessage(props.fieldInParent, updateMessageValue);

  //     } else {
  //       props.setActiveOneofFieldInParent(oldActiveField, newActiveField, newFieldValue);
  //     }

  //   } else {
  //     const updateMessageValue = {
  //       [props.fieldInParent.name]: newFieldValue,
  //     }
      
  //     console.log("SETTING AS ONEOF")
  //     props.setFieldValueInParentMessage(props.fieldInParent, updateMessageValue);
  //   }
  // }

  const onScalarValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - SCALAR ON CHANGE");
    console.log(props)
    console.log(objectKey)
    console.log(newValue)
    
    props.setFieldValueInParentMessage(sourceField, newValue);
  }


  const onEnumValueChange = (sourceField: FieldInfo, objectKey: string, newValue: JsonValue) => {
    console.log("QromaPbFieldComponent - ENUM ON CHANGE");
    
    props.setFieldValueInParentMessage(sourceField, newValue);
  }


  const onMessageValueChange = (sourceField: FieldInfo, fieldToReplace: FieldInfo, objectValue: JsonValue) => {
    console.log("QromaPbFieldComponent - MESSAGE ON CHANGE");
    console.log(props)
    console.log(sourceField)
    console.log(fieldToReplace)
    console.log(objectValue)

    if (sourceField.kind === 'message') {
      // if (fieldToReplace.oneof === undefined) {
        const updateMessage = props.messageValueJsonData[sourceField.name];
        updateMessage[fieldToReplace.name] = objectValue;
        console.log("UPDATING MESSAGE")
        console.log(updateMessage)
        props.setFieldValueInParentMessage(sourceField, updateMessage);

      // } else {
      //   console.log("HAVE PB FIELD MESSAGE UPDATE")
      //   console.log(sourceField)

      //   const updateMessage = props.messageValueJsonData[sourceField.name];
      //   updateMessage[fieldToReplace.name] = objectValue;
      //   console.log(updateMessage)
      //   props.setFieldValueInParentMessage(sourceField, updateMessage);
      // }

    } else {
      console.log("HAVE PB FIELD MESSAGE VALUE UPDATE")
      console.log(sourceField.name)
      console.log(objectValue)
      props.setFieldValueInParentMessage(sourceField, objectValue);
    }
  }


  const messageFieldComponents = [];

  console.log("RENDERING 2 MESSAGE PB COMPONENT")
  console.log(props)

  props.messageType.fields.forEach(field => {

    if (!isFieldOneof(field)) {

      console.log("NOT ONE OF")
      console.log(field)

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
          console.log("MAKE MESSAGE")
          console.log(field)

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
              setFieldValueInParentMessage={(fieldToReplace, objectValue) => onMessageValueChange(field, fieldToReplace, objectValue)}
              // setActiveOneofFieldInParent={setActiveOneofField}
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


      // const fieldComponentProps: IQromaPbFieldComponentProps = {
      //   field,
      //   messageValue: props.messageValue,
      //   messageValueJsonData: props.messageValueJsonData,
      //   containingMessageFields: props.messageType.fields,
      //   setFieldValueInParentMessage: updateMessageField,
      //   setActiveOneofFieldInParent,
      // };

      // const messageFieldComponent = 
      //   <QromaPbFieldComponent
      //     key={field.name}
      //     {...fieldComponentProps}
      //     />;
      // messageFieldComponents.push(messageFieldComponent);
    }

  //   if (field.oneof !== undefined) {
  //     if (props.messageValueJsonData === undefined) {
  //       console.log("UNDEFINED MESSAGE VALUE JSON DATA")
  //       console.log(props)
  //       console.log(field)

  //       if (props.messageValue[field.name] !== undefined) {
  //         console.log("FOUND FIELD")
  //         console.log(props.messageValue)
  //       }

  //       // props.messageType.fields.forEach(mtf => {
  //       //   if (mtf.)
  //       // })

  //       const fieldComponentProps: IQromaPbFieldComponentProps = {
  //         field,
  //         messageValue: props.messageValue,
  //         messageValueJsonData: props.messageValueJsonData,
  //         containingMessageFields: props.messageType.fields,
  //         setFieldValueInParentMessage: updateMessageField,
  //         setActiveOneofFieldInParent,
  //       };
  //       const messageFieldComponent = 
  //         <QromaPbFieldComponent
  //           key={field.name}
  //           {...fieldComponentProps}
  //           />;
  //       messageFieldComponents.push(messageFieldComponent);

  //       return
  //     }
  //     if (props.messageValueJsonData[field.name] === undefined) {
  //       return;
  //     }
  //     console.log("HANDLE ONE OF IN MESSAGE FIELD")
  //     console.log(field)
  //   }

  //   const fieldComponentProps: IQromaPbFieldComponentProps = {
  //     field,
  //     messageValue: props.messageValue,
  //     messageValueJsonData: props.messageValueJsonData,
  //     containingMessageFields: props.messageType.fields,
  //     setFieldValueInParentMessage: updateMessageField,
  //     setActiveOneofFieldInParent,
  //   };

  //   const messageFieldComponent = 
  //     <QromaPbFieldComponent
  //       key={field.name}
  //       {...fieldComponentProps}
  //       />;
  //   messageFieldComponents.push(messageFieldComponent);
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
