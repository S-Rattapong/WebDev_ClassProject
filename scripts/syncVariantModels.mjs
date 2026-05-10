import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { readdir } from "node:fs/promises";

const supabase = createClient(
  "https://awkzqnzzkakjpdosljzz.supabase.co",
  "sb_publishable_ovJ8N_Nxk6vec8IcNhW69w_8Oqdxxud",
);

const MODELS_ROOT = path.resolve("public/models");

async function readGlbPaths(relativeDir) {
  const absoluteDir = path.join(MODELS_ROOT, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".glb"))
    .map((entry) => `/models/${relativeDir.replace(/\\/g, "/")}/${entry.name}`);
}

function numberFromText(value) {
  if (value === undefined || value === null) return null;
  const matched = String(value).match(/\d+(\.\d+)?/);
  return matched ? Number(matched[0]) : null;
}

function findBearingModel(attributes, bearingPaths) {
  const inner = numberFromText(attributes?.inner_dia);
  const outer = numberFromText(attributes?.outer_dia);
  const thickness = numberFromText(attributes?.thickness);
  if (!inner || !outer || !thickness) return "";

  const pattern = new RegExp(`(?:^|/)d${inner}_d${outer}_b${thickness}\\.glb$`, "i");
  return bearingPaths.find((filePath) => pattern.test(filePath)) || "";
}

function findTimingPulleyModel(attributes, pulleyPaths) {
  const width = numberFromText(attributes?.belt_width);
  const teeth = numberFromText(attributes?.teeth);
  if (!width || !teeth) return "";

  const pattern = new RegExp(`(?:^|/)tp${width}_${teeth}t\\.glb$`, "i");
  return pulleyPaths.find((filePath) => pattern.test(filePath)) || "";
}

async function main() {
  const [bearingPaths, pulleyPaths] = await Promise.all([
    readGlbPaths("Bearing"),
    readGlbPaths("timimg pulleys"),
  ]);

  const { data: variants, error: fetchError } = await supabase
    .from("product_variants")
    .select("variant_id, product_id, model, attributes");

  if (fetchError) {
    throw fetchError;
  }

  const updates = [];

  for (const variant of variants || []) {
    let modelPath = "";

    if (variant.product_id === "11111111-0001-0001-0001-000000000001") {
      modelPath = findBearingModel(variant.attributes, bearingPaths);
    } else if (variant.product_id === "11111111-0001-0001-0001-000000000003") {
      modelPath = findTimingPulleyModel(variant.attributes, pulleyPaths);
    }

    if (modelPath && modelPath !== variant.model) {
      updates.push({
        variant_id: variant.variant_id,
        model: modelPath,
      });
    }
  }

  for (const item of updates) {
    const { error } = await supabase
      .from("product_variants")
      .update({ model: item.model })
      .eq("variant_id", item.variant_id);

    if (error) {
      throw error;
    }
  }

  console.log(`Updated ${updates.length} variant model path(s).`);
  if (updates.length) {
    console.log(JSON.stringify(updates, null, 2));
  }
}

main().catch((error) => {
  console.error("Failed to sync model paths:", error.message);
  process.exit(1);
});
