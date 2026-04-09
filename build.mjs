import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const packageJsonPath = "./package.json";
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const [major, minor, patch] = packageJson.version.split(".").map(Number);
const newVersion = `${major}.${minor}.${patch+ 1}`;

console.log(`Updating version from ${packageJson.version} to ${newVersion}`);

packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
 

console.log(`Published version ${newVersion} successfully!`);
