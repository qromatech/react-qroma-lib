import { FieldInfo } from "@protobuf-ts/runtime";


export interface OneofGroup {
  parentGroupField: FieldInfo
  oneofFieldName: string
  oneofFieldOptions: FieldInfo[]
  // messageBuilderFn: () => any
}


export interface EnumItem {
  enumInt: number
  valueName: string
}
