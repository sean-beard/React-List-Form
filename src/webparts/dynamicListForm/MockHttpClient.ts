import { ISPList } from "./DynamicListFormWebPart";
import { ISPField } from "./components/FormCell";

export default class MockHttpClient {
  private static _items: ISPList[] = [
    { Title: "Mock List", Id: "1" },
    { Title: "Mock List 2", Id: "2" },
    { Title: "Mock List 3", Id: "3" }
  ];

  private static _fields: ISPField[] = [
    { Title: "Id", InternalName: "Id", TypeAsString: "number", Choices: null },
    { Title: "Title", InternalName: "Title", TypeAsString: "text", Choices: null },
    { Title: "My Field", InternalName: "MyField", TypeAsString: "text", Choices: null }
  ];

  public static getSPLists(): Promise<ISPList[]> {
    return new Promise<ISPList[]>(resolve => {
      resolve(MockHttpClient._items);
    });
  }

  public static getSPFields(): Promise<ISPField[]> {
    return new Promise<ISPField[]>(resolve => {
      resolve(MockHttpClient._fields);
    });
  }
}
