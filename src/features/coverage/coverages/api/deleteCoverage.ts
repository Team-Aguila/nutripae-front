export const deleteCoverage = async (id: string): Promise<void> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const url = new URL(`${base_coverage_url}/coverages/${id}`);
  const response = await fetch(url.toString(), {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete coverage");
  }
};
