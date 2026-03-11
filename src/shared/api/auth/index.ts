type BackendPostOptions = {
  headers?: Record<string, string>;
};

export async function backendPost<TResponse>(
  path: string,
  body: unknown,
  options: BackendPostOptions = {},
): Promise<TResponse> {
  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) throw new Error("BACKEND_URL is not set");

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as TResponse;
}
