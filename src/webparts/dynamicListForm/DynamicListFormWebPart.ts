import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DynamicListFormWebPartStrings';
import DynamicListForm from './components/DynamicListForm';
import { IDynamicListFormProps } from './components/IDynamicListFormProps';
import { IDynamicListFormWebPartProps } from './IDynamicListFormWebPartProps';

export default class DynamicListFormWebPart extends BaseClientSideWebPart<IDynamicListFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDynamicListFormProps > = React.createElement(
      DynamicListForm,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
