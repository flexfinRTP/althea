import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
mkdirSync(path.join(root, ".data"), { recursive: true });

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || "file:../.data/althea.db",
};

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env, shell: true, cwd: root });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "db", "push", "--skip-generate"]);
