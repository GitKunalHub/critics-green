import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

async function main(input) {
  const messages = [{ role: "user", content: input }];
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
    temperature: 0,
  });

  return completion.data.choices[0].message.content;
}

const question = "What is capital of France";

main(question)
  .then((completion) => console.log(completion))
  .catch((error) => console.log(error));
