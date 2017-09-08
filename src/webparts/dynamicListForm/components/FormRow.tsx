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
    var rowCells = [];
    for (var i = 0; i < this.props.rowObj.cells.length; i++) {
      rowCells.push(
        <FormCell
          key={i}
          cellObj={this.props.rowObj.cells[i]}
          listName={this.props.rowObj.listName}
          context={this.props.rowObj.context}
          isEditable={this.props.isEditable}
          onChange={this.handleCellChange.bind(this)}
        />
      );
    }

    return (
      <div className={styles.formRow}>
        {rowCells}
        {this.props.isEditable && (
          <IconButton
            className={styles.rowDeleteBtn}
            iconProps={{ iconName: "Clear" }}
            onClick={this.handleRemoveRow.bind(this)}
          />
        )}
      </div>
    );
  }
}
