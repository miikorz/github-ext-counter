import { baseUrl } from './repositories/github/apiParams';

export async function httpGET<T>(url: string, headers: Record<string, string> = {
  // TODO: move header constant to github repository
  'Accept': 'application/vnd.github.v3+json',
}): Promise<T> {
  const options = {
    method: 'GET',
    headers,
  };
  try {
    const res = await fetch(`${baseUrl}${url}`, options)
    return await res.json()
  } catch (error: any) {
    throw new Error(error);
  }
}