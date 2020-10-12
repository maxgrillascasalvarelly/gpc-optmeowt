/*
OptMeowt is licensed under the MIT License
Copyright (c) 2020 Kuba Alicki, David Baraka, Rafael Goldstein, Sebastian Zimmeck
privacy-tech-lab, https://privacy-tech-lab.github.io/
*/

/*
settings-view.js
================================================================================
settings-view.js loads settings-view.html when clicked on the options page
*/

import { renderParse, fetchParse } from "../../components/util.js";
import {
  handleDownload,
  startUpload,
  handleUpload,
} from "../../../domainlist.js";
import { darkSwitchFunction } from "../../../libs/dark-mode-switch-1.0.0/dark-mode-switch.js";
import "../../../libs/FileSaver.js-2.0.2/src/FileSaver.js";

/**
 * @typedef headings
 * @property {string} headings.title - Title of the given page
 * @property {string} headings.subtitle - Subtitle of the given page
 */
const headings = {
  title: "Settings",
  subtitle: "Adjust extension settings",
};

/**
 * Creates the event listeners for the `Settings` page buttons and options
 */
function eventListeners() {
  document
    .getElementById("settings-view-radio0")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({ ENABLED: true, DOMAINLIST_ENABLED: false });
      chrome.storage.local.set({ ENABLED: true, DOMAINLIST_ENABLED: false });
    });
  document
    .getElementById("settings-view-radio1")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({ ENABLED: false, DOMAINLIST_ENABLED: false });
      chrome.storage.local.set({ ENABLED: false, DOMAINLIST_ENABLED: false });
    });
  document
    .getElementById("settings-view-radio2")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({ ENABLED: true, DOMAINLIST_ENABLED: true });
      chrome.storage.local.set({ ENABLED: true, DOMAINLIST_ENABLED: true });
    });
  document
    .getElementById("download-button")
    .addEventListener("click", handleDownload);
  document.getElementById("upload-button").addEventListener("click", () => {
    const verify = confirm(
      `This option will override your current domain preferences.\n Do you wish to continue?`
    );
    if (verify) {
      startUpload();
    }
  });
  document
    .getElementById("upload-domainlist")
    .addEventListener("change", handleUpload, false);
}

/**
 * Renders the `Settings` view in the options page
 * @param {string} scaffoldTemplate - stringified HTML template
 */
export async function settingsView(scaffoldTemplate) {
  const body = renderParse(scaffoldTemplate, headings, "scaffold-component");
  let content = await fetchParse(
    "./views/settings-view/settings-view.html",
    "settings-view"
  );

  document.getElementById("content").innerHTML = body.innerHTML;
  document.getElementById("scaffold-component-body").innerHTML =
    content.innerHTML;

  darkSwitchFunction();

  chrome.storage.local.get(["ENABLED", "DOMAINLIST_ENABLED"], function (
    result
  ) {
    console.log(result.ENABLED);
    if (result.ENABLED == undefined) {
      chrome.storage.local.set({ ENABLED: true });
      document.getElementById("settings-view-radio0").checked = true;
    } else if (result.ENABLED) {
      document.getElementById("settings-view-radio0").checked = true;
    } else {
      document.getElementById("settings-view-radio1").checked = true;
    }
    if (result.DOMAINLIST_ENABLED) {
      document.getElementById("settings-view-radio2").checked = true;
    }
  });

  // chrome.storage.local.get(["FIRSTINSTALL"], (result) => {
  //   if (result.FIRSTINSTALL) {
  //     optionsWalkthrough();
  //   }
  //   chrome.storage.local.set({ FIRSTINSTALL: false }, () => {});
  // });

  eventListeners();

  var modal = UIkit.modal("#my-id");
  modal.show();

  function trigger3() {
    tippy(".tutorial-tooltip3", {
      content:
        "<p>Set which sites should receive a Do Not Sell signal<p> <button class='uk-button uk-button-default' style='color:white;'>Finish</button>",
      allowHTML: true,
      trigger: "manual",
      delay: 1000,
      duration: 1000,
      theme: "tomato",
      placement: "bottom",
    });
    let tooltip = document.getElementsByClassName("tutorial-tooltip3")[0]
      ._tippy;
    tooltip.show();
  }

  function trigger2() {
    tippy(".tutorial-tooltip2", {
      content:
        "<p>Set which sites should receive a Do Not Sell signal<p>  <button class='uk-button uk-button-default' style='color:white;'>Next</button>",
      allowHTML: true,
      trigger: "manual",
      delay: 1000,
      duration: 1000,
      theme: "tomato",
      placement: "right",
      onHide() {
        trigger3();
      },
    });
    let tooltip = document.getElementsByClassName("tutorial-tooltip2")[0]
      ._tippy;
    tooltip.show();
  }

  document.getElementById("modal-button").onclick = function () {
    var modal = UIkit.modal("#my-id");
    modal.hide();
    tippy(".tutorial-tooltip1", {
      content:
        "<p>Set which sites should receive a Do Not Sell signal<p>  <button class='uk-button uk-button-default' style='color:white;'>Next</button>",
      allowHTML: true,
      trigger: "manual",
      delay: 10000,
      duration: 1000,
      theme: "tomato",
      onHide(instance) {
        trigger2();
      },
    });
    let tooltip = document.getElementsByClassName("tutorial-tooltip1")[0]
      ._tippy;
    tooltip.show();
  };
}
