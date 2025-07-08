import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "../api/getDocumentTypes";

export const useDocumentTypes = () => {
  return useQuery({
    queryKey: ["hr", "documentTypes"],
    queryFn: getDocumentTypes,
  });
};
