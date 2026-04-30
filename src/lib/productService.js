import { supabase } from "./supabase";

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
  return data;
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
  return data;
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
  return data;
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
  return [...values];
}

/**
 * Helper: Find the variant matching selected attribute values.
 */
export function findVariantByAttributes(product, selectedAttributes) {
  if (!product.product_variants?.length) return null;
  return (
    product.product_variants.find((v) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => String(v.attributes?.[key]) === String(value),
      ),
    ) || product.product_variants[0]
  );
}
