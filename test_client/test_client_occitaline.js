const net = require("net");
const client = new net.Socket();
const port = 7070;
const host = "localhost";
// const increment = Math.floor(Math.sin(Math.PI / 50));

function getDate() {
  const date = new Date();
  // date.set
  date.setDate(date.getDate() - 4);
  return date.getTime();
}

const obj = {
  dp_bim_prefix: "HLC_019",
  dp_time: getDate(),
  data: [
    {
      dp_bim_postfix: "nciSetpoints_occupied_cool",
      dp_bim_format: "NUMBER",
      dp_value_f: 0,
      dp_unit: "deg"
    },
    {
      dp_bim_postfix: "nciSetpoints_standby_cool",
      dp_bim_format: "NUMBER",
      dp_value_f: Math.floor(Math.sin(2 * Math.PI / 3) * 100),
      dp_unit: "deg"
    },
    {
      dp_bim_postfix: "nciSetpoints_unoccupied_cool",
      dp_bim_format: "NUMBER",
      dp_value_f: Math.floor(Math.sin(2 * 2 * Math.PI / 3) * 100),
      dp_unit: "deg"
    }
    // {
    //   dp_bim_postfix: "nciSetpoints_occupied_heat",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 20.0,
    //   dp_unit: "deg"
    // },
    // {
    //   dp_bim_postfix: "nciSetpoints_standby_heat",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 18.0,
    //   dp_unit: "deg"
    // },
    // {
    //   dp_bim_postfix: "nciSetpoints_unoccupied_heat",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 16.0,
    //   dp_unit: "deg"
    // },
    // {
    //   dp_bim_postfix: "nvoSpaceTemp",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 20.8,
    //   dp_unit: "deg"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_mode",
    //   dp_bim_format: "INTEGER",
    //   dp_value_f: 1,
    //   dp_unit: ""
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_heat_output_primary",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "%"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_heat_output_secondary",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "%"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_cool_output",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "%"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_econ_output",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "%"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_fan_output",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "%"
    // },
    // {
    //   dp_bim_postfix: "nvoUnitStatus_in_alarm",
    //   dp_bim_format: "INTEGER",
    //   dp_value_f: 0,
    //   dp_unit: ""
    // },
    // {
    //   dp_bim_postfix: "nvoEffectSetpt",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 20.0,
    //   dp_unit: "deg"
    // },
    // {
    //   dp_bim_postfix: "nvoEffectOccup",
    //   dp_bim_format: "INTEGER",
    //   dp_value_f: 0,
    //   dp_unit: ""
    // },
    // {
    //   dp_bim_postfix: "nvoSetptOffset",
    //   dp_bim_format: "NUMBER",
    //   dp_value_f: 0.0,
    //   dp_unit: "deg"
    // }
  ]
};
let id = 0;

setInterval(() => {
  send_data();
}, 1000);

function update_data(obj) {
  obj.dp_time = getDate();
  for (let index = 0; index < obj.data.length; index++) {
    const element = obj.data[index];
    const increment = Math.floor(Math.sin((index * 2 * Math.PI / obj.data.length) + (id * (Math.PI / 30))) * 100);
    element.dp_value_f = increment;
  }
  id += 1;
}

function send_data() {
  client.connect(
    port,
    host,
    function() {
      update_data(obj);
      const str = JSON.stringify(obj);
      console.log(str);
      client.write(str.slice(0, str.length / 2));
      setTimeout(() => {
        client.end(str.slice(str.length / 2));
      }, 200);
    }
  );
}
