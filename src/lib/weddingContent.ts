export const COUPLE = {
  groomFirstName: "Elias",
  groomFamily: "Abou Mrad Family",
  brideFirstName: "Vanessa",
  brideFamily: "Abboud Family",
} as const;

export const WEDDING_DATE_ISO = "2026-08-28T18:00:00";
export const WEDDING_DATE_DISPLAY = "28 August 2026";

export interface VenueDetail {
  label: string;
  name: string;
  address: string;
  /** Empty string when there's no specific time to show (e.g. a home address). */
  time: string;
  mapHref: string;
}

export const CEREMONY_VENUE: VenueDetail = {
  label: "Ceremony",
  name: "St. Georges Church", // placeholder — replace with the real church name
  address: "Jdeideh", // placeholder — replace with the real address
  time: "At 6pm",
  mapHref: "https://maps.app.goo.gl/YCpK4HYEtoCm6kUL9?g_st=iw", // placeholder — replace with the real map link
};

export const RECEPTION_VENUE: VenueDetail = {
  label: "Reception",
  name: "Zone", // placeholder — replace with the real venue name
  address: "Mansourieh", // placeholder — replace with the real address
  time: "At 8pm",
  mapHref: "https://maps.app.goo.gl/EtF9bmbuyhpwSUR89?g_st=iw", // placeholder — replace with the real map link
};

export const GROOM_HOME: VenueDetail = {
  label: "Groom's Home",
  name: "Abou Mrad Residence", // placeholder — replace with the real house name/description
  address: "Bsous", // placeholder — replace with the real address
  time: "Starting at 2:30pm",
  mapHref: "https://maps.app.goo.gl/cQ7FWA7hyvy2FFT17?g_st=iw", // placeholder — replace with the real map link
};

export const BRIDE_HOME: VenueDetail = {
  label: "Bride's Home",
  name: "Abboud Residence", // placeholder — replace with the real house name/description
  address: "Mansourieh", // placeholder — replace with the real address
  time: "Starting at 2:30pm",
  mapHref: "https://maps.app.goo.gl/f2srLy5cSZWD4Tt78?g_st=iw", // placeholder — replace with the real map link
};

export const WHISH_ACCOUNT = {
  number: "30614214-03", // placeholder — replace with the real Whish account number
  label: `${COUPLE.groomFirstName.toUpperCase()} & ${COUPLE.brideFirstName.toUpperCase()}`,
};
