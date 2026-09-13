"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { api } from "@/lib/client/api";
import demo from "@/data/demo/example-medical-center.json";

type Hospital = { id: string; name: string; state?: string };

export default function CheckPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState("hosp_demo_001");
  const [billAmount, setBillAmount] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [income, setIncome] = useState("");
  const [insurance, setInsurance] = useState("insured");
  const [billDate, setBillDate] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<{ hospitals: Hospital[] }>("/api/hospitals")
      .then((data) => setHospitals(data.hospitals))
      .catch(() => undefined);
  }, []);

  function loadDemo() {
    setHospitalId("hosp_demo_001");
    setBillAmount(String(demo.billAmount));
    setHouseholdSize(String(demo.householdSize));
    setIncome(String(demo.income));
    setInsurance(demo.insuranceStatus);
    setBillDate(demo.firstPostDischargeBillDate);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const isDemo =
        hospitalId === "hosp_demo_001" &&
        Number(billAmount) === 18420 &&
        Number(householdSize) === 3 &&
        Number(income) === 51000 &&
        insurance === "insured";
      if (isDemo) {
        await api("/api/demo/bootstrap", { method: "POST" });
        router.push("/result/demo");
        return;
      }
      const created = await api<{ caseId: string }>("/api/cases", {
        method: "POST",
        body: JSON.stringify({
          hospitalId,
          billAmount: Number(billAmount),
          householdSize: Number(householdSize),
          householdAnnualIncome: Number(income),
          insuranceStatus: insurance,
          firstPostDischargeBillDate: billDate || undefined,
        }),
      });
      await api(`/api/cases/${created.caseId}/estimate`, { method: "POST" });
      router.push(`/result/${created.caseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl">Check My Bill</h1>
        <p className="mt-2 text-sm text-[#5c564c]">
          Althea estimates whether you may qualify based on the hospital&apos;s published policy. The hospital decides.
        </p>
      </div>
      <Button type="button" variant="ghost" onClick={loadDemo}>
        Load Demo Case
      </Button>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Hospital">
          <select
            className={inputClass}
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            required
          >
            {hospitals.length === 0 ? <option value="hosp_demo_001">Example Medical Center</option> : null}
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
                {hospital.state ? ` (${hospital.state})` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bill amount">
          <input
            className={inputClass}
            inputMode="decimal"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            required
          />
        </Field>
        <Field label="Household size">
          <input
            className={inputClass}
            inputMode="numeric"
            value={householdSize}
            onChange={(e) => setHouseholdSize(e.target.value)}
            required
          />
        </Field>
        <Field label="Annual household income">
          <input
            className={inputClass}
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            required
          />
        </Field>
        <Field label="Insurance">
          <select className={inputClass} value={insurance} onChange={(e) => setInsurance(e.target.value)}>
            <option value="insured">Yes</option>
            <option value="uninsured">No</option>
          </select>
        </Field>
        <Field label="First post-discharge billing statement date">
          <input
            className={inputClass}
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
          />
        </Field>
        {error ? <p className="text-sm text-[#8a2f2f]">{error}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Calculating..." : "See estimate"}
        </Button>
      </form>
    </Card>
  );
}
