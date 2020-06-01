import * as React from "react";
import { Terminal, ITerminalAddon } from "xterm";
const className = require("classnames");
// const debounce = require('lodash.debounce');
// import styles from 'xterm/xterm.css';

// require ('xterm/xterm.css');

export interface IXtermProps extends React.DOMAttributes<{}> {
  onChange?: (e: any) => void;
  onInput?: (e: any) => void;
  onFocusChange?: Function;
  addons?: ITerminalAddon[];
  onScroll?: (e: any) => void;
  onContextMenu?: (e: any) => void;
  options?: any;
  path?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
}
export interface IXtermState {
  isFocused: boolean;
}

export default class XTerm extends React.Component<IXtermProps, IXtermState> {
  xterm: Terminal;
  container: HTMLDivElement;
  constructor(props?: IXtermProps, context?: any) {
    super(props, context);
    this.state = {
      isFocused: false,
    };
  }

  loadAddon(addon: ITerminalAddon) {
    this.xterm.loadAddon(addon);
  }
  componentDidMount() {
    this.xterm = new Terminal(this.props.options);
    if (this.props.addons) {
      this.props.addons.forEach((addon) => {
        this.xterm.loadAddon(addon);
      });
    }
    this.xterm.open(this.container);
    // this.xterm.on("focus", this.focusChanged.bind(this, true));
    // this.xterm.on("blur", this.focusChanged.bind(this, false));
    if (this.props.onContextMenu) {
      this.xterm.element.addEventListener(
        "contextmenu",
        this.onContextMenu.bind(this)
      );
    }
    if (this.props.onInput) {
      this.xterm.onData(this.onInput);
    }
    if (this.props.value) {
      this.xterm.write(this.props.value);
    }
  }
  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.xterm) {
      this.xterm.dispose();
      this.xterm = null;
    }
  }
  // componentWillReceiveProps(nextProps) {
  //     if (nextProps.hasOwnProperty('value')) {
  //         this.setState({ value: nextProps.value });
  //     }
  // }

  shouldComponentUpdate(nextProps: Readonly<IXtermProps>, nextState: Readonly<IXtermState>, nextContext: any) {
    // console.log('shouldComponentUpdate', nextProps.hasOwnProperty('value'), nextProps.value != this.props.value);
    if (
      nextProps.hasOwnProperty("value") &&
      nextProps.value != this.props.value
    ) {
      if (this.xterm) {
        this.xterm.clear();
        setTimeout(() => {
          this.xterm.write(nextProps.value);
        }, 0);
      }
    }
    return false;
  }
  getTerminal() {
    return this.xterm;
  }
  write(data: string | Uint8Array) {
    this.xterm && this.xterm.write(data);
  }
  writeln(data: string | Uint8Array) {
    this.xterm && this.xterm.writeln(data);
  }
  focus() {
    if (this.xterm) {
      this.xterm.focus();
    }
  }
  focusChanged(focused: boolean) {
    this.setState({
      isFocused: focused,
    });
    this.props.onFocusChange && this.props.onFocusChange(focused);
  }
  onInput = (data: any) => {
    this.props.onInput && this.props.onInput(data);
  };

  resize(cols: number, rows: number) {
    this.xterm && this.xterm.resize(Math.round(cols), Math.round(rows));
  }
  setOption(key: string, value: boolean) {
    this.xterm && this.xterm.setOption(key, value);
  }
  refresh() {
    this.xterm && this.xterm.refresh(0, this.xterm.rows - 1);
  }

  onContextMenu(e: any) {
    this.props.onContextMenu && this.props.onContextMenu(e);
  }

  render() {
    const terminalClassName = className(
      "ReactXTerm",
      this.state.isFocused ? "ReactXTerm--focused" : null,
      this.props.className
    );
    return (
      <div
        ref={(ref) => (this.container = ref)}
        className={terminalClassName}
      />
    );
  }
}
export { Terminal, XTerm };
