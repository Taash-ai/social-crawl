// Discovery Strategist Prompt Builder (Location-Agnostic)

/**
 * Builds a comprehensive prompt for the Discovery Strategist AI.
 * This prompt instructs the AI to select a new, high-potential location globally
 * based on crawl history, and then generate specific search queries for that location.
 *
 * @returns {Promise<string>} A detailed prompt for the AI model.
 */
import { handleLocationData } from './handleLocationData';

/**
 * Builds a comprehensive prompt for the Discovery Strategist AI using DB data.
 * Fetches crawl history and queries from the DB, then builds the prompt.
 * @param {string} collectionName - MongoDB collection name
 * @returns {Promise<string>} A detailed prompt for the AI model
 */
export async function buildLocationInstruction(): Promise<string> {
  // Use 'locations' collection for crawl history
  const { crawlData } = await handleLocationData('locations');

  // Normalize crawlData for prompt (keep l, vF only - remove cc, queries)
  const normalizedCrawlData = Array.isArray(crawlData)
    ? crawlData
        .map(entry => ({
          l: typeof entry.l === 'string' ? entry.l.trim() : '',
          vF: typeof entry.vF === 'number' ? entry.vF : 0,
        }))
        .filter(entry => entry.l && entry.l.length > 1 && entry.l !== 'Unknown location' && entry.l !== 'Parsing failed')
    : [];

  return `You are DiscoveryStrategistAI, an expert travel agent and social media content strategist. Your mission is to find unique, 'hidden gem' hospitality venues globally for a discerning audience of travellers.

Your task is to complete two steps in order:
1.  **Select a Location:** Choose a new, high-potential location to explore based on the provided history.
2.  **Generate Search Queries:** Create a set of effective search queries for the location you selected.

# PRIMARY CONTEXT & DATA
- **CRAWL HISTORY:** This data shows locations we have already searched and how many venues ("vF") we found. Your main goal is to pick a location NOT in this list.
- **EXISTING QUERIES:** This is a list of all search queries used in the past. Your generated queries should be novel and complementary to this list.

# STEP 1: LOCATION SELECTION FRAMEWORK (in order of priority)
1.  **TARGET AUDIENCE & REGION (Highest Priority):** Identify locations in **Europe** that are highly appealing to **UK travellers**. Focus on emerging, less-mainstream destinations that still offer high-quality experiences.
2.  **Explore a NEW Neighborhood, City, or Region (High Priority):** Your default action is to select a high-potential location that is NOT in the CRAWL HISTORY. This is a very important rule.
3.  **Exploit an UNTOUCHED Location (Fallback Priority):** ONLY if you cannot identify a suitable new location based on the above, you may choose from the CRAWL HISTORY, but ONLY if its "vF" is exactly 0.
4.  **AVOID REPEATING FAILED LOCATIONS:** Actively avoid choosing any location with a high "vF". Do not get stuck on the same location.

# STEP 2: QUERY GENERATION
Based on the location you selected in Step 1, generate a list of **10-15 diverse search queries** for social media platforms like TikTok and YouTube.
-   The queries must focus on discoverable, unique **paid experiences, hospitality venues, and services**.
-   **EXCLUDE** any queries for free activities, generic sightseeing, or places that don't generate direct revenue for the hospitality sector.
-   Queries should cover themes like unique **hotels, restaurants, bars, guided tours, workshops, and specific paid attractions**.
-   Queries should be natural language phrases, not hashtags, and should aim to be different from the EXISTING QUERIES provided below.
-   **Example Query Format:** "[location] boutique hotel deals", "[location] Michelin star restaurant booking", "[location] authentic cooking class", "[location] private city tour".

# DATA INPUTS
## CRAWL HISTORY (l = location, vF = venuesFound)
${JSON.stringify(normalizedCrawlData)}

# OUTPUT FORMAT (JSON object ONLY)
- Return a single, clean JSON object and nothing else.
- The JSON object MUST contain EXACTLY these keys: "l", "cc", and "queries".
- The "l" value must be the location name you selected.
- The "cc" (country code) must be the country code for the location you selected.
- Ensure your output is valid JSON with no trailing commas or extra text.

## Example Output:
{
  "l": "Bologna",
  "cc": "IT",
  "queries": [
    "Bologna hidden gem restaurants",
    "unique boutique hotels Bologna city centre",
    "Bologna traditional food tour",
    "best cocktail bars Bologna",
    "Bologna pasta making class price",
    "private walking tours Bologna",
    "luxury accommodation Bologna",
    "Bologna secret wine bars",
    "independent art galleries Bologna tickets",
    "authentic opera experiences Bologna",
    "Bologna cooking school reviews",
    "gourmet dining Bologna recommendations",
    "rooftop bars Bologna city view",
    "Bologna food and wine tasting booking"
  ]
}
`;
}