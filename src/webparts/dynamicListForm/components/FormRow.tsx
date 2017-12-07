import * as React from "react";
import FormCell from "./FormCell";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import styles from "./FormRow.module.scss";

export interface IFormRowProps {
  isEditable: boolean;
  rowObj: any;
  onRemoveRow: any;
  onCellChange: any;
}

export default class FormRow extends React.Component<IFormRowProps> {
  constructor(props) {
    super(props);
  }

  /**
   * To remove a row pass the index of the target row to the parent component
   */
  private handleRemoveRow(): void {
    this.props.onRemoveRow(this.props.rowObj.index);
  }

  /**
   * Update the state of a cell
   * Pass relevant data to the parent component
   * @param cellObj Target cell object that has been modified
   */
  private handleCellChange(cellObj): void {
    this.props.onCellChange(this.props.rowObj.index, cellObj.index, cellObj);
  }

  /**
   * Render a form row:
   *  Form cells
   *  Remove buttons
   */
  public render(): React.ReactElement<IFormRowProps> {
    let rowCells = [];
    for (let i = 0; i < this.props.rowObj.cells.length; i++) {
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
