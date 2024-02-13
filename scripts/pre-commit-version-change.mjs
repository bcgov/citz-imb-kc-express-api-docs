import fs from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

// Check commit message for version change type
const checkCommitMessageForVersionChange = (commitMsgPath) => {
  const commitMsg = fs.readFileSync(commitMsgPath, "utf8");
  const versionChangeRegex = /^(patch|minor|major)\b/i;

  const matchResult = commitMsg.match(versionChangeRegex);
  if (!matchResult) {
    console.error(
      'Commit message must start with "Patch", "Minor", or "Major" to indicate the version change type.'
    );
    process.exit(1); // Abort the commit
  }

  const versionChangeType = matchResult[0].toLowerCase();

  return versionChangeType;
};

// Execute bump-version.js script
const executeBumpVersion = (versionChange) => {
  const scriptPath = resolve(process.cwd(), "scripts/bump-version.mjs");
  execSync(`node ${scriptPath} ${versionChange}`, { stdio: "inherit" });
};

// Main function to run the pre-commit hook logic
const main = () => {
  // The path to the temporary file that contains the commit message is passed by Git to the pre-commit hook script
  const commitMsgPath = process.argv[2];

  if (!commitMsgPath) {
    console.error("Error: Commit message file path not provided.");
    process.exit(1);
  }

  try {
    const versionChange = checkCommitMessageForVersionChange(commitMsgPath);
    executeBumpVersion(versionChange);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

main();
