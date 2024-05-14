import levenshtein from 'fast-levenshtein';
import { Prompt } from '@type/prompt';
import useStore from '@store/store';

export function findSimilarPrompts(userInput: string, prompts: Prompt[]): Prompt[] {
  return prompts
    .map(prompt => {
      const isSubstringInName = prompt.name.includes(userInput);
      const isSubstringInPrompt = prompt.prompt.includes(userInput);

      let distance;
      if (isSubstringInName) {
        distance = -2; // Prioritize name matches
      } else if (isSubstringInPrompt) {
        distance = -1; // Then prompt matches
      } else {
        distance = levenshtein.get(userInput, prompt.prompt); // Then use Levenshtein distance
      }

      return {
        ...prompt, 
        distance: distance,
        formattedTerm: userInput // Keep track of the user input that led to this match.
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);
}