export type SupportBoundaryKind =
  | "self_harm"
  | "violence"
  | "coercion"
  | "stalking"
  | "physical_safety"
  | "overwhelming"
  | "dissociative"
  | "human_support";

export type SupportBoundaryInput = {
  selected: string | readonly string[] | undefined;
  supportValues?: readonly string[];
  overwhelmValues?: readonly string[];
  violenceValues?: readonly string[];
  physicalSafetyValues?: readonly string[];
  dissociativeValues?: readonly string[];
};

export function getSupportBoundaryKind(input: SupportBoundaryInput): SupportBoundaryKind | null {
  const selectedValues = normalizeSelected(input.selected);

  if (matchesAny(selectedValues, input.supportValues)) {
    return "human_support";
  }

  if (matchesAny(selectedValues, input.physicalSafetyValues)) {
    return "physical_safety";
  }

  if (matchesAny(selectedValues, input.violenceValues)) {
    return "violence";
  }

  if (matchesAny(selectedValues, input.dissociativeValues)) {
    return "dissociative";
  }

  if (matchesAny(selectedValues, input.overwhelmValues)) {
    return "overwhelming";
  }

  return null;
}

export function shouldShowSupportBoundary(input: SupportBoundaryInput): boolean {
  return getSupportBoundaryKind(input) !== null;
}

function normalizeSelected(selected: string | readonly string[] | undefined): string[] {
  if (!selected) return [];
  return typeof selected === "string" ? [selected] : [...selected];
}

function matchesAny(selected: readonly string[], candidates: readonly string[] | undefined): boolean {
  if (!candidates?.length) return false;
  return selected.some((value) => candidates.includes(value));
}
