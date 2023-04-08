export interface GoogleUploadFileResponse {
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
