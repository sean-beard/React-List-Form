import * as React from "react";
import formStyles from "./FormCell.module.scss";
import { IFormCellProps } from "./IFormCellProps";
import { IFormCellState } from "./IFormCellState";
import { escape } from "@microsoft/sp-lodash-subset";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import {
  PrimaryButton,
  TextField,
  Dropdown,
  Callout,
  IDropdownOption
} from "office-ui-fabric-react/lib";
import { IPropertyPaneDropdownOption } from "@microsoft/sp-webpart-base";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
import MockHttpClient from "../MockHttpClient";
import DynamicInput from "./DynamicInput";

export interface ISPField {
  Title: string;
  InternalName: string;
  TypeAsString?: string;
  Choices?: string[];
}

export interface ISPFields {
  value: ISPField[];
}

export default class FormCell extends React.Component<
  IFormCellProps,
  IFormCellState
> {
  private _cellElement: HTMLElement;
  private _fieldOptions: any[] = [];
  private _fields: ISPField[] = [];

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showCallout: false,
      showLblInput: false,
      showListFieldInput: false,
      isSubmitted: false,
      hasInputType: false
    };

    /* Check which environment the app is in */
    if (Environment.type === EnvironmentType.Local) {
      //Local Env
      this.getMockFieldData().then(response => {
        this._fieldOptions = response.value.map((field: ISPField) => {
          return {
            key: field.InternalName,
            text: field.Title
          };
        });
        //TODO: mock out field type data & choice field options
        this._fields = response.value.map((field: ISPField) => {
          return {
            Title: field.Title,
            InternalName: field.InternalName,
            TypeAsString: field.Title,
            Choices: field.Choices
          };
        });
      });
    } else if (
      //SharePoint Env
      Environment.type == EnvironmentType.SharePoint ||
      Environment.type == EnvironmentType.ClassicSharePoint
    ) {
      this.fetchOptions().then(response => {
        this._fieldOptions = response;
      });
    }
  }

  private getMockFieldData(): Promise<ISPFields> {
    return MockHttpClient.getSPFields().then((data: ISPField[]) => {
      var fieldData: ISPFields = { value: data };
      return fieldData;
    }) as Promise<ISPFields>;
  }

  private fetchOptions(): Promise<object[]> {
    var url =
      this.props.context.pageContext.web.absoluteUrl +
      "/_api/web/lists/getbytitle('" +
      this.props.listName +
      "')/fields?$filter=Hidden eq false";

    return this.fetchListFields(url).then(response => {
      var options: Array<object> = new Array<object>();
      response.value.map(field => {
        options.push({ key: field.InternalName, text: field.Title });

        this._fields.push({
          Title: field.Title,
          InternalName: field.InternalName,
          TypeAsString: field.TypeAsString,
          Choices: field.Choices ? field.Choices : null
        });
      });

      return options;
    });
  }

  private fetchListFields(url: string): Promise<any> {
    return this.props.context.spHttpClient
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

  private _showModal(e) {
    var targetElem = e.target;
    var divElem =
      targetElem.type === "submit"
        ? targetElem.parentElement
        : targetElem.parentElement.parentElement;

    this.setState({
      showModal: true,
      elemToBeReplaced: divElem ? divElem : null
    });
  }

  private _closeModal() {
    this.setState({ showModal: false });
  }

  private handleModalSubmit() {
    var elemToBeReplaced = this.state.elemToBeReplaced;
    var labelValue: string = this.state.lblValue;
    var fieldInternalName: string = this.state.fieldKeySelected;

    if (this.state.showLblInput && elemToBeReplaced && labelValue) {
      elemToBeReplaced.innerHTML = labelValue;
      this.setState({ hasInputType: false });
    } else if (
      this.state.showListFieldInput &&
      elemToBeReplaced &&
      fieldInternalName
    ) {
      this.setState({ hasInputType: true });

      switch (this.state.spoFieldType.toLowerCase()) {
        case "text":
          this.setState({ dynamicInputType: "textfield" });
          break;
        case "choice":
          this.setState({ dynamicInputType: "dropdown" });
          break;
        default:
          this.setState({ dynamicInputType: "textfield" });
      }
    }

    this.setState({
      showModal: false,
      isSubmitted: true
    });
  }

  private handleElemTypeChange(e): void {
    var keyVal: string = e.key;
    this.setState({ elemTypeKeySelected: keyVal });

    if (keyVal === "lbl") {
      this.setState({ showLblInput: true, showListFieldInput: false });
    } else if (keyVal === "fieldInput") {
      this.setState({ showListFieldInput: true, showLblInput: false });
    }
  }

  private handleFieldChange(e): void {
    var internalName: string = e.key;
    this.setState({ fieldKeySelected: internalName });

    var selectedFieldObject: object = this._fields.filter(obj => {
      return obj.InternalName === internalName;
    });

    this.setState({
      spoFieldType: selectedFieldObject[0].TypeAsString,
      optionsArray: selectedFieldObject[0].Choices
        ? selectedFieldObject[0].Choices
        : null
    });
  }

  private handleLblValChange(text): void {
    this.setState({ lblValue: text });
  }

  private handlelistFieldValChange(text): void {
    this.setState({ listFieldValue: text });
  }

  private onMouseOverCell(): void {
    if (this.state.isSubmitted && this.props.isEditable) {
      this.setState({ showCallout: true });
    }
  }

  private onCalloutDismiss(): void {
    this.setState({ showCallout: false });
  }

  private handleCalloutEdit(): void {
    this.setState({ showModal: true });
  }

  public render(): React.ReactElement<IFormCellProps> {
    const labelInput = this.state.showLblInput ? (
      <TextField
        className={formStyles.modalInput}
        label="Label Text"
        value={this.state.lblValue}
        onChanged={this.handleLblValChange.bind(this)}
      />
    ) : null;

    const listFieldInput = this.state.showListFieldInput ? (
      <Dropdown
        className={formStyles.modalInput}
        options={this._fieldOptions}
        onChanged={this.handleFieldChange.bind(this)}
        selectedKey={this.state.fieldKeySelected}
      />
    ) : null;

    return (
      <div
        className={formStyles.formCell}
        onMouseOver={() => this.onMouseOverCell()}
        ref={cell => (this._cellElement = cell)}
      >
        {this.state.hasInputType ? (
          <DynamicInput
            type={this.state.dynamicInputType}
            optionsArray={this.state.optionsArray}
          />
        ) : (
          <PrimaryButton
            onClick={this._showModal.bind(this)}
            className={formStyles.newCellBtn}
          >
            <p className={formStyles.label}>+</p>
          </PrimaryButton>
        )}

        {this.state.showCallout && (
          <Callout
            className={formStyles.calloutContainer}
            ariaLabelledBy={"callout-label-1"}
            ariaDescribedBy={"callout-description-1"}
            role={"alertdialog"}
            gapSpace={0}
            target={this._cellElement}
            onDismiss={this.onCalloutDismiss.bind(this)}
            setInitialFocus={true}
          >
            <div className={formStyles.calloutHeader}>
              <p className={formStyles.calloutTitle} id={"callout-label-1"}>
                Update
              </p>
            </div>
            <div className={formStyles.calloutInner}>
              <div>
                <p
                  className={formStyles.calloutSubtext}
                  id={"callout-description-1"}
                >
                  You can change the contents of this component by clicking the
                  button below.
                </p>
              </div>
              <div className={formStyles.calloutActions}>
                <PrimaryButton onClick={this.handleCalloutEdit.bind(this)}>
                  <p className={formStyles.label}>Edit</p>
                </PrimaryButton>
              </div>
            </div>
          </Callout>
        )}

        <Modal
          isOpen={this.state.showModal}
          onDismiss={this._closeModal.bind(this)}
          isBlocking={false}
          containerClassName={formStyles.modalContainer}
        >
          <div className={formStyles.modalHeader}>
            <span>Create Form Element</span>
          </div>
          <div>
            <p className={formStyles.modalMargin}>
              Choose the type of form element:
            </p>
            <Dropdown
              className={formStyles.modalInput}
              options={[
                { key: "lbl", text: "Label" },
                { key: "fieldInput", text: "List Field Input" }
              ]}
              onChanged={this.handleElemTypeChange.bind(this)}
              selectedKey={this.state.elemTypeKeySelected}
            />

            {labelInput}
            {listFieldInput}

            <div>
              <PrimaryButton
                className={formStyles.modalMargin}
                onClick={this.handleModalSubmit.bind(this)}
              >
                <p className={formStyles.label}>Submit</p>
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
