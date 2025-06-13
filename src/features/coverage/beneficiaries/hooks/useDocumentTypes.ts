import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "../api/catalogs/getDocumentTypes";

export function useDocumentTypes() {
  const query = useQuery({
    queryKey: ["document-types"],
    queryFn: getDocumentTypes,
    staleTime: Infinity, // These are static and shouldn't change
  });
  return query;
}
