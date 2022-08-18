import React from "react";

// lazy loaded components
const PageNotFoundPage = React.lazy(
  () => import("../../pages/pageNotFound/pageNotFound")
);

const HomePage = React.lazy(() => import("../../pages/home/home"));

const LoginSignupPage = React.lazy(()=> import("../../pages/loginSignup/loginSignup"))

const LocationPage = React.lazy(()=> import("../../pages/location/location"))


export {
  PageNotFoundPage,
  HomePage,
  LoginSignupPage,
  LocationPage
};
