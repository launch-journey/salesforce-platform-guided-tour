'use strict';

export default function ChapterMobileDrawerController($scope, WizardHandler, TopNavbar, Steps, Hotspots, Drawer, $timeout, $rootScope, $document) {
  TopNavbar.InfoActive = true;
  Drawer.openToIntro();

  $scope.gtmTrack = (cat, label, act = "") => {
    window.dataLayer.push({
      event: 'eventTracker',
      eventCat: cat,
      eventAct: act === "" ? window.location.href : act,
      eventLbl: label,
      nonInteraction: false
    });
  };

  angular.element(document).ready(() => {
    // show the phone overlay after the page finishes loading
    $rootScope.showMobilePopout = true;
  });

  $scope.beginStory = function () {
    Drawer.close();

    Steps.clear();
    Steps.pop({
      number: "one",
      title: "Click &rdquo;100 kWh&ldquo; to upgrade the battery."
    });

    // show the video step and make it play
    WizardHandler.wizard("phone").goTo(1);
    $document[0].getElementById('step-1-video').play();

    // after 8 seconds of video, we want to move on to next step
    $timeout(() => {
      WizardHandler.wizard("phone").goTo(2);
    }, 9000); /* extra pause before going to next step to ensure video completes */
  };
}
