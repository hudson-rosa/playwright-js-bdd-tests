// support/mobile/utils/process-utils.js

const { spawn } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

/**
 * Spawns a child process in a detached state (in the background).
 * It returns child (unref() already done).
 *
 * @param {string} command - The command to run.
 * @param {string[]} [args=[]] - List of string arguments.
 * @param {Object} [options={}] - Options for process spawning.
 * @param {string|Array|null} [options.stdio="ignore"] - Child's stdio configuration.
 * @param {Object} [options.env=process.env] - Environment key-value pairs.
 * @param {boolean} [options.shell=false] - If true, runs command inside a shell.
 * @param {string} [options.cwd=process.cwd()] - Current working directory of the child process.
 * @returns {ChildProcess} The spawned child process.
 */
function spawnDetached(command, args = [], options = {}) {
  const child = spawn(command, args, {
    detached: true,
    stdio: options.stdio || "ignore",
    env: options.env || process.env,
    shell: !!options.shell,
    cwd: options.cwd || process.cwd()
  });

  child.unref();
  return child;
}

/**
 * Spawns a child process with the given command and arguments, inheriting stdio from the parent process.
 * Useful for running 'npm run' commands.
 *
 * @param {string} command - The command to run.
 * @param {string[]} [args=[]] - List of string arguments.
 * @param {Object} [options={}] - Options for process spawning.
 * @param {Object} [options.env] - Environment key-value pairs to add or override.
 * @param {string} [options.cwd] - Current working directory of the child process.
 * @returns {Promise<number>} Resolves with the exit code of the child process, or rejects on error.
 */
function spawnInherit(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, ...(options.env || {}) },
      cwd: options.cwd || process.cwd()
    });

    child.on("close", (code) => {
      resolve(code);
    });
    child.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Waits for an HTTP GET request to the specified URL to return a response with status 200, 401, or 404,
 * retrying at specified intervals until a timeout is reached.
 *
 * @async
 * @param {string} url - The URL to send the HTTP GET request to.
 * @param {Object} [opts={}] - Optional configuration.
 * @param {number} [opts.timeout=15000] - Maximum time to wait in milliseconds.
 * @param {number} [opts.interval=500] - Interval between retries in milliseconds.
 * @returns {Promise<Object>} Resolves with the HTTP response object if a valid status is received.
 * @throws {Error} Throws an error if the timeout is reached before receiving a valid response.
 */
async function waitForHttp(url, opts = {}) {
  const { timeout = 15000, interval = 500 } = opts;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await axios.get(url, { timeout: 2000 });
      if (res && (res.status === 200 || res.status === 401 || res.status === 404)) {
        return res;
      }
    } catch (err) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Timeout waiting for HTTP ${url}`);
}

module.exports = {
  spawnDetached,
  spawnInherit,
  waitForHttp
};
