
angular.module('hotFinder')
.service('UtilsService', ['$timeout', '$uibModal', function($timeout, $uibModal) {

  this.showLoader = () => {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('content').style.display = 'none';
      };

      this.hideLoader = () => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
      };

  

}]);
