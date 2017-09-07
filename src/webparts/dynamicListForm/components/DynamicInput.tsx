import * as React from "react";
import { IDynamicInputProps } from "./IDynamicInputProps";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import styles from "./DynamicInput.module.scss";
import {
  TextField,
  Dropdown,
  Label,
  IDropdownOption
} from "office-ui-fabric-react/lib";

export default class DynamicInput extends React.Component<IDynamicInputProps> {
  private _dropdownOptions: IDropdownOption[] = [];

  constructor(props) {
    super(props);

    var choices: string[] = this.props.optionsArray;
    if (choices) {
      for (var i = 0; i < choices.length; i++) {
        this._dropdownOptions.push({ key: i, text: choices[i] });
      }
    }
  }

  private clearObjectProps() {
    for (var prop in this.props.inputObj) {
      if (this.props.inputObj.hasOwnProperty(prop) && prop != "type") {
        delete this.props.inputObj[prop];
      }
    }
  }

  private handleTxtChange(text): void {
    this.clearObjectProps();
    this.props.inputObj.textVal = text;
    this.props.onChange(this.props.inputObj);
  }

  private handleDropdownChange(e): void {
    this.clearObjectProps();
    this.props.inputObj.selectedKey = e.key;
    this.props.inputObj.selectedText = e.text;
    this.props.onChange(this.props.inputObj);
  }

  public render(): React.ReactElement<IDynamicInputProps> {
    return (
      <div>
        {this.props.inputObj.type === "label" && (
          <Label className={styles.label}>{this.props.lblValue}</Label>
        )}
        {this.props.inputObj.type === "textfield" && (
          <TextField onChanged={this.handleTxtChange.bind(this)} />
        )}
        {this.props.inputObj.type === "dropdown" && (
          <Dropdown
            options={this._dropdownOptions}
            onChanged={this.handleDropdownChange.bind(this)}
          />
        )}
      </div>
    );
  }
}
