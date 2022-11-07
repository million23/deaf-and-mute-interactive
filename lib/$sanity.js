import sanityClient from "@sanity/client";

const __sanity = sanityClient({
  projectId: "tvlwfdoe",
  dataset: "production",
  apiVersion: "2022-11-06",
  useCdn: false,
});

export default __sanity;
