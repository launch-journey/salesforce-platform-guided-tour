'use strict';
describe('Controller: SetUpALeadNurturingCampaignCtrl', function () {
// load the controller's module
  beforeEach(module('pardotInteractiveGuidedTour'));
  var setUpALeadNurturingCampaignCtrl,
      scope;
// Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    setUpALeadNurturingCampaignCtrl = $controller('SetUpALeadNurturingCampaignCtrl', {
      $scope: scope
    });
  }));
  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});