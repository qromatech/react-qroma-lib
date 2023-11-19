// @generated by protobuf-ts 2.8.2 with parameter use_proto_field_name,generate_dependencies
// @generated from protobuf file "qroma-comm-config-commands.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Qroma_LogLevel } from "./qroma-types";
/**
 * @generated from protobuf message RequestQromaCommConfig
 */
export interface RequestQromaCommConfig {
    /**
     * @generated from protobuf field: uint32 ignoreThis = 1;
     */
    ignoreThis: number;
}
/**
 * @generated from protobuf message QromaCommConfig
 */
export interface QromaCommConfig {
    /**
     * @generated from protobuf field: Qroma_LogLevel logLevel = 1;
     */
    logLevel: Qroma_LogLevel;
    /**
     * @generated from protobuf field: uint32 heartbeatIntervalInMs = 2;
     */
    heartbeatIntervalInMs: number;
}
/**
 * @generated from protobuf message SetLogLevelRequest
 */
export interface SetLogLevelRequest {
    /**
     * @generated from protobuf field: Qroma_LogLevel logLevel = 1;
     */
    logLevel: Qroma_LogLevel;
}
/**
 * @generated from protobuf message SetLogLevelResponse
 */
export interface SetLogLevelResponse {
    /**
     * @generated from protobuf field: Qroma_LogLevel logLevel = 1;
     */
    logLevel: Qroma_LogLevel;
}
/**
 * @generated from protobuf message SetHeartbeatIntervalRequest
 */
export interface SetHeartbeatIntervalRequest {
    /**
     * @generated from protobuf field: uint32 heartbeatIntervalInMs = 1;
     */
    heartbeatIntervalInMs: number;
}
/**
 * @generated from protobuf message SetHeartbeatIntervalResponse
 */
export interface SetHeartbeatIntervalResponse {
    /**
     * @generated from protobuf field: uint32 heartbeatIntervalInMs = 1;
     */
    heartbeatIntervalInMs: number;
}
/**
 * @generated from protobuf message QromaCommConfigCommand
 */
export interface QromaCommConfigCommand {
    /**
     * @generated from protobuf oneof: command
     */
    command: {
        oneofKind: "requestQromaCommConfig";
        /**
         * @generated from protobuf field: RequestQromaCommConfig requestQromaCommConfig = 1;
         */
        requestQromaCommConfig: RequestQromaCommConfig;
    } | {
        oneofKind: "setLogLevel";
        /**
         * @generated from protobuf field: SetLogLevelRequest setLogLevel = 2;
         */
        setLogLevel: SetLogLevelRequest;
    } | {
        oneofKind: "setHeartbeatInterval";
        /**
         * @generated from protobuf field: SetHeartbeatIntervalRequest setHeartbeatInterval = 3;
         */
        setHeartbeatInterval: SetHeartbeatIntervalRequest;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message QromaCommConfigResponse
 */
export interface QromaCommConfigResponse {
    /**
     * @generated from protobuf oneof: response
     */
    response: {
        oneofKind: "qromaCommConfig";
        /**
         * @generated from protobuf field: QromaCommConfig qromaCommConfig = 1;
         */
        qromaCommConfig: QromaCommConfig;
    } | {
        oneofKind: "setLogLevel";
        /**
         * @generated from protobuf field: SetLogLevelResponse setLogLevel = 2;
         */
        setLogLevel: SetLogLevelResponse;
    } | {
        oneofKind: "setHeartbeatInterval";
        /**
         * @generated from protobuf field: SetHeartbeatIntervalResponse setHeartbeatInterval = 3;
         */
        setHeartbeatInterval: SetHeartbeatIntervalResponse;
    } | {
        oneofKind: undefined;
    };
}
// @generated message type with reflection information, may provide speed optimized methods
class RequestQromaCommConfig$Type extends MessageType<RequestQromaCommConfig> {
    constructor() {
        super("RequestQromaCommConfig", [
            { no: 1, name: "ignoreThis", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<RequestQromaCommConfig>): RequestQromaCommConfig {
        const message = { ignoreThis: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RequestQromaCommConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestQromaCommConfig): RequestQromaCommConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* uint32 ignoreThis */ 1:
                    message.ignoreThis = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: RequestQromaCommConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* uint32 ignoreThis = 1; */
        if (message.ignoreThis !== 0)
            writer.tag(1, WireType.Varint).uint32(message.ignoreThis);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message RequestQromaCommConfig
 */
export const RequestQromaCommConfig = new RequestQromaCommConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class QromaCommConfig$Type extends MessageType<QromaCommConfig> {
    constructor() {
        super("QromaCommConfig", [
            { no: 1, name: "logLevel", kind: "enum", T: () => ["Qroma_LogLevel", Qroma_LogLevel] },
            { no: 2, name: "heartbeatIntervalInMs", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<QromaCommConfig>): QromaCommConfig {
        const message = { logLevel: 0, heartbeatIntervalInMs: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QromaCommConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QromaCommConfig): QromaCommConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* Qroma_LogLevel logLevel */ 1:
                    message.logLevel = reader.int32();
                    break;
                case /* uint32 heartbeatIntervalInMs */ 2:
                    message.heartbeatIntervalInMs = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: QromaCommConfig, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* Qroma_LogLevel logLevel = 1; */
        if (message.logLevel !== 0)
            writer.tag(1, WireType.Varint).int32(message.logLevel);
        /* uint32 heartbeatIntervalInMs = 2; */
        if (message.heartbeatIntervalInMs !== 0)
            writer.tag(2, WireType.Varint).uint32(message.heartbeatIntervalInMs);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QromaCommConfig
 */
export const QromaCommConfig = new QromaCommConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SetLogLevelRequest$Type extends MessageType<SetLogLevelRequest> {
    constructor() {
        super("SetLogLevelRequest", [
            { no: 1, name: "logLevel", kind: "enum", T: () => ["Qroma_LogLevel", Qroma_LogLevel] }
        ]);
    }
    create(value?: PartialMessage<SetLogLevelRequest>): SetLogLevelRequest {
        const message = { logLevel: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<SetLogLevelRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SetLogLevelRequest): SetLogLevelRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* Qroma_LogLevel logLevel */ 1:
                    message.logLevel = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: SetLogLevelRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* Qroma_LogLevel logLevel = 1; */
        if (message.logLevel !== 0)
            writer.tag(1, WireType.Varint).int32(message.logLevel);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message SetLogLevelRequest
 */
export const SetLogLevelRequest = new SetLogLevelRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SetLogLevelResponse$Type extends MessageType<SetLogLevelResponse> {
    constructor() {
        super("SetLogLevelResponse", [
            { no: 1, name: "logLevel", kind: "enum", T: () => ["Qroma_LogLevel", Qroma_LogLevel] }
        ]);
    }
    create(value?: PartialMessage<SetLogLevelResponse>): SetLogLevelResponse {
        const message = { logLevel: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<SetLogLevelResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SetLogLevelResponse): SetLogLevelResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* Qroma_LogLevel logLevel */ 1:
                    message.logLevel = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: SetLogLevelResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* Qroma_LogLevel logLevel = 1; */
        if (message.logLevel !== 0)
            writer.tag(1, WireType.Varint).int32(message.logLevel);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message SetLogLevelResponse
 */
export const SetLogLevelResponse = new SetLogLevelResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SetHeartbeatIntervalRequest$Type extends MessageType<SetHeartbeatIntervalRequest> {
    constructor() {
        super("SetHeartbeatIntervalRequest", [
            { no: 1, name: "heartbeatIntervalInMs", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<SetHeartbeatIntervalRequest>): SetHeartbeatIntervalRequest {
        const message = { heartbeatIntervalInMs: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<SetHeartbeatIntervalRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SetHeartbeatIntervalRequest): SetHeartbeatIntervalRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* uint32 heartbeatIntervalInMs */ 1:
                    message.heartbeatIntervalInMs = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: SetHeartbeatIntervalRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* uint32 heartbeatIntervalInMs = 1; */
        if (message.heartbeatIntervalInMs !== 0)
            writer.tag(1, WireType.Varint).uint32(message.heartbeatIntervalInMs);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message SetHeartbeatIntervalRequest
 */
export const SetHeartbeatIntervalRequest = new SetHeartbeatIntervalRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SetHeartbeatIntervalResponse$Type extends MessageType<SetHeartbeatIntervalResponse> {
    constructor() {
        super("SetHeartbeatIntervalResponse", [
            { no: 1, name: "heartbeatIntervalInMs", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<SetHeartbeatIntervalResponse>): SetHeartbeatIntervalResponse {
        const message = { heartbeatIntervalInMs: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<SetHeartbeatIntervalResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SetHeartbeatIntervalResponse): SetHeartbeatIntervalResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* uint32 heartbeatIntervalInMs */ 1:
                    message.heartbeatIntervalInMs = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: SetHeartbeatIntervalResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* uint32 heartbeatIntervalInMs = 1; */
        if (message.heartbeatIntervalInMs !== 0)
            writer.tag(1, WireType.Varint).uint32(message.heartbeatIntervalInMs);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message SetHeartbeatIntervalResponse
 */
export const SetHeartbeatIntervalResponse = new SetHeartbeatIntervalResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class QromaCommConfigCommand$Type extends MessageType<QromaCommConfigCommand> {
    constructor() {
        super("QromaCommConfigCommand", [
            { no: 1, name: "requestQromaCommConfig", kind: "message", oneof: "command", T: () => RequestQromaCommConfig },
            { no: 2, name: "setLogLevel", kind: "message", oneof: "command", T: () => SetLogLevelRequest },
            { no: 3, name: "setHeartbeatInterval", kind: "message", oneof: "command", T: () => SetHeartbeatIntervalRequest }
        ]);
    }
    create(value?: PartialMessage<QromaCommConfigCommand>): QromaCommConfigCommand {
        const message = { command: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QromaCommConfigCommand>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QromaCommConfigCommand): QromaCommConfigCommand {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* RequestQromaCommConfig requestQromaCommConfig */ 1:
                    message.command = {
                        oneofKind: "requestQromaCommConfig",
                        requestQromaCommConfig: RequestQromaCommConfig.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).requestQromaCommConfig)
                    };
                    break;
                case /* SetLogLevelRequest setLogLevel */ 2:
                    message.command = {
                        oneofKind: "setLogLevel",
                        setLogLevel: SetLogLevelRequest.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).setLogLevel)
                    };
                    break;
                case /* SetHeartbeatIntervalRequest setHeartbeatInterval */ 3:
                    message.command = {
                        oneofKind: "setHeartbeatInterval",
                        setHeartbeatInterval: SetHeartbeatIntervalRequest.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).setHeartbeatInterval)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: QromaCommConfigCommand, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* RequestQromaCommConfig requestQromaCommConfig = 1; */
        if (message.command.oneofKind === "requestQromaCommConfig")
            RequestQromaCommConfig.internalBinaryWrite(message.command.requestQromaCommConfig, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* SetLogLevelRequest setLogLevel = 2; */
        if (message.command.oneofKind === "setLogLevel")
            SetLogLevelRequest.internalBinaryWrite(message.command.setLogLevel, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* SetHeartbeatIntervalRequest setHeartbeatInterval = 3; */
        if (message.command.oneofKind === "setHeartbeatInterval")
            SetHeartbeatIntervalRequest.internalBinaryWrite(message.command.setHeartbeatInterval, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QromaCommConfigCommand
 */
export const QromaCommConfigCommand = new QromaCommConfigCommand$Type();
// @generated message type with reflection information, may provide speed optimized methods
class QromaCommConfigResponse$Type extends MessageType<QromaCommConfigResponse> {
    constructor() {
        super("QromaCommConfigResponse", [
            { no: 1, name: "qromaCommConfig", kind: "message", oneof: "response", T: () => QromaCommConfig },
            { no: 2, name: "setLogLevel", kind: "message", oneof: "response", T: () => SetLogLevelResponse },
            { no: 3, name: "setHeartbeatInterval", kind: "message", oneof: "response", T: () => SetHeartbeatIntervalResponse }
        ]);
    }
    create(value?: PartialMessage<QromaCommConfigResponse>): QromaCommConfigResponse {
        const message = { response: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QromaCommConfigResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QromaCommConfigResponse): QromaCommConfigResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* QromaCommConfig qromaCommConfig */ 1:
                    message.response = {
                        oneofKind: "qromaCommConfig",
                        qromaCommConfig: QromaCommConfig.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).qromaCommConfig)
                    };
                    break;
                case /* SetLogLevelResponse setLogLevel */ 2:
                    message.response = {
                        oneofKind: "setLogLevel",
                        setLogLevel: SetLogLevelResponse.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).setLogLevel)
                    };
                    break;
                case /* SetHeartbeatIntervalResponse setHeartbeatInterval */ 3:
                    message.response = {
                        oneofKind: "setHeartbeatInterval",
                        setHeartbeatInterval: SetHeartbeatIntervalResponse.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).setHeartbeatInterval)
                    };
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: QromaCommConfigResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* QromaCommConfig qromaCommConfig = 1; */
        if (message.response.oneofKind === "qromaCommConfig")
            QromaCommConfig.internalBinaryWrite(message.response.qromaCommConfig, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* SetLogLevelResponse setLogLevel = 2; */
        if (message.response.oneofKind === "setLogLevel")
            SetLogLevelResponse.internalBinaryWrite(message.response.setLogLevel, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* SetHeartbeatIntervalResponse setHeartbeatInterval = 3; */
        if (message.response.oneofKind === "setHeartbeatInterval")
            SetHeartbeatIntervalResponse.internalBinaryWrite(message.response.setHeartbeatInterval, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QromaCommConfigResponse
 */
export const QromaCommConfigResponse = new QromaCommConfigResponse$Type();
