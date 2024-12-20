'use strict';

import * as _ from 'lodash';
import angular from 'angular';

import '../styles/_wizard.scss';

export default function wizard() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {
      currentStep: '=',
      onFinish: '&',
      hideIndicators: '=',
      editMode: '=',
      name: '@'
    },
    template: require('../partials/wizard.html'),

    // controller for wizard directive, treat this just like an angular controller
    controller($scope, WizardHandler, TopNavbar, Drawer) {
      // this variable allows directive to load without having to pass any step validation
      let firstRun = true;
      // creating instance of wizard, passing this as second argument allows access to functions attached to this via Service
      WizardHandler.addWizard($scope.name || WizardHandler.defaultName, this);
      // console.log($scope.name + "*****");

      $scope.$on('$destroy', () => {
        WizardHandler.removeWizard($scope.name || WizardHandler.defaultName);
      });

      // steps array where all the scopes of each step are added
      $scope.steps = [];

      // access to context object for step validation
      $scope.context = {};

      // watching changes to currentStep
      $scope.$watch('currentStep', step => {
        // checking to make sure currentStep is truthy value
        if (!step) {
          return;
        }
        // setting stepTitle equal to current step title or default title
        const stepTitle = $scope.selectedStep.title || $scope.selectedStep.wzTitle;
        if ($scope.selectedStep && stepTitle !== $scope.currentStep) {
          // invoking goTo() with step title as argument
          $scope.goTo(_.findWhere($scope.steps, {title: $scope.currentStep}));
        }
      });

      // watching steps array length and editMode value, if edit module is undefined or null the nothing is done
      // if edit mode is truthy, then all steps are marked as completed
      $scope.$watch('[editMode, steps.length]', () => {
        const editMode = $scope.editMode;
        if (_.isUndefined(editMode) || _.isNull(editMode)) {
          return;
        }

        if (editMode) {
          _.each($scope.steps, step => {
            step.completed = true;
          });
        }
      }, true);

      // called each time step directive is loaded
      this.addStep = function (step) {
        // pushing the scope of directive onto step array
        $scope.steps.push(step);
        // if this is first step being pushed then goTo that first step
        if ($scope.steps.length === 1) {
          // goTo first step
          $scope.goTo($scope.steps[0]);
        }
      };

      this.context = $scope.context;

      $scope.getStepNumber = function (step) {
        return _.indexOf($scope.steps, step) + 1;
      };

      $scope.goTo = function (step) {
        // if this is the first time the wizard is loading it bi-passes step validation
        if (firstRun) {
          // deselect all steps so you can set fresh below
          unselectAll();
          $scope.selectedStep = step;
          // making sure current step is not undefined
          if (!_.isUndefined($scope.currentStep)) {
            $scope.currentStep = step.title || step.wzTitle;
          }
          // setting selected step to argument passed into goTo()
          step.selected = true;
          // emit event upwards with data on goTo() invoktion
          $scope.$emit('wizard:stepChanged', {step, index: _.indexOf($scope.steps, step)});
          // setting variable to false so all other step changes must pass validation
          firstRun = false;
        } else {
          // createing variables to capture current state that goTo() was invoked from and allow booleans
          let thisStep;
          let exitallowed = false;
          let enterallowed = false;

          // NOTE:: This check is forcing the right rail steps to dissapear early on controllers with more than 6 steps (ex: chapter-data, chapter-blockchain) - removing for now (will review in meeting on 10/23)
          // const index = _.indexOf($scope.steps, $scope.selectedStep);
          // if (index >= 600) {
          //   Steps.clear();
          // }

          // getting data for step you are transitioning out of
          if ($scope.currentStepNumber() > 0) {
            thisStep = $scope.currentStepNumber() - 1;
          } else if ($scope.currentStepNumber() === 0) {
            thisStep = 0;
          }
          // $log.log('steps[thisStep] Data: ', $scope.steps[thisStep].canexit);
          if (angular.isUndefined($scope.steps[thisStep].canexit) || $scope.steps[thisStep].canexit($scope.context) === true) {
            exitallowed = true;
          }
          if ($scope.getStepNumber(step) < $scope.currentStepNumber()) {
            exitallowed = true;
          }
          if ((exitallowed && angular.isUndefined(step.canenter)) || (exitallowed && step.canenter($scope.context) === true)) {
            enterallowed = true;
          }

          if (exitallowed && enterallowed) {
            // deselect all steps so you can set fresh below
            unselectAll();

            // $log.log('value for canExit argument: ', $scope.currentStep.canexit);
            $scope.selectedStep = step;
            // making sure current step is not undefined
            if (!_.isUndefined($scope.currentStep)) {
              $scope.currentStep = step.title || step.wzTitle;
            }
            // setting selected step to argument passed into goTo()
            step.selected = true;
            // emit event upwards with data on goTo() invoktion
            $scope.$emit('wizard:stepChanged', {step, index: _.indexOf($scope.steps, step)});
            // $log.log('current step number: ', $scope.currentStepNumber());
          } else {
            return;
          }
        }
      };

      $scope.currentStepNumber = function () {
        // retreive current step number
        return _.indexOf($scope.steps, $scope.selectedStep) + 1;
      };

      // unSelect All Steps
      function unselectAll() {
        // traverse steps array and set each "selected" property to false
        _.each($scope.steps, step => {
          step.selected = false;
        });
        // set selectedStep variable to null
        $scope.selectedStep = null;
      }

      // ALL METHODS ATTACHED TO this ARE ACCESSIBLE VIA WizardHandler.wizard().methodName()

      // Access to current step number from outside
      this.currentStepNumber = function () {
        return $scope.currentStepNumber();
      };
      // method used for next button within step
      this.next = function (callback) {
        // setting variable equal to step  you were on when next() was invoked
        const index = _.indexOf($scope.steps, $scope.selectedStep);
        // checking to see if callback is a function
        if (angular.isFunction(callback)) {
          if (callback()) {
            if (index === $scope.steps.length - 1) {
              this.finish();
            } else {
              // invoking goTo() with step number next in line
              $scope.goTo($scope.steps[index + 1]);
            }
          } else {
            return;
          }
        }
        if (!callback) {
          // completed property set on scope which is used to add class/remove class from progress bar
          $scope.selectedStep.completed = true;
        }

        // checking to see if this is the last step.  If it is next behaves the same as finish()
        if (index === $scope.steps.length - 1) {
          this.finish();
        } else {
          // invoking goTo() with step number next in line
          if ($scope.steps[index + 1].success) {
            TopNavbar.DidYouKnowEnabled = false;
            TopNavbar.DidYouKnowCount = 0;
            TopNavbar.HotspotsEnabled = false;
            TopNavbar.HotspotsCount = 0;
            Drawer.close();
          }
          $scope.goTo($scope.steps[index + 1]);
        }
      };

      // used to traverse to any step, step number placed as argument
      this.goTo = function (step) {
        let stepTo;
        // checking that step is a Number
        if (_.isNumber(step)) {
          stepTo = $scope.steps[step];
        } else {
          // finding the step associated with the title entered as goTo argument
          stepTo = _.findWhere($scope.steps, {title: step});
        }
        // going to step
        $scope.goTo(stepTo);
      };

      // calls finish() which calls onFinish() which is declared on an attribute and linked to controller via wizard directive.
      this.finish = function () {
        if ($scope.onFinish) {
          $scope.onFinish();
        }
      };

      // cancel is alias for previous.
      this.cancel = this.previous = function () {
        // getting index of current step
        const index = _.indexOf($scope.steps, $scope.selectedStep);
        // ensuring you aren't trying to go back from the first step
        if (index === 0) {
          throw new Error('Can\'t go back. It\'s already in step 0');
        } else {
          // go back one step from current step
          $scope.goTo($scope.steps[index - 1]);
        }
      };
    }
  };
}
