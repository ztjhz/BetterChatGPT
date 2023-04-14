export interface GoogleFileResource {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
}

export interface GoogleTokenInfo {
  azp: string;
  aud: string;
  sub: string;
  scope: string;
  exp: string;
  expires_in: string;
  email: string;
  email_verified: string;
  access_type: string;
}

export interface GoogleFileList {
  nextPageToken?: string;
  kind: string;
  incompleteSearch: boolean;
  files: GoogleFileResource[];
}

export type SyncStatus = 'unauthenticated' | 'syncing' | 'synced';
