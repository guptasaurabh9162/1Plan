// // import axios from "axios";

// // const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

// // const configPlace = {
// //   headers: {
// //     "Content-Type": "application/json",
// //     "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAP_API_KEY,
// //     "X-Goog-FieldMask": [
// //       "places.id",
// //       "places.name",
// //       "places.displayName",
// //       "places.formattedAddress",
// //       "places.photos",
// //       "places.googleMapsUri",
// //       "places.location",
// //       "places.priceLevel",
// //       "places.rating",
// //     ],
// //   },
// // };
// // const configCity = {
// //   headers: {
// //     "Content-Type": "application/json",
// //     "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAP_API_KEY,
// //     "X-Goog-FieldMask": [
// //       "places.name",
// //       "places.displayName",
// //       "places.photos",
// //       "places.googleMapsUri",
// //       "places.location",
// //     ],
// //   },
// // };

// // export const PHOTO_URL =
// //   "https://places.googleapis.com/v1/{replace}/media?maxHeightPx=1000&key=" +
// //   import.meta.env.VITE_GOOGLE_MAP_API_KEY;

// // export const getPlaceDetails = (data) =>
// //   axios.post(BASE_URL, data, configPlace);
// // export const getCityDetails = (data) => axios.post(BASE_URL, data, configCity);

// import axios from "axios";

// // Use the GoMaps API Base URL
// const BASE_URL = "https://maps.gomaps.pro/maps/api/place/findplacefromtext/json";

// // Retrieve the API key from your environment variables
// const API_KEY = import.meta.env.VITE_GOMAPS_API_KEY;

// // Configuration for fetching Place details
// const configPlace = {
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {
//     key: API_KEY,
//     inputtype: "textquery", // Matching GoMaps API structure
//     fields: [
//       "place_id",
//       "name",
//       "formatted_address",
//       "photos",
//       "url",
//       "geometry/location",
//       "price_level",
//       "rating",
//     ].join(","),
//   },
// };

// // Configuration for fetching City details
// const configCity = {
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {
//     key: API_KEY,
//     fields: [
//       "name",
//       "formatted_address",
//       "photos",
//       "url",
//       "geometry/location",
//     ].join(","),
//   },
// };

// // Exported URLs and Functions

// // Photo URL template for GoMaps API
// export const PHOTO_URL =
//   `https://maps.gomaps.pro/maps/api/place/photo?maxheight=1000&key=${API_KEY}`;

// // Function to get Place Details using GoMaps
// export const getPlaceDetails = (data) =>
//   axios.post(BASE_URL, data, configPlace);

// // Function to get City Details using GoMaps
// export const getCityDetails = (data) =>
//   axios.post(BASE_URL, data, configCity);


import axios from "axios";

const BASE_URL_PLACE_DETAILS = "https://maps.gomaps.pro/maps/api/place/details/json";
const BASE_URL_AUTOCOMPLETE = "https://maps.gomaps.pro/maps/api/place/queryautocomplete/json";

const configPlace = {
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: import.meta.env.VITE_GOMAPS_API_KEY,
  },
};

const configCity = {
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: import.meta.env.VITE_GOMAPS_API_KEY,
  },
};


export const PHOTO_URL = (photoReference) =>
     `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=1000&key=${import.meta.env.VITE_GOMAPS_API_KEY}`;


export const getPlaceDetails = (placeId) =>
  axios.get(BASE_URL_PLACE_DETAILS, {
    ...configPlace,
    params: {
      ...configPlace.params,
      place_id: placeId,
    },
  });

export const getCityDetails = (input) =>
  axios.get(BASE_URL_AUTOCOMPLETE, {
    ...configCity,
    params: {
      ...configCity.params,
      input,
    },
  });
