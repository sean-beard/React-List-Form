import * as React from "react";
import styles from "./DynamicListForm.module.scss";
import { IDynamicListFormProps } from "./IDynamicListFormProps";
import { IDynamicListFormState } from "./IDynamicListFormState";
import { escape } from "@microsoft/sp-lodash-subset";
import FormRow from "./FormRow";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse
} from "@microsoft/sp-http";

export default class DynamicListForm extends React.Component<
  IDynamicListFormProps,
  IDynamicListFormState
> {
  private _rows = [];

  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
  }

  /**
   * Create a new default row
   */
  private handleNewDefaultRow(): void {
    this._rows.push({
      index: this.state.rows.length,
      showRow: true,
      listName: this.props.listName,
      context: this.props.context,
      isEditable: this.props.isEditable,
      cells: [
        {
          index: 0,
          _showModal: false,
          showLblInput: false,
          isSubmitted: false,
          showCallout: false,
          showListFieldInput: false,
          hasInputType: false,
          inputs: [{}]
        },
        {
          index: 1,
          _showModal: false,
          showLblInput: false,
          isSubmitted: false,
          showCallout: false,
          showListFieldInput: false,
          hasInputType: false,
          inputs: [{}]
        }
      ]
    });

    this.setState({ rows: this._rows });
  }

  /**
   * Create a new spanning row
   */
  private handleNewSpanningRow(): void {
    this._rows.push({
      index: this.state.rows.length,
      showRow: true,
      listName: this.props.listName,
      context: this.props.context,
      isEditable: this.props.isEditable,
      cells: [
        {
          index: 0,
          _showModal: false,
          showLblInput: false,
          isSubmitted: false,
          showCallout: false,
          showListFieldInput: false,
          hasInputType: false,
          inputs: [{}]
        }
      ]
    });

    this.setState({ rows: this._rows });
  }

  /**
   * Submit the form and create a new list item
   */
  private handleSubmit(): void {
    var url =
      this.props.context.pageContext.web.absoluteUrl +
      "/_api/web/lists/getbytitle('" +
      this.props.listName +
      "')/items";
    var itemType = this.GetItemTypeForListName(this.props.listName);

    //{"__metadata":{"type":"SP.Data.TestListListItem"},"Title":"Test Title2"}
    var inputObjects = [];

    this.state.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.hasInputType) {
          var inputObj = cell.inputs[0];
          inputObjects.push(inputObj);
        }
      });
    });

    var body: object = {
      __metadata: {
        type: itemType
      }
    };

    inputObjects.forEach(inputObj => {
      debugger;
      switch (inputObj.type) {
        case "textfield":
          body[inputObj.fieldInternalName] = inputObj.textVal;
          break;
        case "dropdown":
          body[inputObj.fieldInternalName] = inputObj.selectedText;
          break;
      }
    });
    var bodyStr = JSON.stringify(body);

    this.props.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose",
          "odata-version": ""
        },
        body: bodyStr
      })
      .then((response: SPHttpClientResponse): any => {
        //TODO: post completed logic, clear form?
        console.log(response.json());
      });
  }

  /**
   * Get list item Type metadata
   * @param listName Name of the target list
   */
  private GetItemTypeForListName(listName) {
    return (
      "SP.Data." +
      listName.charAt(0).toUpperCase() +
      listName
        .split(" ")
        .join("")
        .slice(1) +
      "ListItem"
    );
  }

  /**
   * Set the flag to not render a row
   * @param index Index of the row to remove
   */
  private handleRemoveRow(index): void {
    this._rows[index].showRow = false;
    this.setState({ rows: this._rows });
  }

  /**
   * Set the state of the view model when a cell changes
   * @param rIndex Index of the target row
   * @param cIndex Index of the target cell
   * @param cellObj Cell object which contains the modified data
   */
  private handleCellChange(rIndex, cIndex, cellObj): void {
    this._rows[rIndex].cells[cIndex] = cellObj;
    this.setState({ rows: this._rows });
  }

  /**
   * Render the dynamic list form:
   *  Title
   *  Rows
   *  New row/submit buttons
   */
  public render(): React.ReactElement<IDynamicListFormProps> {
    var formRows = [];
    for (var i = 0; i < this.state.rows.length; i++) {
      if (this.state.rows[i].showRow) {
        formRows.push(
          <FormRow
            key={i}
            rowObj={this.state.rows[i]}
            onRemoveRow={this.handleRemoveRow.bind(this)}
            onCellChange={this.handleCellChange.bind(this)}
            isEditable={this.props.isEditable}
          />
        );
      }
    }
    var showButton = this.props.listName != " " ? true : false;
    return (
      <div className={styles.dynamicListForm}>
        <div className={styles.container}>
          <div
            className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}
          >
            <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span className="ms-font-xl ms-fontColor-white">
                {escape(this.props.title)}
              </span>
              <p className="ms-font-l ms-fontColor-white">
                Get started by editing the web part properties and choosing a
                list.
              </p>
              {formRows}
              {showButton &&
              this.props.isEditable && (
                <div className={styles.newButton}>
                  <DefaultButton
                    data-automation-id="test"
                    disabled={false}
                    iconProps={{ iconName: "Add" }}
                    text="New"
                    menuProps={{
                      items: [
                        {
                          key: "defaultRow",
                          name: "Default Row",
                          onClick: this.handleNewDefaultRow.bind(this)
                        },
                        {
                          key: "spanningRow",
                          name: "Spanning Row",
                          onClick: this.handleNewSpanningRow.bind(this)
                        }
                      ]
                    }}
                  />
                </div>
              )}
              {!this.props.isEditable && (
                <div className={styles.newButton}>
                  <DefaultButton
                    onClick={this.handleSubmit.bind(this)}
                    text="Submit"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
