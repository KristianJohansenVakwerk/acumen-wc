export default defineEventHandler(async (event) => {
  const body = await readBody<{
    id?: string;
    amount?: number | string | null;
  }>(event);

  console.log("CTA click received", {
    id: body?.id,
    amount: body?.amount,
  });

  return { ok: true };
});
