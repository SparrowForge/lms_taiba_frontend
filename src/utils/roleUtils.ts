import { IUser } from "@/types/user";

export const hasAnyHeadRole = (user: IUser): boolean => {
  const headFields = ["isHeadOfDepartment", "isHeadOfHR", "isHeadOfAccount"];

  return user?.userRoles?.some((ur: IUser) =>
    headFields.some((field) => ur?.role?.[field] === true)
  );
};
