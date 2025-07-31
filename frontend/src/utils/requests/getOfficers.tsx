import { courtClient } from "../../store";

export const getOfficersList = async (loggedInOfficerId: string) => {
  try {
    const response = await courtClient.getOfficers();
    return Array.isArray(response)
      ? response.filter((officer) => officer.id !== loggedInOfficerId)
      : [];
  } catch (error) {
    console.error("Error fetching officers:", error);
    return [];
  }
};
