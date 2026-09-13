export type TimelineStatus =
  | "date_missing"
  | "within_notification_period"
  | "within_application_period"
  | "beyond_240_days";

export type RegulatoryTimeline = {
  firstBillingDate?: string;
  notificationPeriodDay?: number;
  applicationPeriodDay?: number;
  approximateNotificationPeriodEnd?: string;
  approximateApplicationPeriodEnd?: string;
  status: TimelineStatus;
  messages: string[];
};

const NOTIFICATION_DAYS = 120;
const APPLICATION_DAYS = 240;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function dayIndex(start: Date, reference: Date): number {
  const ms = startOfDay(reference).getTime() - startOfDay(start).getTime();
  return Math.floor(ms / 86_400_000) + 1;
}

export function calculateFapTimeline(input: {
  firstPostDischargeBillingDate?: string;
  referenceDate?: Date;
}): RegulatoryTimeline {
  const messages: string[] = [];
  if (!input.firstPostDischargeBillingDate) {
    return {
      status: "date_missing",
      messages: [
        "A first post-discharge billing statement date is needed to estimate federal FAP timeline status. This is educational information, not legal advice.",
      ],
    };
  }

  const start = parseDate(input.firstPostDischargeBillingDate);
  if (!start) {
    return {
      firstBillingDate: input.firstPostDischargeBillingDate,
      status: "date_missing",
      messages: [
        "The billing statement date could not be read. Enter a date in YYYY-MM-DD format. This is educational information, not legal advice.",
      ],
    };
  }

  const reference = input.referenceDate ?? new Date();
  const notificationPeriodDay = dayIndex(start, reference);
  const applicationPeriodDay = notificationPeriodDay;
  const approximateNotificationPeriodEnd = isoDate(addDays(start, NOTIFICATION_DAYS - 1));
  const approximateApplicationPeriodEnd = isoDate(addDays(start, APPLICATION_DAYS - 1));

  let status: TimelineStatus;
  if (applicationPeriodDay > APPLICATION_DAYS) {
    status = "beyond_240_days";
    messages.push(
      "Based on the date entered, you appear to be beyond the federal 240-day FAP application period described by IRS regulations for applicable nonprofit hospitals. A hospital may still accept an application. This is educational information, not legal advice.",
    );
  } else if (notificationPeriodDay <= NOTIFICATION_DAYS) {
    status = "within_notification_period";
    messages.push(
      "Based on the date entered, you appear to be within the federal 240-day FAP application period described by IRS regulations for applicable nonprofit hospitals.",
    );
    messages.push(
      "Federal nonprofit-hospital rules generally restrict certain extraordinary collection actions during the initial 120-day notification period while reasonable FAP notification efforts occur. This is educational information, not legal advice.",
    );
  } else {
    status = "within_application_period";
    messages.push(
      "Based on the date entered, you appear to be within the federal 240-day FAP application period described by IRS regulations for applicable nonprofit hospitals. This is educational information, not legal advice.",
    );
  }

  return {
    firstBillingDate: input.firstPostDischargeBillingDate,
    notificationPeriodDay,
    applicationPeriodDay,
    approximateNotificationPeriodEnd,
    approximateApplicationPeriodEnd,
    status,
    messages,
  };
}
