require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resultsDir = path.resolve(__dirname, `./../allure-results/${process.env.BROWSER}`);


async function askGPTAboutFailure(resultsFfile) {
  const prompt =
    `Analyze the error or failures in the log file from the Allure Report and suggest a fix to the lines where you see an error or exceptions:\n\n` +
    `Test: ${resultsFfile.name}\n` +
    `Tags: ${resultsFfile.tags.join(", ")}\n` +
    `Error Message: ${resultsFfile.message}\n\n` +
    `Stack Trace:\n${resultsFfile.trace}\n`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  console.log("Root cause suggestion:", completion.choices[0].message.content);
  return completion.choices[0].message.content;
}


async function main() {
  const testFiles = fs.readdirSync(resultsDir).filter(file => file.endsWith('-result.json'));

  const failures = [];
  // console.log(`🔍 Searching files in: ${resultsDir}...`);
  console.log(`🔍 Analyzing ${testFiles.length} test files in ${resultsDir}...`);

  for (const file of testFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));

    if (data.status === 'failed' || data.status === 'broken' || data.statusDetails?.message?.includes("Error")) {
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