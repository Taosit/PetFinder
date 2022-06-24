import axios from "axios";

export const requestAccessToken = async () => {
  console.log(process.env.REACT_APP_KEY)
  const auth = {
    grant_type: "client_credentials",
    client_id: process.env.REACT_APP_KEY,
    client_secret: process.env.REACT_APP_SECRET
  }
  const response = await axios.post("https://api.petfinder.com/v2/oauth2/token", auth)
  const accessToken = {
    token: response.data.access_token,
    expirationTime: Date.now() + 3500 * 1000
  }
  localStorage.setItem("access_token", JSON.stringify(accessToken))
  return accessToken;
}

export const requestData = async (page, type, location, extraParams = {}) => {
  type = !type || type === "" ? "Dog" : type;
  location = !location || location === "" ? "Vancouver, British Columbia" : location;
  console.log(extraParams);
  let accessToken = JSON.parse(localStorage.getItem("access_token"));
  console.log({type, location, page, accessToken})
  if (!accessToken || Date.now() > accessToken.expirationTime) {
    console.log("requesting token")
    accessToken = await requestAccessToken();
  }
  return axios({
    method: "GET",
    url: "https://api.petfinder.com/v2/animals",
    params: {
      type,
      location,
      page,
      ...extraParams
    },
    headers: {
      "Authorization": `Bearer ${accessToken.token}`
    }
  });
}