import { IQromaCommFileExplorer, QromaCommFileExplorer } from "../file-explorer/QromaCommFileExplorer";
import { IQromaPageSerial, _createQromaPageSerial } from "./QromaPageSerial"


export interface IQromaPageApp {
  qromaPageSerial: IQromaPageSerial
  qromaCommFileExplorer: IQromaCommFileExplorer
}


export const _createQromaPageApp = (): IQromaPageApp => {  

  const qromaPageSerial = _createQromaPageSerial();
  const qromaCommFileExplorer = QromaCommFileExplorer(qromaPageSerial);

  return {
    qromaPageSerial,
    qromaCommFileExplorer,
  };
}