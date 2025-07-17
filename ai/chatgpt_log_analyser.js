require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resultsDir = path.resolve(__dirname, '../allure-results');

async function askGPTAboutFailure(resultsFfile) {
  const content = fs.readFileSync(resultsFfile, "utf8");
  const prompt =
    `If my Playwright test has failures, analyze the error log from the Allure Report and suggest a fix to the lines where you see an error or exceptions:\n\n` +
    `Test: ${resultsFfile.name}\n` +
    `Tags: ${resultsFfile.tags.join(", ")}\n` +
    `Error Message: ${resultsFfile.message}\n\n` +
    `Stack Trace:\n${resultsFfile.trace}\n`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });

  console.log("Root cause suggestion:", completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

async function main() {
  const testFiles = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));

  const failures = [];

  for (const file of testFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));

    if (data.status === 'failed') {
      failures.push({
        name: data.name,
        message: data.statusDetails?.message || '',
        trace: data.statusDetails?.trace || '',
        tags: data.labels?.filter(l => l.name === 'tag').map(t => t.value) || [],
      });
    }
  }

  console.log(`🔍 Found ${failures.length} failed test(s).`);

  for (const failure of failures) {
    console.log(`\n❌ Analyzing test: "${failure.name}"`);
    const suggestion = await askGPTAboutFailure(failure);
    console.log(`🧠 ChatGPT Suggestion:\n${suggestion}`);
  }
}

main().catch(err => console.error('Error:', err));