import type { BeneficiaryUpdate, BeneficiaryReadWithDetails } from "@team-aguila/pae-cobertura-client";

interface UpdateBeneficiaryParams {
  id: string;
  data: BeneficiaryUpdate;
}

export const updateBeneficiary = async ({ id, data }: UpdateBeneficiaryParams): Promise<BeneficiaryReadWithDetails> => {
  const base_coverage_url = import.meta.env.VITE_PUBLIC_BASE_COVERAGE_URL;
  const response = await fetch(`${base_coverage_url}/beneficiaries/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to update beneficiary:", errorData);
    throw new Error("Failed to update beneficiary");
  }

  const responseData = await response.json();
  return responseData;
};
