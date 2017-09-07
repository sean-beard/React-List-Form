import * as React from "react";
import styles from "./DynamicListForm.module.scss";
import { IDynamicListFormProps } from "./IDynamicListFormProps";
import { IDynamicListFormState } from "./IDynamicListFormState";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import FormRow from "./FormRow";
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

    this.handleRemoveRow = this.handleRemoveRow.bind(this);
  }

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
          inputs: [
            {
              _showDropDown: false
            }
          ]
        },
        {
          index: 1,
          _showModal: false,
          showLblInput: false,
          isSubmitted: false,
          showCallout: false,
          showListFieldInput: false,
          hasInputType: false,
          inputs: [
            {
              _showDropDown: false
            }
          ]
        }
      ]
    });

    this.setState({ rows: this._rows });
  }

  private handleSubmit(): void {
    var url =
      this.props.context.pageContext.web.absoluteUrl +
      "/_api/web/lists/getbytitle('" +
      this.props.listName +
      "')/items";
    var itemType = this.GetItemTypeForListName(this.props.listName);

    //{"__metadata":{"type":"SP.Data.TestListListItem"},"Title":"Test Title2"}
    const body: string = JSON.stringify({
      __metadata: {
        type: itemType
      },
      Title: "Test Title2"
    });

    this.props.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=verbose",
          "odata-version": ""
        },
        body: body
      })
      .then((response: SPHttpClientResponse): any => {
        console.log(response.json());
      });
  }

  private handleRemoveRow(index): void {
    this._rows[index].showRow = false;
    this.setState({ rows: this._rows });
  }

  private handleCellChange(rIndex, cIndex, cellObj): void {
    this._rows[rIndex].cells[cIndex] = cellObj;
    this.setState({ rows: this._rows });
  }

  // Get List Item Type metadata
  private GetItemTypeForListName(name) {
    return (
      "SP.Data." +
      name.charAt(0).toUpperCase() +
      name
        .split(" ")
        .join("")
        .slice(1) +
      "ListItem"
    );
  }

  public render(): React.ReactElement<IDynamicListFormProps> {
    var formRows = [];
    for (var i = 0; i < this.state.rows.length; i++) {
      formRows.push(
        <FormRow
          key={i}
          rowObj={this.state.rows[i]}
          onRemoveRow={this.handleRemoveRow}
          onCellChange={this.handleCellChange.bind(this)}
          isEditable={this.props.isEditable}
        />
      );
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
