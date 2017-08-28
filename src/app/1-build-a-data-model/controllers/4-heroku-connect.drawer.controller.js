'use strict';

export default function HerokuConnectDrawerController($scope, WizardHandler, TopNavbar, Steps, Hotspots, Drawer, $timeout) {
  TopNavbar.InfoActive = true;
  Drawer.openToIntro();

  $scope.beginStory = function () {
    Drawer.close();
    WizardHandler.wizard('monitor').next();
    TopNavbar.InfoActive = false;

    Steps.clear();
    Steps.pop({
      number: 'one',
      title: 'Select the &lsquo;Customer Insights&rsquo; object.'
    });

    Steps.pop({
      number: 'two',
      title: 'Check the ‘Customer Idea’ field to map and bring it to your  Salesforce app.'
    });

    Steps.pop({
      number: 'three',
      title: 'Click ‘save’ and go to Salesforce to see the data integrated!'
    });

    Hotspots.clear();
    // Hotspots.pop({
    //   number: 1,
    //   position: {
    //     left: '117px',
    //     top: '223px'
    //   }
    // });
    //
    // Hotspots.pop({
    //   number: 2,
    //   position: {
    //     left: '117px',
    //     top: '273px'
    //   }
    // });

    $timeout(() => {
      Steps.activate('one');
    }, 1000);
  };
}
