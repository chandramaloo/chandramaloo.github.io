(function () {
  "use strict";

  var measurementId = "G-DZG590518R";
  var consentKey = "cm_analytics_consent";
  var banner = document.querySelector("[data-analytics-banner]");
  var allowButton = document.querySelector("[data-analytics-allow]");
  var declineButton = document.querySelector("[data-analytics-decline]");
  var settingsButton = document.querySelector("[data-analytics-settings]");

  if (!banner || !allowButton || !declineButton || !settingsButton) {
    return;
  }

  function readConsent() {
    try {
      return window.localStorage.getItem(consentKey);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      return;
    }
  }

  function enableAnalytics() {
    if (document.querySelector("script[data-google-analytics]")) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    var googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    googleTag.setAttribute("data-google-analytics", "");
    document.head.appendChild(googleTag);

    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }

  function removeAnalyticsCookies() {
    document.cookie.split(";").forEach(function (cookie) {
      var name = cookie.split("=")[0].trim();

      if (name.indexOf("_ga") !== 0) {
        return;
      }

      document.cookie = name + "=; Max-Age=0; path=/";
      document.cookie = name + "=; Max-Age=0; path=/; domain=." + window.location.hostname;
    });
  }

  function openBanner() {
    banner.hidden = false;
    settingsButton.hidden = true;
  }

  function closeBanner() {
    banner.hidden = true;
    settingsButton.hidden = false;
  }

  function setConsent(value) {
    var previousValue = readConsent();
    saveConsent(value);

    if (value === "granted") {
      enableAnalytics();
      closeBanner();
      return;
    }

    removeAnalyticsCookies();
    closeBanner();

    if (previousValue === "granted") {
      window.location.reload();
    }
  }

  allowButton.addEventListener("click", function () {
    setConsent("granted");
  });

  declineButton.addEventListener("click", function () {
    setConsent("denied");
  });

  settingsButton.addEventListener("click", function () {
    openBanner();
  });

  if (readConsent() === "granted") {
    enableAnalytics();
    settingsButton.hidden = false;
  } else if (readConsent() === "denied") {
    settingsButton.hidden = false;
  } else {
    openBanner();
  }
}());
