import React from "react"
import { FieldInfo } from "@protobuf-ts/runtime"
import { OneofGroup } from "./defs"
import { createValueForField } from "./builder_utils"
import { MessageEnumFieldInputComponent } from "./MessageEnumFieldInputComponent"
import { MessageScalarFieldInputComponent } from "./MessageScalarFieldInputComponent"
import { QromaPbMessageComponent } from "./QromaPbMessageComponent"


export interface IQromaPbOneofComponent {
  field: FieldInfo
  oneofName: string
  containingMessageFields: readonly FieldInfo[]
  selectedOneofGroupValue: string
  // oneofGroup: OneofGroup
  oneofContainerValue: any
  parentObject: any
  value: any
  updateParent: (objectKey: string, objectValue: any) => void
}


export const QromaPbOneofComponent = (props: IQromaPbOneofComponent) => {

  // const field = props.field;

  console.log("QromaPbOneofComponent PROPS")
  console.log(props)
  

  const oneofGroup: OneofGroup = {
    parentGroupField: props.field,
    oneofFieldName: props.oneofName,
    oneofFields: props.containingMessageFields.filter(f => f.oneof === props.oneofName),
  };


  const selectedOneofGroupName = props.oneofName;
  const selectedOneofGroupValue = props.selectedOneofGroupValue;
  // let selectedOneofGroupValue = props.containingMessageFields[0].name;
  // console.log(">>> " + selectedOneofGroupValue)

  if (Object.keys(props.parentObject).includes(selectedOneofGroupName)) {
    console.log("FOUND SELECTED ONE OF GROUP NAME")
    console.log(selectedOneofGroupName)
    console.log(props.parentObject)
    const parentObjectOneofValue = props.parentObject[selectedOneofGroupName];
    console.log(parentObjectOneofValue)
    // selectedOneofGroupValue = parentObjectOneofValue.oneofKind;

    console.log("SELECTED HERE")
    console.log(selectedOneofGroupValue)
  }

  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log(newValue);
    console.log("handleOneofSelectionChange - NEW VALUE: " + newValue);
    console.log("ONEOF NAME >> " + props.field.oneof)

    var selectedField = props.containingMessageFields.find(f => f.name === newValue);

    const selectedFieldInitValue = createValueForField(selectedField);

    console.log("NEW VALUE FOR SELECTED FIELD")
    console.log(selectedFieldInitValue)
    console.log(selectedField)

    const newParentValue = {
      oneofKind: newValue,
      [newValue]: selectedFieldInitValue,
    };

    props.updateParent(props.field.oneof, newParentValue);
  }

  const handleOneofValueChange = (objectKey: string, objectValue: any) => {
    console.log("handleOneofValueChange in PB")
    console.log(objectKey)
    console.log(objectValue)
  }

  console.log("SELECT VALUE SHOULD BE " + selectedOneofGroupValue)
  const oneofSelect = 
    <select value={selectedOneofGroupValue} onChange={handleOneofSelectionChange}>
      {
        oneofGroup.oneofFields.map(f => {
          return (
            <option key={f.name} value={f.name}>
              {f.name} [{f.no}]
            </option>
          )
        })
      }
    </select>

  const selectedOneofGroupFields = props.containingMessageFields.find(f => f.name === selectedOneofGroupValue);
  console.log("QromaPbOneofComponent - selectedOneofGroupFields");
  console.log(props.field.oneof)
  console.log(selectedOneofGroupFields);
  console.log(selectedOneofGroupName);
  console.log(selectedOneofGroupValue)


  const fieldForSelectedOneof = props.containingMessageFields.find(f => f.name === selectedOneofGroupValue);
  // const containingMessageFields = props.containingMessageFields;

  // console.log("ONEOF FIELD VALUSE FOR QromaPbFieldComponent [" + selectedOneofGroupValue + "]")
  // console.log(fieldForSelectedOneof)
  // console.log(props.value)
  // console.log(containingMessageFields)

  // console.log("ONE OF DETAILS")
  // console.log(selectedOneofGroupName)
  // console.log(selectedOneofGroupValue)


  // const messageValue = fieldForSelectedOneof.kind === 'message' ? 
  //                      props.value[selectedOneofGroupName] :
  //                      props.value[selectedOneofGroupName][selectedOneofGroupValue];

  // console.log("MESSAGE VALUE - pb")
  // console.log(fieldForSelectedOneof)
  // console.log(props.value)
  // console.log(messageValue)

  const onScalarValueChange = (messageField: FieldInfo, newValue: any) => {
    console.log("QromaPbOneofComponent - SCALAR ON CHANGE");
    console.log(fieldForSelectedOneof)
    console.log(messageField)
    console.log(newValue)

    props.updateParent(fieldForSelectedOneof.name, newValue);
  }

  const onEnumValueChange = (field: FieldInfo, newValue: string, newValueInt: number) => {
    console.log("QromaPbOneofComponent - ENUM ON CHANGE");
    console.log(field)
    console.log(newValueInt)
    console.log(newValue)

    const newOneOfStruct = {
      oneofKind: field.name,
      [field.name]: newValueInt
    };

    console.log(newOneOfStruct)

    props.updateParent(field.oneof, newOneOfStruct);
  }

  const onMessageValueChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbOneofComponent - MESSAGE ON CHANGE");
    console.log(fieldForSelectedOneof)
    console.log(objectKey)
    console.log(objectValue)
    console.log(props.oneofContainerValue)
    console.log(props.parentObject)
    console.log(props.value)

    const newOneOfStruct = {
      oneofKind: fieldForSelectedOneof.name,
      [fieldForSelectedOneof.name]: {
        ...props.oneofContainerValue[fieldForSelectedOneof.name], 
        [objectKey]: objectValue
      }
    };

    console.log(newOneOfStruct)

    props.updateParent(fieldForSelectedOneof.oneof, newOneOfStruct);
  }

  const onPbOneofChange = (objectKey: string, objectValue: any) => {
    console.log("QromaPbOneofComponent - onPbOneofChange");
    console.log(objectKey)
    console.log(objectValue)

    props.updateParent(objectKey, objectValue);
  }

  console.log("PB ONE OF fieldForSelectedOneof")
  console.log(fieldForSelectedOneof)
  console.log(props.containingMessageFields)


  let oneofValueComponent = <></>;
  switch (fieldForSelectedOneof.kind) {
    case 'enum':
      oneofValueComponent = 
        <MessageEnumFieldInputComponent
          key={fieldForSelectedOneof.name}
          field={fieldForSelectedOneof}
          onEnumValueChange={(newValue, newValueInt) => onEnumValueChange(fieldForSelectedOneof, newValue, newValueInt)}
          value={props.value[selectedOneofGroupName][selectedOneofGroupValue]}
          />;
      break;
    case 'scalar':
      oneofValueComponent = 
        <MessageScalarFieldInputComponent
          key={fieldForSelectedOneof.name}
          value={props.value[selectedOneofGroupName]}
          field={fieldForSelectedOneof}
          onChange={onScalarValueChange}
          />;
      break;
    case 'message':
      oneofValueComponent = 
        <QromaPbMessageComponent
          key={fieldForSelectedOneof.name}
          messageName={fieldForSelectedOneof.name}
          messageType={fieldForSelectedOneof.T()}
          messageValue={props.value[selectedOneofGroupName]}
          // fieldNamesPath={[]}
          updateParent={(objectKey, objectValue) => onMessageValueChange(objectKey, objectValue)}
          />;
      break;
    default:
      throw new Error("Unhandled field kind");
  }
  

  return (
    <div>
      <fieldset style={{backgroundColor: 'lightblue'}}>
      {props.oneofName} [oneof]
      {oneofSelect}
      <div>

      {/* <QromaPbFieldComponent
        field={fieldForSelectedOneof}
        messageValue={messageValue}
        containingMessageFields={containingMessageFields}
        updateParent={handleOneofValueChange}
        /> */}
        { oneofValueComponent }
      </div>
      </fieldset>
    </div>
  )
}