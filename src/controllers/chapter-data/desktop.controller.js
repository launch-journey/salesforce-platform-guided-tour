"use strict";

export default function ChapterDataController(
  $scope,
  Steps,
  Hotspots,
  WizardHandler,
  successConfetti,
  $log
) {
  $log.info("successConfetti", successConfetti);
  $scope.Next = function() {
    if (WizardHandler.wizard("monitor").currentStepNumber() === 1) {
      WizardHandler.wizard("monitor").next();
      Steps.activate("one");
    } else if (WizardHandler.wizard("monitor").currentStepNumber() === 2) {
      WizardHandler.wizard("monitor").next();
      Steps.activate("two");
    }
  };

  $scope.GoToStep2A = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("");
  };

  $scope.GoToStep3 = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("three");
  };

  $scope.GoToStep3A = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("");
  };

  $scope.GoToStep4 = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("four");
  };

  $scope.GoToStep4A = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("");
  };

  $scope.GoToStep4B = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("");
  };

  $scope.GoToStep5 = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("five");
  };

  $scope.GoToStep5A = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("");
  };

  $scope.GoToSuccess = function() {
    WizardHandler.wizard("monitor").next();
    Steps.activate("six");
  };

  $scope.renderConfetti = function() {
    successConfetti.renderConfetti();
    // successConfetti.render();
  };
}
