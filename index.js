import React, { Component, useState, createRef } from "react";
import { render } from "react-dom";
import InputMask from "react-input-mask";
import { Input } from "antd";
import "./style.css";
import "antd/dist/antd.css";

function App() {
  const [ipv4, setIpv4] = useState("");
  const [ipv6, setIpv6] = useState("");

  const [ipv4Sub, setIpv4Sub] = useState("");
  const [ipv6Sub, setIpv6Sub] = useState("");

  return (
    <div>
      <h1>IP</h1>
      <h2>IPV4</h2>
      <InputIPAddress4
        id="ipv4"
        size="large"
        value={ipv4}
        onChange={ev => {
          setIpv4(ev.target.value);
        }}
      />

      <h2>IPV6</h2>
      <InputIPAddress6
        id="ipv6"
        size="large"
        value={ipv6}
        onChange={ev => {
          setIpv6(ev.target.value);
        }}
      />

      <div style={{ marginBottom: "40px" }} />

      <h1>Subnet</h1>

      <h2>IPV4Sub</h2>
      <InputIPAddress4Sub
        id="ipv4Sub"
        size="large"
        value={ipv4Sub}
        onChange={ev => {
          setIpv4Sub(ev.target.value);
        }}
      />

      <h2>IPV6Sub</h2>
      <InputIPAddress6Sub
        id="ipv6Sub"
        size="large"
        value={ipv6Sub}
        onChange={ev => {
          setIpv6Sub(ev.target.value);
        }}
      />
    </div>
  );
}

function InputIPAddress4(props) {
  function checkIpValue(value) {
    const subips = value.split(".");
    if (subips.length > 4) {
      return false;
    }
    const invalidSubips = subips.filter(ip => {
      if (ip.length > 3) {
        return true;
      }
      ip = parseInt(ip);
      return ip < 0 || ip > 255;
    });
    if (invalidSubips.length !== 0) {
      return false;
    }
    let emptyIpCount = 0;
    subips.forEach(ip => {
      if (ip === "") {
        emptyIpCount++;
      }
    });
    if (emptyIpCount > 1) {
      return false;
    }
    return true;
  }

  return (
    <InputMask
      formatChars={{
        "9": "[0-9.]"
      }}
      mask="999999999999999"
      maskChar={null}
      alwaysShowMask={false}
      beforeMaskedValueChange={(newState, oldState, userInput) => {
        let value = newState.value;
        const oldValue = oldState.value;
        let selection = newState.selection;
        let cursorPosition = selection ? selection.start : null;
        const result = checkIpValue(value);
        if (!result) {
          value = value.trim();
          // try to add . before the last char to see if it is valid ip address
          const newValue =
            value.substring(0, value.length - 1) +
            "." +
            value.substring(value.length - 1);
          if (checkIpValue(newValue)) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValue;
          } else {
            value = oldValue;
          }
        }

        return {
          value,
          selection
        };
      }}
      {...props}
    >
      {inputProps => <Input {...inputProps} />}
    </InputMask>
  );
}

function InputIPAddress6(props) {
  function checkIpValue(value) {
    const subips = value.split(":");
    if (subips.length > 8) {
      return false;
    }
    const invalidSubips = subips.filter(ip => {
      // const result = ip.split('').reduce((previous, current) => previous + current.charCodeAt(),0);
      return ip.split("").length > 4;
    });
    if (invalidSubips.length !== 0) {
      return false;
    }
    let emptyIpCount = 0;
    subips.forEach(ip => {
      if (ip === "") {
        emptyIpCount++;
      }
    });
    if (emptyIpCount > 1) {
      return false;
    }
    return true;
  }

  return (
    <InputMask
      formatChars={{
        "9": "[0-9aAbBcCdDeEfF:]"
      }}
      mask="999999999999999999999999999999999999999"
      maskChar={null}
      alwaysShowMask={false}
      beforeMaskedValueChange={(newState, oldState, userInput) => {
        let value = newState.value;
        const oldValue = oldState.value;
        let selection = newState.selection;
        let cursorPosition = selection ? selection.start : null;
        const result = checkIpValue(value);

        // console.log('value => ', value);
        if (!result) {
          value = value.trim();
          // try to add . before the last char to see if it is valid ip address
          const newValue =
            value.substring(0, value.length - 1) +
            ":" +
            value.substring(value.length - 1);
          if (checkIpValue(newValue)) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValue;
          } else {
            value = oldValue;
          }
        }

        // console.log('final value => ', value);
        // console.log('selection => ', selection);
        // console.log('----------------------');
        return {
          value,
          selection
        };
      }}
      {...props}
    >
      {inputProps => <Input {...inputProps} />}
    </InputMask>
  );
}

function InputIPAddress4Sub(props) {
  function checkIpValue(value) {
    //separate the octets per "."
    const subips = value.split(".");
    const subBars = value.split("/");

    //validate the number of octets
    if (subips.length > 4) {
      return false;
    }

    if (subips.length === 4 && subBars.length === 2) {
      return true;
    }

    //validate sub ips -> each sub ip can't have more than 3 chars
    //an the number can't be greater than 255
    const invalidSubips = subips.filter((ip, index) => {
      if (ip.length > 3) {
        return true;
      }
      ip = parseInt(ip);
      return ip < 0 || ip > 255;
    });

    if (invalidSubips.length !== 0) {
      return false;
    }

    let emptyIpCount = 0;
    subips.forEach(ip => {
      if (ip === "") {
        emptyIpCount++;
      }
    });
    if (emptyIpCount > 1) {
      return false;
    }
    return true;
  }

  return (
    <InputMask
      formatChars={{
        // '9': '[0-9\.]',
        "9": "[0-9./]"
        // '8': '[0-9\/]',
      }}
      mask="999999999999999999"
      maskChar={null}
      alwaysShowMask={false}
      beforeMaskedValueChange={(newState, oldState, userInput) => {
        let value = newState.value;
        const oldValue = oldState.value;
        let selection = newState.selection;
        let cursorPosition = selection ? selection.start : null;
        const result = checkIpValue(value);
        let countBars = value.split("/").length - 1;
        const subips = value.split(".");
        const lastSubIp = subips[3];
        const lastSubIpInt = parseInt(lastSubIp);

        if (value.includes("/")) {
          if (
            subips.length !== 4 ||
            countBars !== 1 ||
            value.split("/")[1].length > 2 ||
            lastSubIp === "/"
          ) {
            value = oldValue;
            return {
              value,
              selection
            };
          }
        }

        if (
          !value.includes("/") && (lastSubIp && lastSubIp.length > 3) ||
          (lastSubIpInt < 0 || lastSubIpInt > 255)
        ) {
          value = value.trim();
          const newValueWithBar =
            value.substring(0, value.length - 1) +
            "/" +
            value.substring(value.length - 1);

          if (
            subips.length !== 4 ||
            countBars !== 1 ||
            newValueWithBar.split("/")[1].length > 2 ||
            lastSubIp === "/"
          ) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValueWithBar;
          } else { 
            value = oldValue;
          }

          return {
            value,
            selection
          };
        }

        if (!result) {
          value = value.trim();
          // try to add . before the last char to see if it is valid ip address
          const newValue =
            value.substring(0, value.length - 1) +
            "." +
            value.substring(value.length - 1);

          if (checkIpValue(newValue)) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValue;
          } else {
            value = oldValue;
          }
        }

        // console.log('------RETURN---------')
        // console.log('value', value);
        // console.log('selection', selection);
        // console.log('--------------------')

        return {
          value,
          selection
        };
      }}
      {...props}
    >
      {inputProps => <Input {...inputProps} />}
    </InputMask>
  );
}

function InputIPAddress6Sub(props) {
  function checkIpValue(value) {
    const subips = value.split(":");
    const subBars = value.split("/");

    if (subips.length > 8) {
      return false;
    }

    if (subips.length === 8 && subBars.length === 2) {
      return true;
    }

    const invalidSubips = subips.filter(ip => {
      // const result = ip.split('').reduce((previous, current) => previous + current.charCodeAt(),0);
      return ip.length > 4;
    });
    if (invalidSubips.length !== 0) {
      return false;
    }

    let emptyIpCount = 0;
    subips.forEach(ip => {
      if (ip === "") {
        emptyIpCount++;
      }
    });
    if (emptyIpCount > 1) {
      return false;
    }
    return true;
  }

  return (
    <InputMask
      formatChars={{
        "9": "[0-9aAbBcCdDeEfF:/]",
        // "8": "[0-9/]"
      }}
      mask="999999999999999999999999999999999999999999"
      maskChar={null}
      alwaysShowMask={false}
      beforeMaskedValueChange={(newState, oldState, userInput) => {
        let value = newState.value;
        const oldValue = oldState.value;
        let selection = newState.selection;
        let cursorPosition = selection ? selection.start : null;
        const result = checkIpValue(value);
        let countBars = value.split("/").length - 1;
        const subips = value.split(":");
        const lastSubIp = subips[7];

        if (value.includes("/")) {
          if (
            subips.length !== 8 ||
            countBars !== 1 ||
            value.split("/")[1].length > 2 ||
            lastSubIp === "/"
          ) {
            value = oldValue;
            return {
              value,
              selection
            };
          }
        }

        if (
          !value.includes("/") && (lastSubIp && lastSubIp.length > 4) 
        ) {
          value = value.trim();
          const newValueWithBar =
            value.substring(0, value.length - 1) +
            "/" +
            value.substring(value.length - 1);

          if (
            subips.length !== 8 ||
            countBars !== 1 ||
            newValueWithBar.split("/")[1].length > 2 ||
            lastSubIp === "/"
          ) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValueWithBar;
          } else { 
            value = oldValue;
          }

          return {
            value,
            selection
          };
        }

        // console.log('value => ', value);
        if (!result) {
          value = value.trim();
          // try to add . before the last char to see if it is valid ip address
          const newValue =
            value.substring(0, value.length - 1) +
            ":" +
            value.substring(value.length - 1);
          if (checkIpValue(newValue)) {
            cursorPosition++;
            selection = { start: cursorPosition, end: cursorPosition };
            value = newValue;
          } else {
            value = oldValue;
          }
        }
        return {
          value,
          selection
        };
      }}
      {...props}
    >
      {inputProps => <Input {...inputProps} />}
    </InputMask>
  );
}

render(<App />, document.getElementById("root"));
