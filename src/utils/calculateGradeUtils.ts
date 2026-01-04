export const calculateGrade = (
  marks: number | null,
  gradeRules: any[],
): string => {
  if (marks === null || !gradeRules?.length) return "-"

  const rule = gradeRules.find(
    (r) =>
      r.status === "active" &&
      marks >= r.minMarks &&
      marks <= r.maxMarks,
  )

  return rule?.grade ?? "-"
}