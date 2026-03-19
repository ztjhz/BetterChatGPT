import { describe, it, expect } from 'vitest';
import {
  isMiniMaxEndpoint,
  isMiniMaxModel,
  clampMiniMaxTemperature,
} from '@utils/api';
import { modelOptions, modelMaxToken, modelCost } from '@constants/chat';
import { availableEndpoints, minimaxAPIEndpoint } from '@constants/auth';

describe('MiniMax utility functions', () => {
  describe('isMiniMaxEndpoint', () => {
    it('should detect MiniMax international endpoint', () => {
      expect(isMiniMaxEndpoint('https://api.minimax.io/v1/chat/completions')).toBe(true);
    });

    it('should detect MiniMax China endpoint', () => {
      expect(isMiniMaxEndpoint('https://api.minimaxi.com/v1/chat/completions')).toBe(true);
    });

    it('should not match OpenAI endpoint', () => {
      expect(isMiniMaxEndpoint('https://api.openai.com/v1/chat/completions')).toBe(false);
    });

    it('should not match Azure endpoint', () => {
      expect(isMiniMaxEndpoint('https://example.openai.azure.com')).toBe(false);
    });
  });

  describe('isMiniMaxModel', () => {
    it('should detect MiniMax-M2.7', () => {
      expect(isMiniMaxModel('MiniMax-M2.7')).toBe(true);
    });

    it('should detect MiniMax-M2.7-highspeed', () => {
      expect(isMiniMaxModel('MiniMax-M2.7-highspeed')).toBe(true);
    });

    it('should not match GPT models', () => {
      expect(isMiniMaxModel('gpt-4')).toBe(false);
      expect(isMiniMaxModel('gpt-3.5-turbo')).toBe(false);
    });
  });

  describe('clampMiniMaxTemperature', () => {
    it('should clamp temperature 0 to 0.01', () => {
      expect(clampMiniMaxTemperature(0)).toBe(0.01);
    });

    it('should clamp negative temperature to 0.01', () => {
      expect(clampMiniMaxTemperature(-1)).toBe(0.01);
    });

    it('should clamp temperature > 1 to 1', () => {
      expect(clampMiniMaxTemperature(1.5)).toBe(1);
      expect(clampMiniMaxTemperature(2)).toBe(1);
    });

    it('should keep valid temperature unchanged', () => {
      expect(clampMiniMaxTemperature(0.5)).toBe(0.5);
      expect(clampMiniMaxTemperature(0.7)).toBe(0.7);
      expect(clampMiniMaxTemperature(1)).toBe(1);
    });
  });
});

describe('MiniMax model constants', () => {
  it('should include MiniMax models in modelOptions', () => {
    expect(modelOptions).toContain('MiniMax-M2.7');
    expect(modelOptions).toContain('MiniMax-M2.7-highspeed');
  });

  it('should have correct max token for MiniMax models', () => {
    expect(modelMaxToken['MiniMax-M2.7']).toBe(204800);
    expect(modelMaxToken['MiniMax-M2.7-highspeed']).toBe(204800);
  });

  it('should have pricing info for MiniMax models', () => {
    expect(modelCost['MiniMax-M2.7']).toBeDefined();
    expect(modelCost['MiniMax-M2.7'].prompt.price).toBe(0.0003);
    expect(modelCost['MiniMax-M2.7'].completion.price).toBe(0.0012);

    expect(modelCost['MiniMax-M2.7-highspeed']).toBeDefined();
    expect(modelCost['MiniMax-M2.7-highspeed'].prompt.price).toBe(0.0006);
    expect(modelCost['MiniMax-M2.7-highspeed'].completion.price).toBe(0.0024);
  });
});

describe('MiniMax endpoint configuration', () => {
  it('should export minimaxAPIEndpoint constant', () => {
    expect(minimaxAPIEndpoint).toBe('https://api.minimax.io/v1/chat/completions');
  });

  it('should include MiniMax endpoint in availableEndpoints', () => {
    expect(availableEndpoints).toContain('https://api.minimax.io/v1/chat/completions');
  });
});
