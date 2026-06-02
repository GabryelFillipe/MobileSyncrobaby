import type { AgeGroup } from "../services/ageGroup/ageGroup.service";
import Date from "./Date";

export function calculateAgeChild(
  child_birth_date: string,
  ageGroup: AgeGroup[],
) {
  const babyMonths: number = Date.subMonthsFormated(child_birth_date);

  const grouAge: AgeGroup[] = ageGroup.filter(
    (it) => it.min_months <= babyMonths && it.max_months >= babyMonths,
  );
  return grouAge.length > 0 ? grouAge[0].id_age_group : 1;
}
