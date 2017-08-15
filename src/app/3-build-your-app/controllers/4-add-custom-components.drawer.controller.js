'use strict';

export default function AddCustomComponentsDrawerController($scope, WizardHandler, TopNavbar, Steps, Hotspots, Drawer, $timeout) {
  TopNavbar.InfoActive = true;
  Drawer.openToIntro();

  $scope.beginStory = function () {
    Drawer.close();
    WizardHandler.wizard('monitor').next();
    TopNavbar.InfoActive = false;

    Steps.clear();
    Steps.pop({
      number: 'one',
      title: ''
    });

    Hotspots.clear();

    $timeout(() => {
      Steps.activate('one');
    }, 1000);
  };
}
