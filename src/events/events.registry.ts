export const EventRegistry = {
  CREATE_NOTIFICATION: "notification.create",
  PAYROLL_APPROVE_REQUEST: "payroll.approve.request",
  PAYROLL_APPROVED: "payroll.approve.success",
  PAYROLL_REJECTED: "payroll.approve.rejected",
  PAYROLL_COMPLETED: "payroll.completed",
  PAYROLL_STATUS: "payroll.status",
  SALARY_PAID: "salary.paid",
  WALLET_CREATED_SUCCESS: "wallet.created.success",
  WALLET_TOP_UP: "wallet.topup"
} as const

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry]
