import * as React from "react";
import * as ReactDom from "react-dom";
import {
  Version,
  Environment,
  EnvironmentType
} from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  IPropertyPaneDropdownOption
} from "@microsoft/sp-webpart-base";
import * as strings from "DynamicListFormWebPartStrings";
import DynamicListForm from "./components/DynamicListForm";
import { IDynamicListFormProps } from "./components/IDynamicListFormProps";
import { IDynamicListFormWebPartProps } from "./IDynamicListFormWebPartProps";
import MockHttpClient from "./MockHttpClient";
import { IODataList } from "@microsoft/sp-odata-types";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class DynamicListFormWebPart extends BaseClientSideWebPart<
  IDynamicListFormWebPartProps
> {
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  //private strings: IDynamicListFormStrings;

  private _getListsAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then(response => {
        this._dropdownOptions = response.value.map((list: ISPList) => {
          return {
            key: list.Title,
            text: list.Title
          };
        });
      });
    } else if (
      Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint
    ) {
      this.fetchOptions().then(response => {
        this._dropdownOptions = response;
        //refresh the property pane now that the promise has been resolved
        this.onDispose();
      });
    }
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.getSPLists().then((data: ISPList[]) => {
      var listData: ISPLists = { value: data };
      return listData;
    }) as Promise<ISPLists>;
  }

  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    var url =
      this.context.pageContext.web.absoluteUrl +
      `/_api/web/lists?$filter=(Hidden eq false) and (BaseType eq 0)`;

    return this.fetchLists(url).then(response => {
      var options: Array<IPropertyPaneDropdownOption> = new Array<
        IPropertyPaneDropdownOption
      >();
      response.value.map((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Title, text: list.Title });
      });

      return options;
    });
  }

  private fetchLists(url: string): Promise<any> {
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(
            "WARNING - failed to hit URL " +
              url +
              ". Error = " +
              response.statusText
          );
          return null;
        }
      });
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected handleModeBtnClick(): boolean {
    return !this.properties.isEditable;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneDropdown("listName", {
                  label: strings.ListNameFieldLabel,
                  options: this._dropdownOptions,
                  selectedKey: 0
                }),
                PropertyPaneButton("isEditable", {
                  text: this.properties.isEditable ? "Save" : "Edit",
                  onClick: this.handleModeBtnClick.bind(this),
                  buttonType: PropertyPaneButtonType.Primary
                })
              ]
            }
          ]
        }
      ]
    };
  }

  public render(): void {
    const element: React.ReactElement<
      IDynamicListFormProps
    > = React.createElement(DynamicListForm, {
      title: this.properties.title,
      listName: this.properties.listName,
      context: this.context,
      isEditable: this.properties.isEditable
    });

    ReactDom.render(element, this.domElement);
    this._getListsAsync();
  }
}
