import { supabase } from "./supabase";

function inferAttributesFromModel(modelPath) {
  if (!modelPath) return null;

  const bearingMatch = modelPath.match(/\/models\/Bearing\/[bd](\d+)_d(\d+)_b(\d+)\.glb$/i);
  if (bearingMatch) {
    return {
      inner_diameter: Number(bearingMatch[1]),
      outer_diameter: Number(bearingMatch[2]),
      width: Number(bearingMatch[3]),
    };
  }

  return null;
}

function normalizeProduct(product) {
  const variants = (product.product_variants || []).map((variant) => {
    const hasAttributes =
      variant.attributes &&
      typeof variant.attributes === "object" &&
      Object.keys(variant.attributes).length > 0;

    return {
      ...variant,
      attributes: hasAttributes ? variant.attributes : inferAttributesFromModel(variant.model) || {},
    };
  });

  return {
    ...product,
    product_variants: variants,
  };
}

/**
 * Fetch all products with their variants from Supabase.
 * Uses a join: products → product_variants
 */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      product_id,
      name,
      description,
      images,
      product_variants (
        variant_id,
        model,
        price,
        stock,
        attributes
      )
    `)
    .order("product_id", { ascending: true });

  if (error) throw error;
  return (data || []).map(normalizeProduct);
}

/**
 * Fetch a single product with its variants by product_id.
 */
export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      product_id,
      name,
      description,
      images,
      product_variants (
        variant_id,
        model,
        price,
        stock,
        attributes
      )
    `)
    .eq("product_id", productId)
    .single();

  if (error) throw error;
  return data ? normalizeProduct(data) : data;
}

/**
 * Search products by name or description (with variants).
 */
export async function searchProducts(keyword) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      product_id,
      name,
      description,
      images,
      product_variants (
        variant_id,
        model,
        price,
        stock,
        attributes
      )
    `)
    .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    .order("product_id", { ascending: true });

  if (error) throw error;
  return (data || []).map(normalizeProduct);
}

/**
 * Helper: Get the minimum price across all variants of a product.
 */
export function getMinPrice(product) {
  if (!product.product_variants?.length) return 0;
  return Math.min(...product.product_variants.map((v) => v.price));
}

/**
 * Helper: Get total stock across all variants.
 */
export function getTotalStock(product) {
  if (!product.product_variants?.length) return 0;
  return product.product_variants.reduce((sum, v) => sum + v.stock, 0);
}

/**
 * Helper: Extract all unique attribute keys across variants.
 */
export function getAttributeKeys(product) {
  if (!product.product_variants?.length) return [];
  const keysSet = new Set();
  product.product_variants.forEach((v) => {
    if (v.attributes) {
      Object.keys(v.attributes).forEach((key) => keysSet.add(key));
    }
  });
  return [...keysSet];
}

/**
 * Helper: Get unique values for a specific attribute key.
 */
export function getAttributeOptions(product, key) {
  if (!product.product_variants?.length) return [];
  const values = new Set();
  product.product_variants.forEach((v) => {
    if (v.attributes?.[key] !== undefined) {
      values.add(String(v.attributes[key]));
    }
  });
  return sortAttributeValues(values);
}

function matchesSelectedAttributes(variant, selectedAttributes) {
  return Object.entries(selectedAttributes).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    return String(variant.attributes?.[key]) === String(value);
  });
}

function sortAttributeValues(values) {
  return [...values].sort((left, right) =>
    String(left).localeCompare(String(right), undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

/**
 * Helper: Get options for an attribute constrained by current selections.
 * - Keeps only options that can still form a valid variant.
 */
export function getConstrainedAttributeOptions(product, key, selectedAttributes) {
  if (!product.product_variants?.length) return [];

  const selectionWithoutTargetKey = Object.fromEntries(
    Object.entries(selectedAttributes || {}).filter(([selectedKey]) => selectedKey !== key),
  );

  const values = new Set();
  product.product_variants
    .filter((variant) => matchesSelectedAttributes(variant, selectionWithoutTargetKey))
    .forEach((variant) => {
      if (variant.attributes?.[key] !== undefined) {
        values.add(String(variant.attributes[key]));
      }
    });

  return sortAttributeValues(values);
}

/**
 * Helper: Find the variant matching selected attribute values.
 */
export function findVariantByAttributes(product, selectedAttributes) {
  if (!product.product_variants?.length) return null;

  const exact = product.product_variants.find((variant) => matchesSelectedAttributes(variant, selectedAttributes));
  if (exact) return exact;

  // Fallback: find the variant that matches most selected keys.
  const ranked = [...product.product_variants].sort((left, right) => {
    const leftScore = Object.entries(selectedAttributes || {}).reduce((score, [key, value]) => {
      return String(left.attributes?.[key]) === String(value) ? score + 1 : score;
    }, 0);
    const rightScore = Object.entries(selectedAttributes || {}).reduce((score, [key, value]) => {
      return String(right.attributes?.[key]) === String(value) ? score + 1 : score;
    }, 0);
    return rightScore - leftScore;
  });

  return ranked[0] || null;
}
