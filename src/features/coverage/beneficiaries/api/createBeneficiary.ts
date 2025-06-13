import type { BeneficiaryCreate, BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";

export const createBeneficiary = async (beneficiaryData: BeneficiaryCreate): Promise<BeneficiaryReadWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/beneficiaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(beneficiaryData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to create beneficiary:", errorData);
    throw new Error("Failed to create beneficiary");
  }

  const data = await response.json();
  return data;
};
