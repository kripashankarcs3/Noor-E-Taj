function getApiKey() {
  const fromStorage = localStorage.getItem('noor_api_key');
  if (fromStorage) return fromStorage;
  return import.meta.env.VITE_OPENROUTER_API_KEY;
}

export function saveApiKey(key) {
  localStorage.setItem('noor_api_key', key);
}

export function hasApiKey() {
  const key = getApiKey();
  return !!(key && key !== 'your_openrouter_api_key_here');
}

export async function askOpenRouter(prompt, systemInstruction = "") {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "BrideVerse AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash:free",
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter error response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Invalid response structure from OpenRouter");
    }
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return null;
  }
}
