import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import { FieldInfo, ScalarType } from "@protobuf-ts/runtime";
import { getScalarTypeName } from "./MessageScalarFieldInputComponent";



export const getScalarValue = (scalarType: ScalarType, strValue: string): any => {
  switch (scalarType) {
    case ScalarType.STRING: 
      return strValue;

    case ScalarType.FLOAT:
    case ScalarType.DOUBLE: 
      return parseFloat(strValue)
    
    case ScalarType.UINT32: 
    case ScalarType.INT64:
    case ScalarType.UINT64:
    case ScalarType.INT32:
    case ScalarType.FIXED64:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SFIXED64:
    case ScalarType.SINT32:
    case ScalarType.SINT64:
      return parseInt(strValue);
    
    case ScalarType.BOOL: 
      return strValue.toLowerCase() !== "false";

    // case ScalarType.BYTES: return "bytes";
  }
}



interface IBoolComponentProps {
  value: any
  field: FieldInfo
  updateFieldValue: (validValue: any) => void
}

export const BoolComponent = (props: IBoolComponentProps) => {

  const onChecked = (e: ChangeEvent<HTMLInputElement>) => {
    props.updateFieldValue(e.target.checked);
  }

  return (
    <fieldset>
      <input type="checkbox" id={props.field.name} name={props.field.name} defaultChecked={props.value} onChange={onChecked}/>
      <label htmlFor={props.field.name}>{props.field.name} [{getScalarTypeName(props.field.T)}]</label><br></br>
    </fieldset>
  )
}



interface IStringComponentProps {
  value: any
  field: FieldInfo
  updateFieldValue: (validValue: any) => void
}

export const StringComponent = (props: IStringComponentProps) => {

  const doOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.updateFieldValue(e.target.value);
  }

  return (
    <div>
      {props.field.name} [{getScalarTypeName(props.field.T)}] 
      <input
        onChange={doOnChange}
        value={props.value}
        />
    </div>
  )
}



interface IFloatComponentProps {
  value: any
  field: FieldInfo
  updateFieldValue: (validValue: any) => void
}

export const FloatComponent = (props: IFloatComponentProps) => {

  const [inputText, setInputText] = useState(props.value.toString());
  const [isValid, setIsValid] = useState(true);
  const [lastValidValue, setLastValidValue] = useState(0);


  const doOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    try {
      const value = parseFloat(e.target.value);
      setIsValid(true);
      setLastValidValue(value);
    } catch (e) {
      setIsValid(false);
    }
  }

  const onDoneEditing = (e: ChangeEvent<HTMLInputElement>) => {

    try {
      const value = parseFloat(e.target.value);

      props.updateFieldValue(value);

      setIsValid(true);
      setLastValidValue(value);
    } catch (e) {
      props.updateFieldValue(lastValidValue);
      setIsValid(true);
    }
  }

  return (
    <div>
      {props.field.name} [{getScalarTypeName(props.field.T)}] 
      <input
        onChange={doOnChange}
        onBlur={onDoneEditing}
        value={inputText}
        />
      {isValid ? "" : "*** (will set to " + lastValidValue + " unless valid value entered)"}
    </div>
  )
}



interface IIntComponentProps {
  value: any
  field: FieldInfo
  updateFieldValue: (validValue: any) => void
  unsigned?: boolean
}

export const IntComponent = (props: IIntComponentProps) => {

  const [inputText, setInputText] = useState(props.value.toString());
  const [isValid, setIsValid] = useState(true);
  const [lastValidValue, setLastValidValue] = useState(0);


  const doOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    try {
      const value = parseInt(e.target.value);

      if (!props.unsigned) {
        setIsValid(true);
        return;
      }

      if (value > 0) {
        setIsValid(true);
        setLastValidValue(value);
      } else {
        setIsValid(false);
      }

    } catch (e) {
      setIsValid(false);
    }
  }

  const onDoneEditing = (e: ChangeEvent<HTMLInputElement>) => {

    try {
      const value = parseInt(e.target.value);
      if (!props.unsigned) {
        props.updateFieldValue(value);

        setIsValid(true);
        setLastValidValue(value);

        return;
      }

      if (props.unsigned && value > 0) {
        props.updateFieldValue(value);
        setLastValidValue(value);
      } else {
        props.updateFieldValue(lastValidValue);
      }

    } catch (e) {

    }

    setInputText(lastValidValue);
    setIsValid(true);
  }

  return (
    <div>
      {props.field.name} [{getScalarTypeName(props.field.T)}] 
      <input
        onChange={doOnChange}
        onBlur={onDoneEditing}
        value={inputText}
        />
      {isValid ? "" : "*** (will set to " + lastValidValue + " unless valid value entered)"}
    </div>
  )
}
