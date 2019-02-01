/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointDataType,
  InputDataEndpointType,
} from './InputDataModel/InputDataModel';

import  { TcpServer } from '../../Utils/TcpServer';
import {} from 'spinal-core-connectorjs_type';
import { ConfigOrgan } from '../../Utils/ConfigOrgan';
import * as net from 'net';
import { InputTCPDataDevice } from './InputDataModel/InputTCPData';

type onDataFunctionType = (obj: InputDataDevice, date?: any) => void;

/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */
class InputData {
  config: ConfigOrgan;
  tcpServer: TcpServer;
  bindedOnModelsChange: () => void;
  clientsMessages: {
    [socketRemoteAddress: string]: string,
  };

  /**
   * @private
   * @type {onDataFunctionType}
   * @memberof InputData
   */
  private onData: onDataFunctionType;

  /**
   * @private
   * @type {InputDataDevice[]}
   * @memberof InputData
   */
  private devices: InputDataDevice[];

  /**
   *Creates an instance of InputData.
   * @memberof InputData
   */
  constructor(config: ConfigOrgan) {
    this.config = config;
    this.devices = [];
    this.onData = null;
    this.tcpServer = new TcpServer(
      config,
      this.onConnect.bind(this),
      this.onIncomingData.bind(this),
      this.onClose.bind(this),
    );
    this.clientsMessages = {};
  }

  /**
   * @param {net.Socket} socket
   * @memberof InputData
   */
  onConnect(socket: net.Socket) {
    if (this.config.DEBUG) {
      console.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}` + 'at date : ' + new Date());
    }
    this.clientsMessages[socket.remoteAddress] = '';
  }
  /**
   * @param {net.Socket} socket
   * @param {string} data
   * @memberof InputData
   */
  onIncomingData(socket: net.Socket, data: string) {
    if (this.config.DEBUG) {
      console.log(`DATA ${socket.remoteAddress}:${data}`);
    }
    this.clientsMessages[socket.remoteAddress] += data;
    if (this.parseIncomingTCPData(this.clientsMessages[socket.remoteAddress]) === true) {
      this.clientsMessages[socket.remoteAddress] = '';
    }
  }
  private searchExistingDevice(json: InputTCPDataDevice) {
    for (let i = 0; i < this.devices.length; i += 1) {
      if (this.devices[i].id === json.dp_bim_prefix) {
        return this.devices[i];
      }
    }
    return null;
  }

  trimError(json: string): string {
    let res = json;
    let counterOpen = 1;
    for (let index = 1; index < json.length; index += 1) {
      const char = json[index];

      if (char === '{') counterOpen += 1;
      if (char === '}') counterOpen -= 1;
      if (counterOpen === 0) {
        res = json.slice(0, index + 1);
        break;
      }
    }
    return res;
  }

  private parseIncomingTCPData(data: string) {
    try {
      const json = this.trimError(data);
      const parsed:InputTCPDataDevice = JSON.parse(json);
      let device = this.searchExistingDevice(parsed);
      if (device === null) {
        // create a model if it doesn't exist
        device = new InputDataDevice();
        this.devices.push(device);
      }
      // update device
      device.update(parsed);
      if (this.onData !== null) {
        this.onData(device, parsed.dp_time);
      }
      return true;
      // update endpoints of the device
    } catch (error) {
      // console.error(error);
      return false;
    }
  }

  /**
   * @param {net.Socket} socket
   * @memberof InputData
   */
  onClose(socket: net.Socket) {
    if (this.config.DEBUG) {
      console.log(`CLOSED: ${socket.remoteAddress}:${socket.remotePort}`);
    }
    this.clientsMessages[socket.remoteAddress] = '';
  }

  /**
   * @param {onDataFunctionType} onData
   * @memberof InputData
   */
  public setOnDataCBFunc(onData: onDataFunctionType): void {
    this.onData = onData;
  }

}
export { InputData };
