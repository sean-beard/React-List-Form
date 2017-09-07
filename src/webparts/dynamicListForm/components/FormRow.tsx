import * as React from "react";
import { IFormRowProps } from "./IFormRowProps";
import FormCell from "./FormCell";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import styles from "./FormRow.module.scss";

export default class FormRow extends React.Component<IFormRowProps> {
  constructor(props) {
    super(props);
  }

  private handleRemoveRow(): void {
    this.props.onRemoveRow(this.props.rowObj.index);
  }

  private handleCellChange(cellObj): void {
    this.props.onCellChange(this.props.rowObj.index, cellObj.index, cellObj);
  }

  public render(): React.ReactElement<IFormRowProps> {
    const formRow = this.props.rowObj.showRow ? (
      <div className={styles.formRow}>
        <FormCell
          cellObj={this.props.rowObj.cells[0]}
          listName={this.props.rowObj.listName}
          context={this.props.rowObj.context}
          isEditable={this.props.isEditable}
          onChange={this.handleCellChange.bind(this)}
        />
        <FormCell
          cellObj={this.props.rowObj.cells[1]}
          listName={this.props.rowObj.listName}
          context={this.props.rowObj.context}
          isEditable={this.props.isEditable}
          onChange={this.handleCellChange.bind(this)}
        />
        {this.props.isEditable && (
          <IconButton
            className={styles.rowDeleteBtn}
            iconProps={{ iconName: "Clear" }}
            onClick={this.handleRemoveRow.bind(this)}
          />
        )}
      </div>
    ) : null;
    return formRow;
  }
}
