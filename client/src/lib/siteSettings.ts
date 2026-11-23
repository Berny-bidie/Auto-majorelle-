import { SITE_CONTACT, normalizeBrandName } from "@shared/siteData";
import { trpc } from "@/lib/trpc";

export function useSiteSettings() {
  const query = trpc.automajorel.site.settings.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const values = query.data;
  const address = values?.address || SITE_CONTACT.address;
  return {
    ...SITE_CONTACT,
    name: normalizeBrandName(values?.businessName),
    phone: values?.phone || SITE_CONTACT.phone,
    phoneRaw: values?.phoneRaw || SITE_CONTACT.phoneRaw,
    secondaryPhone: values?.secondaryPhone || SITE_CONTACT.secondaryPhone,
    secondaryPhoneRaw: values?.secondaryPhoneRaw || SITE_CONTACT.secondaryPhoneRaw,
    whatsapp: (values?.whatsapp || SITE_CONTACT.whatsapp).replace(/\D/g, ""),
    email: values?.email || SITE_CONTACT.email,
    address,
    hours: values?.hours || SITE_CONTACT.hours,
    instagramUrl: values?.instagramUrl || SITE_CONTACT.instagramUrl,
    facebookUrl: values?.facebookUrl || SITE_CONTACT.facebookUrl,
    tiktokUrl: values?.tiktokUrl || SITE_CONTACT.tiktokUrl,
    mapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    mapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
  };
}
