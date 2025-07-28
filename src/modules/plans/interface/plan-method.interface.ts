export const PLAN_METHOD = ["hourly", "daily", "monthly", "biannually", "annually"] as const

export type PlanMethod = (typeof PLAN_METHOD)[number]
