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
  constructor() {
    super();
    this.state = {
      rowCount: 0
    };
  }

  private handleNewDefaultRow(): void {
    this.setState({ rowCount: this.state.rowCount + 1 });
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
    var rows = [];
    for (var i = 0; i < this.state.rowCount; i++) {
      rows.push(
        <FormRow
          key={i}
          listName={this.props.listName}
          context={this.props.context}
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
              {rows}
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
                <DefaultButton
                  onClick={this.handleSubmit.bind(this)}
                  text="Submit"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
