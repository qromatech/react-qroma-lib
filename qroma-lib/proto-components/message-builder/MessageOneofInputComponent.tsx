import { FieldInfo } from "@protobuf-ts/runtime"
import React, { useState } from "react"
import { MessageSingleFieldInputComponent } from "./MessageSingleFieldInputComponent"
import { OneofGroup } from "./defs"
// import { OneofGroup } from "./MessageAllFieldsInputComponent"


interface IMessageOneofInputComponent {
  parentObject: any
  oneofName: string
  // oneofGroupField: FieldInfo
  oneofGroup: OneofGroup
  // activeOneOfGroupName: string
  oneofFields: FieldInfo[]
  // onChange: <T>(field: FieldInfo, newValue: T) => void
  onOneofFieldSelectionChange: (oneofGroup: OneofGroup, subOneofSelection: string) => void
  onMemberValueChange: (field: FieldInfo, newValue: any) => void
  // clearParentFieldValue: (fieldName: string) => void
  // onChange: <T>(subOneof: OneofGroup, newValue: T) => void
}


export const MessageOneofInputComponent = (props: IMessageOneofInputComponent) => {

  console.log("ONE OF FIELDS");
  console.log(props.oneofFields);
  console.log(props.oneofGroup)

  // const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofFields[0].name);
  // const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofGroup.oneofFieldName);
  // const [selectedOneofGroupName, setSelectedOneOfGroupName] = useState(props.oneofFields[0].name);
  // const selectedOneofGroupName = props.activeOneOfGroupName;

  // console.log(selectedOneofGroupName);

  const selectedOneofGroupName = props.oneofName;
  let selectedOneofGroupValue = props.oneofFields[0].name;
  console.log(">>> " + selectedOneofGroupValue)

  if (Object.keys(props.parentObject).includes(selectedOneofGroupName)) {
    console.log("FOUND SELECTED ONE OF GROUP NAME")
    console.log(selectedOneofGroupName)
    console.log(props.parentObject)
    const parentObjectOneofValue = props.parentObject[selectedOneofGroupName];
    console.log(parentObjectOneofValue)
    selectedOneofGroupValue = parentObjectOneofValue.oneofKind;

    console.log("SELECTED HERE")
    console.log(selectedOneofGroupValue)
  }

  const handleOneofSelectionChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    console.log(newValue);
    console.log("NEW VALUE: " + newValue);
    // setSelectedValue(newValue);
    // props.onChange(newValue)
    // props.clearParentFieldValue(selectedOneofGroupName);

    // setSelectedOneOfGroupName(newValue);
    props.onOneofFieldSelectionChange(props.oneofGroup, newValue)
  }

  // console.log("OOG");
  // console.log(props.oneofGroup);
  // console.log(selectedOneofGroupName);

  
  const onOneofFieldSelectionChange = (field: FieldInfo, newValue: any) => {
    console.log("onOneofFieldSelectionChange");
    console.log(field);
    console.log(newValue);

    // const selectedOneofGroupField = props.oneofFields.find(f => f.name === selectedOneofGroupName)!;
    // console.log(selectedOneofGroupField);
    // console.log(props.oneofGroup);

    // const selectedOneofGroupField = props.oneofGroup.oneofFields.find(f => f.name === field.name)!;
    const selectedOneofGroupField = props.oneofGroup.oneofFields.find(f => f.name === selectedOneofGroupName)!;
    console.log(selectedOneofGroupField);
    console.log(props.oneofGroup);

    // const oneofToUpdate = {
    //   [props.oneofGroup.oneofFieldName]: {
    //     [selectedOneofGroupName]: newValue
    //   }
    // };
    const oneofToUpdate = {
      [selectedOneofGroupName]: newValue
    };
    console.log("ONE OF TO UPDATEx");
    console.log(oneofToUpdate);
    console.log(props.oneofGroup.parentGroupField);
    console.log(selectedOneofGroupField);

    // props.onMemberValueChange();

    // props.onChange(selectedOneofGroupField, newValue);
    // props.subOneofOnChange(props.oneofGroup, selectedOneofGroupName, newValue);
  }


  console.log("SELECT VALUE SHOULD BE " + selectedOneofGroupValue)
  const oneofSelect = 
    <select value={selectedOneofGroupValue} onChange={handleOneofSelectionChange}>
      {
        props.oneofGroup.oneofFields.map(f => {
          return (
            <option key={f.name} value={f.name}>
              {f.name} [{f.no}]
            </option>
          )
        })
      }
    </select>

  const selectedOneofGroupFields = props.oneofFields.find(f => f.name === selectedOneofGroupValue);
  console.log("selectedOneofGroupFields");
  console.log(selectedOneofGroupFields);

  console.log(props.parentObject)
  console.log(props.parentObject[selectedOneofGroupName][selectedOneofGroupValue])

  const messageValue = props.parentObject[selectedOneofGroupName][selectedOneofGroupValue];
  console.log(messageValue)

  return (
    <>
      {props.oneofName} [oneof]
      {oneofSelect}
      {/* {messageValue} */}

      {selectedOneofGroupFields === undefined ? undefined :
        <div style={{marginLeft: 20}}>
          <MessageSingleFieldInputComponent
            messageValue={messageValue}
            field={selectedOneofGroupFields}
            onOneofFieldSelectionChange={onOneofFieldSelectionChange}
            onMemberValueChange={props.onMemberValueChange}
            key={selectedOneofGroupFields.name}
            />
        </div>
      }
    </>
  )
}