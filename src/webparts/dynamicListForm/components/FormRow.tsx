import * as React from "react";
import { IFormRowProps } from "./IFormRowProps";
import { IFormRowState } from "./IFormRowState";
import FormCell from "./FormCell";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import styles from "./FormRow.module.scss";

export default class FormRow extends React.Component<
  IFormRowProps,
  IFormRowState
> {
  constructor() {
    super();
    this.state = { showRow: true };
  }

  private handleRemoveRow() {
    this.setState({ showRow: false });
  }

  public render(): React.ReactElement<IFormRowProps> {
    const formRow = this.state.showRow
      ? <div className={styles.formRow}>
          <FormCell
            listName={this.props.listName}
            context={this.props.context}
            isEditable={this.props.isEditable}
          />
          <FormCell
            listName={this.props.listName}
            context={this.props.context}
            isEditable={this.props.isEditable}
          />
          {this.props.isEditable &&
            <IconButton
              className={styles.rowDeleteBtn}
              iconProps={{ iconName: "Clear" }}
              onClick={this.handleRemoveRow.bind(this)}
            />}
        </div>
      : null;
    return formRow;
  }
}
