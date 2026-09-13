"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, fieldDescribedBy, inputClass } from "@/components/ui/Field";
import { api } from "@/lib/client/api";
import {
  CASE_FIELD_ORDER,
  MIN_BILL_DATE,
  caseCreateSchema,
  fieldErrors,
  todayIsoDate,
  visibleFieldError,
} from "@/lib/validation";
import demo from "@/data/demo/example-medical-center.json";

type Hospital = { id: string; name: string; state?: string };
type Touched = Record<string, boolean>;

export default function CheckPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [income, setIncome] = useState("");
  const [insurance, setInsurance] = useState("insured");
  const [billDate, setBillDate] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Touched>({});

  const maxDate = useMemo(() => todayIsoDate(), []);

  const values = {
    hospitalId,
    billAmount,
    householdSize,
    householdAnnualIncome: income,
    insuranceStatus: insurance,
    firstPostDischargeBillDate: billDate,
  };
  const parsed = caseCreateSchema.safeParse(values);
  const errors = parsed.success ? {} : fieldErrors(parsed.error);

  useEffect(() => {
    api<{ hospitals: Hospital[] }>("/api/hospitals")
      .then((data) => {
        setHospitals(data.hospitals);
        setHospitalId((current) => current || data.hospitals[0]?.id || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Hospitals could not be loaded."));
  }, []);

  function markTouched(field: string) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function loadDemo() {
    setHospitalId(demo.hospitalId);
    setBillAmount(String(demo.billAmount));
    setHouseholdSize(String(demo.householdSize));
    setIncome(String(demo.income));
    setInsurance(demo.insuranceStatus);
    setBillDate(demo.firstPostDischargeBillDate);
    setError("");
    setSubmitted(false);
    setTouched({});
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitted(true);
    const result = caseCreateSchema.safeParse(values);
    if (!result.success) {
      const next = fieldErrors(result.error);
      const first = CASE_FIELD_ORDER.find((field) => next[field]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setPending(true);
    try {
      const isDemo =
        result.data.hospitalId === demo.hospitalId &&
        result.data.billAmount === demo.billAmount &&
        result.data.householdSize === demo.householdSize &&
        result.data.householdAnnualIncome === demo.income &&
        result.data.insuranceStatus === demo.insuranceStatus;
      if (isDemo) {
        await api("/api/demo/bootstrap", { method: "POST" });
        router.push("/result/demo");
        return;
      }
      const created = await api<{ caseId: string }>("/api/cases", {
        method: "POST",
        body: JSON.stringify(result.data),
      });
      await api(`/api/cases/${created.caseId}/estimate`, { method: "POST" });
      router.push(`/result/${created.caseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const hospitalError = visibleFieldError("hospitalId", errors, touched, submitted);
  const billError = visibleFieldError("billAmount", errors, touched, submitted);
  const sizeError = visibleFieldError("householdSize", errors, touched, submitted);
  const incomeError = visibleFieldError("householdAnnualIncome", errors, touched, submitted);
  const insuranceError = visibleFieldError("insuranceStatus", errors, touched, submitted);
  const dateError = visibleFieldError("firstPostDischargeBillDate", errors, touched, submitted);

  return (
    <Card className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl">Check My Bill</h1>
        <p className="mt-2 text-sm text-muted">
          Althea estimates whether you may qualify based on the hospital&apos;s published policy. The hospital decides.
        </p>
      </div>
      <Button type="button" variant="ghost" onClick={loadDemo}>
        Load Demo
      </Button>
      <form className="space-y-4" noValidate onSubmit={onSubmit}>
        <Field id="hospitalId" label="Hospital" required error={hospitalError}>
          <select
            id="hospitalId"
            name="hospitalId"
            className={inputClass}
            value={hospitalId}
            aria-invalid={Boolean(hospitalError)}
            aria-describedby={fieldDescribedBy("hospitalId", hospitalError)}
            onBlur={() => markTouched("hospitalId")}
            onChange={(e) => setHospitalId(e.target.value)}
            required
          >
            <option value="" disabled={hospitals.length > 0}>
              {hospitals.length === 0 ? "Loading hospitals..." : "Select a hospital"}
            </option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
                {hospital.state ? ` (${hospital.state})` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field id="billAmount" label="Bill amount" required error={billError}>
          <input
            id="billAmount"
            name="billAmount"
            className={inputClass}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            maxLength={14}
            value={billAmount}
            aria-invalid={Boolean(billError)}
            aria-describedby={fieldDescribedBy("billAmount", billError)}
            onBlur={() => markTouched("billAmount")}
            onChange={(e) => setBillAmount(e.target.value)}
            required
          />
        </Field>
        <Field id="householdSize" label="Household size" required error={sizeError}>
          <input
            id="householdSize"
            name="householdSize"
            className={inputClass}
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            maxLength={2}
            value={householdSize}
            aria-invalid={Boolean(sizeError)}
            aria-describedby={fieldDescribedBy("householdSize", sizeError)}
            onBlur={() => markTouched("householdSize")}
            onChange={(e) => setHouseholdSize(e.target.value)}
            required
          />
        </Field>
        <Field id="householdAnnualIncome" label="Annual household income" required error={incomeError}>
          <input
            id="householdAnnualIncome"
            name="householdAnnualIncome"
            className={inputClass}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            maxLength={14}
            value={income}
            aria-invalid={Boolean(incomeError)}
            aria-describedby={fieldDescribedBy("householdAnnualIncome", incomeError)}
            onBlur={() => markTouched("householdAnnualIncome")}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </Field>
        <Field id="insuranceStatus" label="Insurance" required error={insuranceError}>
          <select
            id="insuranceStatus"
            name="insuranceStatus"
            className={inputClass}
            value={insurance}
            aria-invalid={Boolean(insuranceError)}
            aria-describedby={fieldDescribedBy("insuranceStatus", insuranceError)}
            onBlur={() => markTouched("insuranceStatus")}
            onChange={(e) => setInsurance(e.target.value)}
            required
          >
            <option value="insured">Yes</option>
            <option value="uninsured">No</option>
          </select>
        </Field>
        <Field id="firstPostDischargeBillDate" label="First post-discharge billing statement date" error={dateError}>
          <input
            id="firstPostDischargeBillDate"
            name="firstPostDischargeBillDate"
            className={inputClass}
            type="date"
            min={MIN_BILL_DATE}
            max={maxDate}
            value={billDate}
            aria-invalid={Boolean(dateError)}
            aria-describedby={fieldDescribedBy("firstPostDischargeBillDate", dateError)}
            onBlur={() => markTouched("firstPostDischargeBillDate")}
            onChange={(e) => setBillDate(e.target.value)}
          />
        </Field>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Calculating..." : "See estimate"}
        </Button>
      </form>
    </Card>
  );
}
