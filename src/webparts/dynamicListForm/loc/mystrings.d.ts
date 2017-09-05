// export interface IDynamicListFormStrings {
  // PropertyPaneDescription: string;
  // BasicGroupName: string;
  // TitleFieldLabel: string;
  // ListNameFieldLabel: string;
// }
declare interface IDynamicListFormStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  ListNameFieldLabel: string;
}

declare module 'DynamicListFormWebPartStrings' {
  const strings: IDynamicListFormStrings;
  export = strings;
}