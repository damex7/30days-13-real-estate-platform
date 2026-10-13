import { z } from "zod";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type Option = { value: string; label: string };

/** A select rendered by SearchFilters; each market builds its own list. */
export type SelectField = {
  name: string;
  label: string;
  anyLabel: string;
  options: readonly Option[];
  value: string | number | undefined;
  /** Render at half width so two fields share a row. */
  half?: boolean;
};

/** Search params arrive as `string | string[] | undefined`; blank means unset. */
function firstValue(value: unknown) {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export function intParam(min: number, max: number) {
  return z
    .preprocess(firstValue, z.coerce.number().int().min(min).max(max).optional())
    .catch(undefined);
}

export function textParam(maxLength: number) {
  return z.preprocess(firstValue, z.string().max(maxLength).optional()).catch(undefined);
}

export function enumParam<const T extends readonly { value: string }[]>(options: T) {
  const values = options.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];
  return z.preprocess(firstValue, z.enum(values).optional()).catch(undefined);
}

/** Forgives a reversed price range instead of returning nothing. */
export function orderedRange(min: number | undefined, max: number | undefined) {
  return min != null && max != null && min > max ? { min: max, max: min } : { min, max };
}

/** Serializes filter values into a URL, leaving out unset values and defaults. */
export function buildHref(
  basePath: string,
  values: Record<string, string | number | undefined>,
  defaults: Record<string, string | number> = {},
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value == null || defaults[key] === value) continue;
    params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function labelFor(options: readonly Option[], value: string | undefined) {
  return options.find((o) => o.value === value)?.label;
}
