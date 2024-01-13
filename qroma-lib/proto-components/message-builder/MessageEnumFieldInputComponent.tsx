import React, { FormEvent, FormEventHandler, useState } from "react"
import { EnumInfo, FieldInfo, JsonValue } from "@protobuf-ts/runtime"
import { EnumItem } from "./defs"


interface IEnumerationInputValuesComponentProps {
  enumInfo: EnumInfo
  // onEnumFieldChange: (newValue: string, newValueInt: number) => void
  updateFieldInParent: (objectKey: string, objectValue: JsonValue) => void
  value: any
}


// const EnumerationInputValuesAsDropdownComponent = (props: IEnumerationInputValuesComponentProps) => {
//   const enumInfo = props.enumInfo;

//   const enumName = enumInfo[0];
//   const enumValues = enumInfo[1];
//   // const typePrefix = enumInfo[2];

//   const enumItems = [] as EnumItem[];
  
//   for (const key in enumValues) {
//     try {
//       if (Number.isNaN(parseInt(key))) {
//         continue;
//       }

//       const enumInt = parseInt(key);
//       const valueName = enumValues[enumInt];

//       enumItems.push({ enumInt, valueName })

//     } catch (e) { }
//   }

//   const [selectedValue, setSelectedValue] = useState(enumItems[0].valueName);
//   const handleChange = (e: { target: { value: any } }) => {
//     const newValue = e.target.value;

//     let enumInt = -1;
//     for (const key of enumItems) {
//       if (enumItems[key.valueName] === newValue) {
//         enumInt = key.enumInt;
//       }
//     }

//     console.log(newValue);
//     console.log("NEW VALUE: " + newValue);
//     setSelectedValue(newValue);
//     props.onEnumFieldChange(newValue, enumInt)
//   }

//   return (
//     <select value={selectedValue} onChange={handleChange}>
//       {enumItems.map((option) => (
//         <option key={option.valueName} value={option.valueName}>
//           {option.valueName}
//         </option>
//       ))}
//     </select>
//   )
// }

const EnumerationInputValuesAsRadioButtonsComponent = (props: IEnumerationInputValuesComponentProps) => {
  const enumInfo = props.enumInfo;

  const enumName = enumInfo[0];
  const enumValues = enumInfo[1];
  // const typePrefix = enumInfo[2];

  const enumItems = [] as EnumItem[];
  
  for (const key in enumValues) {
    try {
      if (Number.isNaN(parseInt(key))) {
        continue;
      }

      const enumInt = parseInt(key);
      const valueName = enumValues[enumInt];

      enumItems.push({ enumInt, valueName })

    } catch (e) { }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    let enumInt = enumItems.find(i => i.valueName === newValue).enumInt;

    console.log(enumItems)
    console.log("NEW VALUE: " + newValue);
    console.log(enumInt);
    props.updateFieldInParent(newValue, enumInt);
  }

  console.log("INIT VALUE NAME")
  console.log(props.value)

  return (
    <fieldset style={{marginLeft: 20}}>
      {enumItems.map((enumItem) => (
        <div key={enumItem.valueName}>
          <input
            type="radio"
            name={enumName}
            id={enumItem.valueName} 
            value={enumItem.valueName}
            onChange={handleChange}
            defaultChecked={props.value === enumItem.enumInt}
          />
          <label htmlFor={enumItem.valueName}>{enumItem.valueName} [{enumItem.enumInt}]</label>
        </div>
      ))}
    </fieldset>
  )
}


interface IMessageEnumFieldInputComponentProps {
  field: FieldInfo
  isFieldUsedAsOneof: boolean
  // onEnumValueChange: <T>(field: FieldInfo, newValue: T) => void
  updateFieldInParent: (objectKey: string, objectValue: JsonValue) => void
  value: any
}


export const MessageEnumFieldInputComponent = (props: IMessageEnumFieldInputComponentProps) => {
  const field = props.field;

  if (field.kind !== 'enum') {
    return <div>Non-enum input field provided: {field.name}</div>
  }

  const onChange = (newValue: string, newValueInt: number) => {
    console.log("NEW ENUM VALUE: " + newValueInt)
    props.updateFieldInParent(field.name, newValueInt);
  }

  const enumInfo = field.T();

  console.log("ENUM PROPS")
  console.log(props)

  return (
    <div style={{marginLeft: 20}}>
      {field.name} [{field.kind}: {enumInfo[0]}] -- {props.value}
      {/* <EnumerationInputValuesAsDropdownComponent
        enumInfo={enumInfo}
        onChange={onChange}
        /> */}
      <EnumerationInputValuesAsRadioButtonsComponent
        enumInfo={enumInfo}
        updateFieldInParent={onChange}
        value={props.value}
        />
    </div>
  )
}