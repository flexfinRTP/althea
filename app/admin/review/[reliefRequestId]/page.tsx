"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";

export default function ReviewPage() {
  const params = useParams<{ reliefRequestId: string }>();
  return (
    <Card className="space-y-3">
      <h1 className="text-3xl">Human review required</h1>
      <p>Relief request: {params.reliefRequestId}</p>
      <p>Residual Balance: $2,470</p>
      <p>Althea Grant: $500</p>
      <p>Program: General Medical Hardship</p>
      <p>Rule checks: passed</p>
      <p>Open the patient Relief Agent screen to approve $500.</p>
    </Card>
  );
}
