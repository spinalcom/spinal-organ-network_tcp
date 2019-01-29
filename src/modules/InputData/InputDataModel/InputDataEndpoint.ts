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
  InputDataEndpoint as idEndpoint,
  InputDataEndpointDataType,
  InputDataEndpointType,
  SpinalBmsEndpoint,
} from 'spinal-model-bmsnetwork';

import { genUID } from '../../../Utils/genUID';
import { InputTCPDataEndpoint } from './InputTCPData';

/**
 * @property {string} id
 * @property {string} name
 * @property {string} path
 * @property {number | string} currentValue
 * @property {string} unit
 * @property {InputDataEndpointDataType} dataType
 * @property {InputDataEndpointType} type
 * @property {string} nodeTypeName equal SpinalBmsEndpoint.nodeTypeName
 * @property {any[]} timeseries
 * @export
 * @class InputDataEndpoint
 * @implements {idEndpoint}
 */
export class InputDataEndpoint implements idEndpoint {
  public id: string;
  public name: string;
  public path: string;
  public currentValue: number | string;
  public unit: string;
  public dataType: InputDataEndpointDataType;
  public type: InputDataEndpointType;
  public nodeTypeName: string;
  public timeseries: any[];

  /**
   *Creates an instance of InputDataEndpoint.
   * @param {string} [name='default endpoint name']
   * @param {(number | string)} [currentValue=0]
   * @param {string} [unit='unit']
   * @param {InputDataEndpointDataType} [dataType=InputDataEndpointDataType.Integer]
   * @param {InputDataEndpointType} [type=InputDataEndpointType.Other]
   * @param {string} [id=genUID('InputDataEndpoint')]
   * @param {string} [path='default endpoint path']
   * @memberof InputDataEndpoint
   */
  constructor(
    name: string = 'default endpoint name',
    currentValue: number | string = 0,
    unit: string = 'unit',
    dataType: InputDataEndpointDataType = InputDataEndpointDataType.Integer,
    type: InputDataEndpointType = InputDataEndpointType.Other,
    id: string = genUID('InputDataEndpoint'),
    path: string = 'default endpoint path',
  ) {
    this.nodeTypeName = SpinalBmsEndpoint.nodeTypeName;
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.currentValue = currentValue;
    this.unit = unit;
    this.dataType = dataType;
    this.timeseries = [];
  }

  update(json: InputTCPDataEndpoint) {
    this.id = json.dp_bim_postfix;
    this.name = json.dp_bim_postfix;
    this.type = InputDataEndpointType.Other;
    this.path = json.dp_bim_postfix;
    this.currentValue = json.dp_value_f;
    this.unit = json.dp_unit;
    if (typeof json.dp_bim_format === 'number') {
      if (Number.isInteger(json.dp_bim_format)) {
        this.dataType = InputDataEndpointDataType.Integer;
      } else {
        this.dataType = InputDataEndpointDataType.Real;

      }
    } else if (typeof json.dp_bim_format === 'string') {
      this.dataType = InputDataEndpointDataType.String;
    } else {
      this.dataType = InputDataEndpointDataType.Null;
    }
  }
}
