export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const apiKey = config.FUNRAISE_API_KEY as string;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing FUNRAISE_API_KEY environment variable",
    });
  }

  try {
    const response = await $fetch(
      "https://api.funraise.io/api/v1/crm/donation",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Api-Key": apiKey,
        },
        query: {},
      },
    );

    const bannerData = mapBannerData(response as any);

    console.log("banner data", bannerData);

    return bannerData;
  } catch (error) {
    console.error("Failed to fetch banner data", error);
    return [];
  }
});

const mapBannerData = (data: any) => {
  if (!data || data.length === 0) return [];

  return data
    .filter(
      (item: any) =>
        item?.form?.id === 49591 &&
        item.transaction.amount > 0 &&
        item.transaction?.billingFirstName,
    )
    .map((item: any) => ({
      firstname: item.transaction.billingFirstName,
      lastname: item.transaction.billingLastName,
    }));
};
