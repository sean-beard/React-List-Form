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

export interface IDynamicListFormWebPartProps {
  title: string;
  listName: string;
  isEditable: boolean;
}

export default class DynamicListFormWebPart extends BaseClientSideWebPart<
  IDynamicListFormWebPartProps
> {
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _isDropdownDisabled: boolean = false;

  /**
   * Populate "List Name" dropdown options array
   */
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

  /**
   * Fetch mock list name data
   */
  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.getSPLists().then((data: ISPList[]) => {
      const listData: ISPLists = { value: data };
      return listData;
    }) as Promise<ISPLists>;
  }

  /**
   * Fetch list name data 
   */
  private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    const url =
      this.context.pageContext.web.absoluteUrl +
      `/_api/web/lists?$filter=(Hidden eq false) and (BaseType eq 0)`;

    return this.fetchLists(url).then(response => {
      let options: Array<IPropertyPaneDropdownOption> = new Array<
        IPropertyPaneDropdownOption
      >();
      response.value.map((list: IODataList) => {
        console.log("Found list with title = " + list.Title);
        options.push({ key: list.Title, text: list.Title });
      });

      return options;
    });
  }

  /**
   * REST API call to return list name data
   * @param url Request URL for the get API call
   */
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

  /**
   * Get the web part version
   */
  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /**
   * Toggle whether or not the form is editable
   */
  protected handleModeBtnClick(): boolean {
    return !this.properties.isEditable;
  }

  /**
   * Configure the web part property pane
   */
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
                  selectedKey: 0,
                  disabled: this._isDropdownDisabled
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

  /**
   * Disable the ability to choose a list name after initial choice
   * @param propertyPath Path to the changed field
   * @param oldValue Previous field value
   * @param newValue Current field value
   */
  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): void {
    if (this.properties.listName.trim()) {
      this._isDropdownDisabled = true;
    }
  }

  /**
   * Render the Dynamic List Form and invoke the code that fetches list names on the site
   */
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
