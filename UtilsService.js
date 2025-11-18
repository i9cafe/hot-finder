
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

  this.getKoreaTimeFromPacificMidnight = () => {
				const n = new Date(), y = n.getUTCFullYear(),
		        s = new Date(Date.UTC(y,2,8 + (7-new Date(Date.UTC(y,2,8)).getUTCDay())%7,10)),
		        e = new Date(Date.UTC(y,10,1 + (7-new Date(Date.UTC(y,10,1)).getUTCDay())%7,9)),
		        o = (n >= s && n < e ? -7 : -8),
		        k = new Date(Date.UTC(y,n.getUTCMonth(),n.getUTCDate(),-o,0,0)+9*3600*1000),
		        h = k.getUTCHours();
		  return `${h>=12?'오후':'오전'} ${h%12||12}시`; 
      };

	this.clickKeywordTab = () => {
		const keywordInputControl = document.getElementById('keyword-includeKey');
		keywordInputControl.focus();
	  };

	this.clearInclude = () => {			
	  		vm.keyword.includeKey = "";
			
			let element = document.getElementById('keyword-includeKey');
			  element.focus();
		};

		this.clearExcept = () => {			
	  		vm.keyword.exceptKey = "";
			
			let element = document.getElementById('keyword-exceptKey');
			  element.focus();
		};

  

}]);
