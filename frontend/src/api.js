const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URLS = configuredApiBaseUrl
  ? [configuredApiBaseUrl]
  : ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:8010", "http://127.0.0.1:8010"];

class ApiResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiResponseError";
  }
}

export async function analyzePullRequests({ repoUrl, maxPrs, useLlm }) {
  let lastError;

  for (const apiBaseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${apiBaseUrl}/analyze-prs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          repo_url: repoUrl,
          max_prs: Number(maxPrs),
          use_llm: Boolean(useLlm)
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new ApiResponseError(data.detail || "Unable to analyze pull requests.");
      }
      return data;
    } catch (error) {
      if (error instanceof ApiResponseError) {
        throw error;
      }
      lastError = error;
    }
  }

  throw new Error(lastError?.message || "Unable to reach the PR Mentor AI backend.");
}
