type TRelationProps = { id: string; text: string; };

export interface ICategoryItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  Title: string;
  Parent?: TRelationProps;
  Children: TRelationProps[];
}

export type ISubCategoryItem = Omit<ICategoryItem, "Parent"> & { Parent: TRelationProps };

export interface IPatternItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  Match: string;
  Title: string;
  Category: TRelationProps;
  Subcategory: TRelationProps;
}

export interface IPatternFormItem {
  Category: string;
  Title?: string;
  Match: string;
  Subcategory: string;
}


export interface INotionTextObject {
  text: { content: string; };
}

export interface INotionRelationProperty {
  relation: { id: string }[];
}

export interface IPatternProperties {
  Match: { rich_text: INotionTextObject[]; };
  Title?: { title: INotionTextObject[]; };
  Category: INotionRelationProperty;
  Subcategory: INotionRelationProperty;
}

export interface ICreatePatternPayload {
  parent: {
    database_id: string;
  };
  properties: IPatternProperties;
}

export interface IUpdatePatternPayload {
  page_id: string;
  properties: IPatternProperties;
}

export type PatternNotionPayload = ICreatePatternPayload | IUpdatePatternPayload;
