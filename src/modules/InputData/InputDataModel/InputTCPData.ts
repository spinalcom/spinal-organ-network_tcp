/**
 * @export
 * @interface InputTCPDataEndpoint
 */
export interface InputTCPDataEndpoint {
  dp_bim_postfix: string;
  dp_bim_format: string;
  dp_value_f: number;
  dp_unit: string;
}

/**
 * @export
 * @interface InputTCPDataDevice
 */
export interface InputTCPDataDevice {
  dp_bim_prefix: string;
  dp_time: number;
  data: InputTCPDataEndpoint[];
}
