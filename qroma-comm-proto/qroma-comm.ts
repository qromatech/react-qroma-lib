// @generated by protobuf-ts 2.8.2 with parameter use_proto_field_name,generate_dependencies
// @generated from protobuf file "qroma-comm.proto" (syntax proto3)
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
import { QromaStreamResponse } from "./qroma-streams";
import { FileSystemResponse } from "./file-system-commands";
import { QromaCoreResponse } from "./qroma-core";
import { QromaStreamCommand } from "./qroma-streams";
import { FileSystemCommand } from "./file-system-commands";
import { QromaCoreCommand } from "./qroma-core";
/**
 * @generated from protobuf message QromaCommCommand
 */
export interface QromaCommCommand {
    /**
     * @generated from protobuf oneof: command
     */
    command: {
        oneofKind: "appCommandBytes";
        /**
         * @generated from protobuf field: bytes appCommandBytes = 1;
         */
        appCommandBytes: Uint8Array;
    } | {
        oneofKind: "coreCommand";
        /**
         * @generated from protobuf field: QromaCoreCommand coreCommand = 2;
         */
        coreCommand: QromaCoreCommand;
    } | {
        oneofKind: "fsCommand";
        /**
         * @generated from protobuf field: FileSystemCommand fsCommand = 3;
         */
        fsCommand: FileSystemCommand;
    } | {
        oneofKind: "streamCommand";
        /**
         * @generated from protobuf field: QromaStreamCommand streamCommand = 4;
         */
        streamCommand: QromaStreamCommand;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message QromaCommResponse
 */
export interface QromaCommResponse {
    /**
     * @generated from protobuf oneof: response
     */
    response: {
        oneofKind: "appResponseBytes";
        /**
         * @generated from protobuf field: bytes appResponseBytes = 1;
         */
        appResponseBytes: Uint8Array;
    } | {
        oneofKind: "coreResponse";
        /**
         * @generated from protobuf field: QromaCoreResponse coreResponse = 2;
         */
        coreResponse: QromaCoreResponse;
    } | {
        oneofKind: "fsResponse";
        /**
         * @generated from protobuf field: FileSystemResponse fsResponse = 3;
         */
        fsResponse: FileSystemResponse;
    } | {
        oneofKind: "streamResponse";
        /**
         * @generated from protobuf field: QromaStreamResponse streamResponse = 5;
         */
        streamResponse: QromaStreamResponse;
    } | {
        oneofKind: undefined;
    };
}
// @generated message type with reflection information, may provide speed optimized methods
class QromaCommCommand$Type extends MessageType<QromaCommCommand> {
    constructor() {
        super("QromaCommCommand", [
            { no: 1, name: "appCommandBytes", kind: "scalar", oneof: "command", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "coreCommand", kind: "message", oneof: "command", T: () => QromaCoreCommand },
            { no: 3, name: "fsCommand", kind: "message", oneof: "command", T: () => FileSystemCommand },
            { no: 4, name: "streamCommand", kind: "message", oneof: "command", T: () => QromaStreamCommand }
        ]);
    }
    create(value?: PartialMessage<QromaCommCommand>): QromaCommCommand {
        const message = { command: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QromaCommCommand>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QromaCommCommand): QromaCommCommand {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes appCommandBytes */ 1:
                    message.command = {
                        oneofKind: "appCommandBytes",
                        appCommandBytes: reader.bytes()
                    };
                    break;
                case /* QromaCoreCommand coreCommand */ 2:
                    message.command = {
                        oneofKind: "coreCommand",
                        coreCommand: QromaCoreCommand.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).coreCommand)
                    };
                    break;
                case /* FileSystemCommand fsCommand */ 3:
                    message.command = {
                        oneofKind: "fsCommand",
                        fsCommand: FileSystemCommand.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).fsCommand)
                    };
                    break;
                case /* QromaStreamCommand streamCommand */ 4:
                    message.command = {
                        oneofKind: "streamCommand",
                        streamCommand: QromaStreamCommand.internalBinaryRead(reader, reader.uint32(), options, (message.command as any).streamCommand)
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
    internalBinaryWrite(message: QromaCommCommand, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bytes appCommandBytes = 1; */
        if (message.command.oneofKind === "appCommandBytes")
            writer.tag(1, WireType.LengthDelimited).bytes(message.command.appCommandBytes);
        /* QromaCoreCommand coreCommand = 2; */
        if (message.command.oneofKind === "coreCommand")
            QromaCoreCommand.internalBinaryWrite(message.command.coreCommand, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* FileSystemCommand fsCommand = 3; */
        if (message.command.oneofKind === "fsCommand")
            FileSystemCommand.internalBinaryWrite(message.command.fsCommand, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* QromaStreamCommand streamCommand = 4; */
        if (message.command.oneofKind === "streamCommand")
            QromaStreamCommand.internalBinaryWrite(message.command.streamCommand, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QromaCommCommand
 */
export const QromaCommCommand = new QromaCommCommand$Type();
// @generated message type with reflection information, may provide speed optimized methods
class QromaCommResponse$Type extends MessageType<QromaCommResponse> {
    constructor() {
        super("QromaCommResponse", [
            { no: 1, name: "appResponseBytes", kind: "scalar", oneof: "response", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "coreResponse", kind: "message", oneof: "response", T: () => QromaCoreResponse },
            { no: 3, name: "fsResponse", kind: "message", oneof: "response", T: () => FileSystemResponse },
            { no: 5, name: "streamResponse", kind: "message", oneof: "response", T: () => QromaStreamResponse }
        ]);
    }
    create(value?: PartialMessage<QromaCommResponse>): QromaCommResponse {
        const message = { response: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<QromaCommResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QromaCommResponse): QromaCommResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes appResponseBytes */ 1:
                    message.response = {
                        oneofKind: "appResponseBytes",
                        appResponseBytes: reader.bytes()
                    };
                    break;
                case /* QromaCoreResponse coreResponse */ 2:
                    message.response = {
                        oneofKind: "coreResponse",
                        coreResponse: QromaCoreResponse.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).coreResponse)
                    };
                    break;
                case /* FileSystemResponse fsResponse */ 3:
                    message.response = {
                        oneofKind: "fsResponse",
                        fsResponse: FileSystemResponse.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).fsResponse)
                    };
                    break;
                case /* QromaStreamResponse streamResponse */ 5:
                    message.response = {
                        oneofKind: "streamResponse",
                        streamResponse: QromaStreamResponse.internalBinaryRead(reader, reader.uint32(), options, (message.response as any).streamResponse)
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
    internalBinaryWrite(message: QromaCommResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bytes appResponseBytes = 1; */
        if (message.response.oneofKind === "appResponseBytes")
            writer.tag(1, WireType.LengthDelimited).bytes(message.response.appResponseBytes);
        /* QromaCoreResponse coreResponse = 2; */
        if (message.response.oneofKind === "coreResponse")
            QromaCoreResponse.internalBinaryWrite(message.response.coreResponse, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* FileSystemResponse fsResponse = 3; */
        if (message.response.oneofKind === "fsResponse")
            FileSystemResponse.internalBinaryWrite(message.response.fsResponse, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* QromaStreamResponse streamResponse = 5; */
        if (message.response.oneofKind === "streamResponse")
            QromaStreamResponse.internalBinaryWrite(message.response.streamResponse, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message QromaCommResponse
 */
export const QromaCommResponse = new QromaCommResponse$Type();
