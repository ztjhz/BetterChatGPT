export const createFile = async (accessToken: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'better-chatgpt.json');
  formData.append('description', 'Better ChatGPT Sync');

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  return res.json();
};

export const getFile = async (accessToken: string, fileId: string) => {
  const res = await fetch(
    `https://content.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.body;
};

export const updateFile = async (
  accessToken: string,
  fileId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );
  return await res.json();
};
