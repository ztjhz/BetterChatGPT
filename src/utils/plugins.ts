import { v4 as uuidv4 } from 'uuid';

import {
  ChatCompletionFunctionCall,
  OpenAIFunctionDefinition,
  PluginDefinition,
} from '@type/plugin';

const functionNamePattern = /^[a-zA-Z0-9_-]{1,64}$/;

export const defaultPluginDefinitions = (): PluginDefinition[] => [
  {
    id: uuidv4(),
    name: 'calculate',
    description: 'Evaluate a basic arithmetic expression.',
    enabled: false,
    parameters: JSON.stringify(
      {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Arithmetic expression to evaluate.',
          },
        },
        required: ['expression'],
      },
      null,
      2
    ),
    code: [
      "const expression = String(args.expression ?? '');",
      "if (!/^[0-9+\\-*/().%\\s]+$/.test(expression)) {",
      "  throw new Error('Only basic arithmetic expressions are supported.');",
      '}',
      "const normalized = expression.replaceAll('%', '/100');",
      'return Function(`"use strict"; return (${normalized});`)();',
    ].join('\n'),
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const enabledPlugins = (plugins: PluginDefinition[]) =>
  plugins.filter((plugin) => plugin.enabled);

export const parsePluginParameters = (
  plugin: PluginDefinition
): Record<string, unknown> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(plugin.parameters);
  } catch (error) {
    throw new Error(
      `Plugin "${plugin.name}" has invalid parameter JSON: ${
        (error as Error).message
      }`
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(`Plugin "${plugin.name}" parameters must be a JSON object.`);
  }

  return parsed;
};

export const pluginsToOpenAIFunctions = (
  plugins: PluginDefinition[]
): OpenAIFunctionDefinition[] => {
  const names = new Set<string>();

  return plugins.map((plugin) => {
    if (!functionNamePattern.test(plugin.name)) {
      throw new Error(
        `Plugin "${plugin.name}" must use only letters, numbers, hyphens, or underscores.`
      );
    }
    if (names.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is defined more than once.`);
    }
    names.add(plugin.name);

    return {
      name: plugin.name,
      description: plugin.description,
      parameters: parsePluginParameters(plugin),
    };
  });
};

export const parseFunctionArguments = (
  functionCall: ChatCompletionFunctionCall
): Record<string, unknown> => {
  if (!functionCall.arguments) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(functionCall.arguments);
  } catch (error) {
    throw new Error(
      `Could not parse arguments for plugin "${functionCall.name}": ${
        (error as Error).message
      }`
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      `Plugin "${functionCall.name}" received non-object arguments.`
    );
  }

  return parsed;
};

export const runPlugin = async (
  plugin: PluginDefinition,
  args: Record<string, unknown>
): Promise<string> => {
  const runner = new Function(
    'args',
    `"use strict";\n${plugin.code}`
  ) as (args: Record<string, unknown>) => unknown;
  const result = await Promise.resolve(runner(args));

  if (result === undefined) return '';
  if (typeof result === 'string') return result;
  return JSON.stringify(result);
};
