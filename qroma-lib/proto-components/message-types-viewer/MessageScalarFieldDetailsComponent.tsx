import React from "react"
import { FieldInfo, ScalarType } from "@protobuf-ts/runtime"


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


export const MessageScalarFieldDetailsComponent = ({field}: {field: FieldInfo}) => {
  if (field.kind !== 'scalar') {
    return <div>Non-scalar field provided: {field.name}</div>
  }

  return (
    <div>
      {field.name} -- [{getScalarTypeName(field.T)}]
    </div>
  )
}