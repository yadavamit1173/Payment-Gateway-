// 3. Mandate Creation Flow

/*
User clicks Enable AutoPay
-> Frontend calls API
-> Backend creates mandate
-> Gateway returns auth link
-> User approves on bank page
-> Gateway sends webhook
-> Mandate becomes ACTIVE

*/

async function createMandate(data) {
  const mandate = await db.mandates.insert({
    user_id: data.userId,
    amount: data.amount,
    frequency: data.frequency,
    status: "PENDING"
  });

  const gatewayResponse = await paymentGateway.createMandate({
    amount: data.amount,
    frequency: data.frequency,
    callbackUrl: "https://app.com/webhooks/mandate"
  });

  await db.mandates.update(mandate.id, {
    gateway_mandate_id: gatewayResponse.mandateId
  });

  return {
    id: mandate.id,
    authUrl: gatewayResponse.authUrl
  };
}