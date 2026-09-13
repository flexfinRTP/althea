import { getStore, saveStore } from "../lib/db/store";

const store = getStore();
console.log(`Seeded hospitals: ${store.hospitals.map((h) => h.name).join(", ")}`);
console.log(`Program: ${store.program.name}`);
saveStore();
