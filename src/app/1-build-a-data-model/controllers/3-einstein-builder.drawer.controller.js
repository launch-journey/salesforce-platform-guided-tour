'use strict';

export default function AddACustomFieldDrawerController(
  $scope,
  WizardHandler,
  TopNavbar,
  Steps,
  Hotspots,
  Drawer,
  $timeout
) {
  TopNavbar.InfoActive = true;
  Drawer.openToIntro();

  $scope.beginStory = function () {
    Drawer.close();
    WizardHandler.wizard('monitor').next();
    TopNavbar.InfoActive = false;
    TopNavbar.HotspotsEnabled = false;

    Steps.clear();
    Steps.pop({
      number: 'one',
      title: 'Click on \'New Prediction\''
    });

    Steps.pop({
      number: 'two',
      title: 'Name Your Predication \'Impact of Cases on NPS\' and click on \'Get Started\''
    });

    Steps.pop({
      number: 'three',
      title:
        'Select \'Cases\' and click  \'Next\''
    });

    Steps.pop({
      number: 'four',
      title:
        'Select \'Impact on NPS\' and click  \'Next\''
    });

    Steps.pop({
      number: 'five',
      title:
        'Select what fields should impact your prediction.'
    });

    Steps.pop({
      number: 'six',
      title:
        'Select \'Predictive NPS Score\' as a field into which the Einstein models will push your prediction and will update it every hour.'
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