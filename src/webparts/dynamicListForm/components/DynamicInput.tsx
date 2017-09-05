import * as React from "react";
import { IDynamicInputProps } from "./IDynamicInputProps";
import { IDynamicInputState } from "./IDynamicInputState";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import {
  TextField,
  Dropdown,
  Label,
  IDropdownOption
} from "office-ui-fabric-react/lib";

export default class DynamicInput extends React.Component<
  IDynamicInputProps,
  IDynamicInputState
> {
  private _dropdownOptions: IDropdownOption[] = [];

  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      showTextField: false
    };

    var choices: string[] = this.props.optionsArray;
    if (choices) {
      for (var i = 0; i < choices.length; i++) {
          this._dropdownOptions.push({ key: i, text: choices[i] });
      }
    }
  }

  public render(): React.ReactElement<IDynamicInputProps> {
    return (
      <div>
        {this.props.type === "textfield" &&
          <TextField value={this.state.textFieldVal} />}

        {this.props.type === "dropdown" &&
          <Dropdown
            options={this._dropdownOptions}
            selectedKey={this.state.dropdownVal}
          />}
      </div>
    );
  }
}
