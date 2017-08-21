'use strict';

export default function CreateANewLightningPageDrawerController($scope, WizardHandler, TopNavbar, Steps, Hotspots, Drawer, $timeout) {
  TopNavbar.InfoActive = true;
  Drawer.openToIntro();

  $scope.beginStory = function () {
    Drawer.close();
    WizardHandler.wizard('monitor').next();
    TopNavbar.InfoActive = false;

    Steps.clear();
    Steps.pop({
      number: 'one',
      title: 'Click \'New\''
    });

    Steps.pop({
      number: 'two',
      title: 'Click &lsquo;Next&rsquo; to create and App Page'
    });

    Steps.pop({
      number: 'three',
      title: 'Type your page label in the open field; let\'s call this ‘Customer 360’. Click ‘Next’'
    });

    Steps.pop({
      number: 'four',
      title: 'We will use the ‘Header and Right Sidebar’ layout choice. Click ‘Finish.’ '
    });

    Hotspots.clear();

    $timeout(() => {
      Steps.activate('one');
    }, 1000);
  };
}
