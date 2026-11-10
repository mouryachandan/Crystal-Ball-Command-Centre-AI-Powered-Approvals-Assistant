import { OPERATIONAL_POLICY_CHUNKS, PolicyChunk } from '../../fixtures/policyDocument';

export interface ScoredPolicyChunk extends PolicyChunk {
  similarityScore: number;
}

export class RagService {
  private chunks: PolicyChunk[];
  private stopWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'is',
    'are',
    'was',
    'were',
    'be',
    'by',
    'this',
    'that',
    'it',
    'as',
    'from',
  ]);

  constructor(chunks: PolicyChunk[] = OPERATIONAL_POLICY_CHUNKS) {
    this.chunks = chunks;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2 && !this.stopWords.has(token));
  }

  /**
   * Retrieves the top-K policy chunks matching the query using weighted term-frequency
   * and curated keyword overlap.
   */
  public retrieve(query: string, topK = 2): ScoredPolicyChunk[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) {
      return this.chunks.slice(0, topK).map((c) => ({ ...c, similarityScore: 0.5 }));
    }

    const scored = this.chunks.map((chunk) => {
      const contentTokens = this.tokenize(chunk.content);
      const titleTokens = this.tokenize(chunk.sectionTitle);

      let score = 0;

      for (const qToken of queryTokens) {
        // Keyword exact match bonus (high signal)
        if (chunk.keywords.some((k) => k.toLowerCase().includes(qToken))) {
          score += 3.0;
        }

        // Title match bonus
        const titleOccurrences = titleTokens.filter((t) => t === qToken).length;
        score += titleOccurrences * 2.0;

        // Content term frequency
        const contentOccurrences = contentTokens.filter((c) => c === qToken).length;
        score += contentOccurrences * 1.0;
      }

      // Normalize score between 0 and 1
      const normalizedScore = Math.min(1, Number((score / (queryTokens.length * 4)).toFixed(2)));

      return {
        ...chunk,
        similarityScore: Math.max(0.1, normalizedScore),
      };
    });

    // Sort descending by similarity score
    scored.sort((a, b) => b.similarityScore - a.similarityScore);

    return scored.slice(0, topK);
  }
}

