require('dotenv').config();

const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');

// IMPORTANT: Use same model as your file
const model = google('gemini-2.5-flash');


async function test() {
  try {
    console.log("Testing Gemini connection...");

    const { text } = await generateText({
      model,
      prompt: "Say hello in one sentence.",
      temperature: 0.5
    });

    console.log("✅ SUCCESS:");
    console.log(text);

  } catch (error) {
    console.error("❌ ERROR:");
    console.error(error);
  }
}

test();
