import { describe, it, expect, beforeEach } from '@jest/globals';
import { RagService } from '../../src/services/rag/rag.service';

describe('Unit Test: In-Memory RAG Engine & Chunk Retrieval', () => {
  let ragService: RagService;

  beforeEach(() => {
    ragService = new RagService();
  });

  it('should retrieve drone surveillance policy chunk for drone queries', () => {
    const results = ragService.retrieve('What is the maximum flight altitude for drone patrol?');

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0]!;
    expect(topMatch.chunkId).toBe('policy-sec-2');
    expect(topMatch.content).toContain('120m AGL');
    expect(topMatch.similarityScore).toBeGreaterThan(0.2);
  });

  it('should retrieve sensor calibration policy chunk for vibration sensor questions', () => {
    const results = ragService.retrieve('What is the calibration requirement for IoT vibration sensors?');

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0]!;
    expect(topMatch.chunkId).toBe('policy-sec-3');
    expect(topMatch.content).toContain('180 days');
    expect(topMatch.content).toContain('ISO-9001');
  });

  it('should retrieve spatial zone camera blindness chunk for CCTV queries', () => {
    const results = ragService.retrieve('How should we handle camera blindness in zone 4?');

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0]!;
    expect(topMatch.chunkId).toBe('policy-sec-4');
    expect(topMatch.content).toContain('camera blindness');
  });
});
