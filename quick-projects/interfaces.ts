export interface IMe {
  "@odata.context": string;
  userPrincipalName: string;
  id: string;
  displayName: string;
  surname: string;
  givenName: string;
  preferredLanguage: string;
  mail: string;
  mobilePhone: null;
  jobTitle: null;
  officeLocation: null;
  businessPhones: string[];
}

export interface GraphEmailAddress {
  emailAddress: {
    name: string;
    address: string;
  }
}

export interface GraphMessagesResponse {
  value: IMessage[];
  "@odata.context"?: string;
  "@odata.nextLink"?: string;
}

export interface IMessage {
  id: string;
  receivedDateTime: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  webLink: string;
  sender: GraphEmailAddress;
  from: GraphEmailAddress;
  "@odata.etag": string;
  body: { contentType: string; content: string }
}


