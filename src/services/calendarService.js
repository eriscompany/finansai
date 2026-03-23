export async function safeCalendarPost(url, token, body) {
  if (!token) return null;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null;
  }
}
