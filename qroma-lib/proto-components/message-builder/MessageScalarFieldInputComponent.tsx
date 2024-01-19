import React from "react"
import { FieldInfo, JsonValue, ScalarType } from "@protobuf-ts/runtime"
import { BoolComponent, FloatComponent, IntComponent, StringComponent } from "./MessageScalarFieldTypeComponents";


export const getScalarTypeName = (scalarType: ScalarType): string => {
  switch (scalarType) {
    case ScalarType.DOUBLE: return "double";
    case ScalarType.FLOAT: return "float";
    case ScalarType.INT64: return "int64";
    case ScalarType.UINT64: return "uint64";
    case ScalarType.INT32: return "int32";
    case ScalarType.FIXED64: return "fixed64";
    case ScalarType.FIXED32: return "fixed32";
    case ScalarType.BOOL: return "bool";
    case ScalarType.STRING: return "string";
    case ScalarType.BYTES: return "bytes";
    case ScalarType.UINT32: return "uint32";
    case ScalarType.SFIXED32: return "sfixed32";
    case ScalarType.SFIXED64: return "sfixed64";
    case ScalarType.SINT32: return "sint32";
    case ScalarType.SINT64: return "sint64";
  }
}



interface IMessageScalarFieldInputComponentProps {
  value: any
  field: FieldInfo
  isFieldUsedAsOneof: boolean
  updateFieldInParent: (objectKey: string, objectValue: JsonValue) => void
}


export const MessageScalarFieldInputComponent = (props: IMessageScalarFieldInputComponentProps) => {

  if (props.value === undefined) {
    console.log("VALUE UNDEFINED IN MessageScalarFieldInputComponent FOR " + props.field.name)
    console.log(props)
  }

  if (props.field.kind !== 'scalar') {
    return <div>Non-scalar input field provided: {props.field.name}</div>
  }

  const doOnChange = (updatedValue: any) => {
    props.updateFieldInParent(props.field.name, updatedValue);
  }

  const updateFieldValue = (validValue: string) => {
    props.updateFieldInParent(props.field.name, validValue);
  }

  
  switch (props.field.T) {
    case ScalarType.BOOL:
      return (
        <BoolComponent
          value={props.value}
          field={props.field}
          updateFieldValue={updateFieldValue}
          />
        )

    case ScalarType.STRING:
      return (
        <StringComponent
          value={props.value}
          field={props.field}
          updateFieldValue={updateFieldValue}
          />
        )

    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      return (
        <FloatComponent
          value={props.value}
          field={props.field}
          updateFieldValue={updateFieldValue}
          />
        )

    case ScalarType.UINT32: 
    case ScalarType.UINT64:
      return (
        <IntComponent
          value={props.value}
          field={props.field}
          updateFieldValue={updateFieldValue}
          unsigned={true}
          />
        )

    case ScalarType.INT64:
    case ScalarType.INT32:
    case ScalarType.FIXED64:
    case ScalarType.FIXED32:
    case ScalarType.SFIXED32:
    case ScalarType.SFIXED64:
    case ScalarType.SINT32:
    case ScalarType.SINT64:
      return (
        <IntComponent
          value={props.value}
          field={props.field}
          updateFieldValue={updateFieldValue}
          />
        )
  }


  return (
    <div>
      {props.field.name} [{getScalarTypeName(props.field.T)}] --- Unsupported scalar field
    </div>
  )
}