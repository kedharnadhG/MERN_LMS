import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const paymentId = params.get("paymentId");
  //   const token = params.get("token");
  const PayerID = params.get("PayerID");

  useEffect(() => {
    if (paymentId && PayerID) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        const response = await captureAndFinalizePaymentService(
          orderId,
          paymentId,
          PayerID
        );

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }

      capturePayment();
    }
  }, [paymentId, PayerID]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please Wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalPaymentReturnPage;
