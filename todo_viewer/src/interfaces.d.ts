export interface IUserInfo {
  token: string;
  "@odata.context": string;
  displayName: string;
  surname: string;
  givenName: string;
  id: string | null;
  userPrincipalName: string;
  businessPhones: any[];
  jobTitle: any;
  mail: any;
  mobilePhone: any;
  officeLocation: any;
  preferredLanguage: any;
}

export interface ITarefa {
  "@odata.etag": string;
  importance: string;
  isReminderOn: boolean;
  status: string;
  title: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  hasAttachments: boolean;
  categories: any[];
  id: string;
  body: {
    content: string;
    contentType: string;
  };
  completedDateTime: ITodoDateTime;
  reminderDateTime: ITodoDateTime;
  dueDateTime: ITodoDateTime;
  "linkedResources@odata.context": string;
  linkedResources: ILinkedResource[];
  lista: ITodoList;
}

export interface ITodoList {
  "@odata.etag": string;
  displayName: string;
  isOwner: boolean;
  isShared: boolean;
  wellknownListName: string;
  id: string;
};

interface ITodoDateTime {
  dateTime: string;
  timeZone: string;
}

interface ILinkedResource {
  webUrl: string;
  applicationName: string;
  displayName: string;
  externalId: string;
  id: string;
}