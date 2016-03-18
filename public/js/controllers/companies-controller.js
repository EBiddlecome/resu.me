angular.module('app')
  .controller( 'CompaniesController', [ '$scope', '$timeout', 'CompanyFactory', function( $scope, $timeout, CompanyFactory ) {

    $scope.companies;
    $scope.selection;
    $scope.index;

    // object to capture user file inputs
    $scope.userFiles = {};
    $scope.userFiles.research = [];

    $scope.getAll = function( newSelectionIndex ) {

      CompanyFactory.getAll()
        .then( function(data) {
          $scope.companies = data.companies;

          // first company selected by default unless a new
          // company has just been added (then select that)
          $scope.select( newSelectionIndex );
        })
        .catch( function(error) {
          console.error(error);
        });
    };

    
    $scope.select = function( companyIndex ) {
      $scope.selection = $scope.companies[ companyIndex ];
      $scope.index = companyIndex; // used by DateController
    };


    $scope.addCompany = function(name) {

      CompanyFactory.addCompany(name)
        .then( function (data) {
          $scope.getAll( $scope.companies.length );
          selectDefaultTask();
        })
        .catch( function(error) {
          console.error(error);
        });
    };


    $scope.deleteCompany = function(id) {

      if ( !confirm('Are you sure you want to delete this company?') ) {
        return;
      }
      //console.log(id);
      CompanyFactory.deleteCompany(id)
        .then( function (data) {
          var newSelection = $scope.index - 1 < 0 ? 0 : $scope.index - 1;
          $scope.getAll( newSelection );
        })
        .catch( function(error) {
          console.error(error);
        });
    };
    
    $scope.apply = function( id ) {

      //console.log(id);
      CompanyFactory.applyToCompany(id)
        .then( function (data) {
          $scope.getAll( $scope.index );
        })
        .catch( function(error) {
          console.error(error);
        });
    };
    
    
    $scope.submitCoverLetter = function(htmlVariable) {
   
      $scope.userFiles.coverLetter = htmlVariable;

      console.log('htmlVariable', htmlVariable);
    };

    $scope.submitResume = function(htmlVariable) {

      $scope.userFiles.resume = htmlVariable;

      console.log('userFiles', $scope.userFiles);

    };

    $scope.submitResearch = function(item) {

      console.log('research item', item);

      $scope.userFiles.research.push(item);
      console.log('research array', $scope.userFiles.research);

      // TODO: Reset the input to show the placeholder on click
      // $scope.item = 'Enter a URL';

    };

    // HACK: forcing #defaultTask click event
    // inits nested view AND $scope.currentTask
    
    var selectDefaultTask = function () {
      $timeout( function() {
        var node = document.querySelector('#defaultTask');
        angular.element(node).triggerHandler('click');
      }, 100);
    };

    $scope.getAll(0);
    selectDefaultTask();

  }]);