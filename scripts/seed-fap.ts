import { getStore, saveStore } from "../lib/db/store";

async function main() {
  const store = await getStore();
  await saveStore();
  console.log(`Seeded hospitals: ${store.hospitals.map((h) => h.name).join(", ")}`);
  console.log(`Program: ${store.program.name}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
