export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  // try {
  const portalId = config.public.HUBSPOT_PORTAL_ID;
  const formGuid = config.public.HUBSPOT_FORM_ID;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.HUBSPOT_TOKEN}`,
    },
    body: JSON.stringify({
      fields: [
        { name: "email", value: body.email ?? "" },
        { name: "firstname", value: body.fname ?? "" },
        { name: "lastname", value: body.lname ?? "" },
      ],
      context: {},
      skipValidation: true,
    }),
  };
  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
      options,
    );

    return { success: true, data: response.json() };
  } catch (error) {
    console.error("Failed to submit to HubSpot", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit to HubSpot",
    });
  }
});
