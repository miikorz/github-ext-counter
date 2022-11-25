import { baseUrl } from './apiParams';

export async function makeRequest(url: string) {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  };
  let response;

  try {
    await fetch(`${baseUrl}${url}`, options)
      .then((res) => res.json())
      .then((data) => {
        response = data;
      });
  } catch (error: any) {
    throw new Error(error);
  }

  return response;
}

export default makeRequest;
