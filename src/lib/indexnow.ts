/**
 * IndexNow Instant Search Engine Indexing Client
 * Automatically pushes updated and newly published Islamic articles,
 * categories, and sections to Microsoft Bing, Yandex, Seznam, Naver,
 * and integrated AI Search Engines within seconds.
 */

export const INDEXNOW_HOST = 'islam.org.bd';
export const INDEXNOW_KEY = 'c4b1d6e7f9a24385a812b7e0d39e8f5a';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexNowResult {
  success: boolean;
  submittedCount: number;
  statusCode?: number;
  error?: string;
}

/**
 * Submits one or more URLs to IndexNow protocol for instant indexing (0-5 seconds).
 */
export async function submitToIndexNow(urls: string | string[]): Promise<IndexNowResult> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  if (urlList.length === 0) {
    return { success: true, submittedCount: 0 };
  }

  // Ensure all URLs are absolute and belong to the verified host
  const sanitizedUrls = urlList.map(url => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `https://${INDEXNOW_HOST}${cleanPath}`;
  });

  const payload: IndexNowPayload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: sanitizedUrls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // 200: OK, 202: Accepted (queued for indexing)
    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Successfully pushed ${sanitizedUrls.length} URL(s) to search engines:`, sanitizedUrls);
      return {
        success: true,
        submittedCount: sanitizedUrls.length,
        statusCode: response.status,
      };
    } else {
      const errorText = await response.text().catch(() => '');
      console.warn(`[IndexNow] Non-200 response (${response.status}):`, errorText);
      return {
        success: false,
        submittedCount: 0,
        statusCode: response.status,
        error: `IndexNow API returned status ${response.status}: ${errorText}`,
      };
    }
  } catch (err: any) {
    // Graceful fallback - offline or dev environment shouldn't break admin operations
    console.warn('[IndexNow] Notification skipped or network unavailable:', err?.message || err);
    return {
      success: false,
      submittedCount: 0,
      error: err?.message || 'Network error occurred during IndexNow push',
    };
  }
}
