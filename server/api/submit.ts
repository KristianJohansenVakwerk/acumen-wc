export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: [
          { name: "email", value: body.email },
          { name: "firstname", value: body.firstname ?? "" },
          { name: "lastname", value: body.lastname ?? "" },
        ],
        submittedAt: String(Date.now()),
        context: {
          pageUri: config.public.HUBSPOT_BASE_URL,
          pageName: config.public.HUBSPOT_PAGE_NAME,
        },
      }),
    } satisfies Parameters<typeof $fetch>[1];

    const response = await $fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${config.public.HUBSPOT_PORTAL_ID}/${config.public.HUBSPOT_FORM_ID}`,
      options
    );

    return { success: true, data: response };
  } catch (error: unknown) {
    console.error("HubSpot API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit to HubSpot",
    });
  }
});
