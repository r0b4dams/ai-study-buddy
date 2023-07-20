import 'dotenv/config';
import { input } from '@inquirer/prompts';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';

const model = new OpenAI({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
});

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "JavaScript code that answers the user's question",
  explanation: 'detailed explanation of the example code provided',
});

const template = new PromptTemplate({
  template:
    'You are a javascript expert and will answer the user’s coding questions thoroughly as possible.\n{format_instructions}\n{question}',
  inputVariables: ['question'],
  partialVariables: { format_instructions: parser.getFormatInstructions() },
});

const init = async () => {
  while (true) {
    try {
      const question = await input({ message: 'Ask a coding question:' });
      switch (question) {
        default:
          const prompt = await template.format({ question });
          const output = await model.call(prompt);
          console.log(output); // parser.parse() throwing error when passing output
          break;

        case '':
          console.log('Please enter a coding question\n');
          break;

        case 'q':
        case 'quit':
        case 'exit':
          console.log('exiting...goodbye!');
          process.exit();
      }
    } catch (error) {
      console.log(error);
    }
  }
};

init();