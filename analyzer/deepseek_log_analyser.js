require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const resultsDir = path.resolve(__dirname, `./../allure-results/${process.env.BROWSER}`);

async function askDeepSeekAboutFailure(resultsFfile) {
  const prompt =
    `Analyze the error or failures in the log file from the Allure Report and suggest a fix to the lines where you see an error or exceptions:\n\n` +
    `Test: ${resultsFfile.name}\n` +
    `Tags: ${resultsFfile.tags.join(", ")}\n` +
    `Error Message: ${resultsFfile.message}\n\n` +
    `Stack Trace:\n${resultsFfile.trace}\n`;

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const suggestion = response.data.choices[0].message.content;
    console.log("💡 DeepSeek Suggestion:\n", suggestion);
    return suggestion;
  } catch (error) {
    console.error("❌ DeepSeek API Error:", error.response?.data || error.message);
    return "Error contacting DeepSeek API.";
  }
}


async function main() {
  const testFiles = fs.readdirSync(resultsDir).filter(file => file.endsWith('-result.json'));
  const failures = [];

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
    const suggestion = await askDeepSeekAboutFailure(failure);
    console.log(`🧠 DeepSeek Suggestion:\n${suggestion}`);
  }
}

main().catch(err => console.error('Error:', err));
