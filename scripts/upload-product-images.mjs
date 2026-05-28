import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const bucket = "product-images";

const sourceImages = {
  tee: "public/images/boxy_tee_studio.png",
  hoodie: "public/images/everyday_hoodie_studio.png",
  pant: "public/images/cargo_pant_studio.png",
  hanger: "public/images/clothes_hanger_woven.png",
};

const productImages = [
  ["classic/plain-essentials/clean-crew-tee.png", "tee"],
  ["classic/plain-essentials/everyday-oxford-shirt.png", "tee"],
  ["classic/formal-edit/soft-structure-blazer.png", "hanger"],
  ["classic/formal-edit/tailored-waistcoat.png", "hanger"],
  ["classic/refined-basics/folded-seam-overshirt.png", "hanger"],
  ["classic/refined-basics/paperweight-trouser.png", "pant"],
  ["summer/sky-t-shirts/skyline-pocket-tee.png", "tee"],
  ["summer/sky-t-shirts/sun-drift-tee.png", "tee"],
  ["summer/light-pants/breeze-cotton-pant.png", "pant"],
  ["summer/light-pants/open-air-chino.png", "pant"],
  ["summer/summer-sets/sunset-easy-set.png", "hanger"],
  ["summer/summer-sets/poolside-knit-polo.png", "tee"],
  ["winter/ice-hoodies/frostline-hoodie.png", "hoodie"],
  ["winter/ice-hoodies/snowfield-zip-hoodie.png", "hoodie"],
  ["winter/cold-air-jackets/cold-air-puffer.png", "hanger"],
  ["winter/cold-air-jackets/glacier-shell-jacket.png", "hanger"],
  ["winter/winter-essentials/thermal-layer-tee.png", "tee"],
  ["winter/winter-essentials/quiet-snow-scarf.png", "hanger"],
];

async function loadEnvFile(fileName) {
  try {
    const contents = await readFile(path.join(root, fileName), "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const cache = new Map();

async function readSource(kind) {
  if (!sourceImages[kind]) {
    throw new Error(`Unknown product image source: ${kind}`);
  }

  if (!cache.has(kind)) {
    cache.set(kind, await readFile(path.join(root, sourceImages[kind])));
  }

  return cache.get(kind);
}

async function uploadObject(objectPath, kind) {
  const bytes = await readSource(kind);
  const url = `${supabaseUrl}/storage/v1/object/${bucket}/${encodeURI(objectPath)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "cache-control": "31536000",
      "content-type": "image/png",
      "x-upsert": "true",
    },
    body: bytes,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to upload ${objectPath}: ${response.status} ${message}`);
  }

  console.log(`Uploaded ${bucket}/${objectPath}`);
}

for (const [objectPath, kind] of productImages) {
  await uploadObject(objectPath, kind);
}
