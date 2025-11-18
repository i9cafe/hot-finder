'use strict';

const app = angular.module('hotFinder', ['ngRoute'
                , 'ui.bootstrap'
                , "ui.grid"
                , "ui.grid.resizeColumns"
                , "ui.grid.moveColumns"
                , "ui.grid.exporter"
				, 'ui.grid.pagination'
				, 'ui.grid.selection'])

  .controller('SubController', [
	'$scope',
	'$uibModalInstance',
	'parameters',
	function($scope, $uibModalInstance, parameters) {

		/*************************** DEFAULT INFO SETUP ***************************/
		const self = this;

		self.parameters = angular.copy(parameters) || {};

		$scope.data = angular.copy(self.parameters.data);

		
		this.selectData1 = () => {			
			const key = document.getElementById('key1').innerText;
			$uibModalInstance.close({ apiKey: key });
		}	
		
		this.selectData2 = () => {			
			const key = document.getElementById('key2').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData3 = () => {			
			const key = document.getElementById('key3').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData4 = () => {			
			const key = document.getElementById('key4').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData5 = () => {			
			const key = document.getElementById('key5').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData6 = () => {			
			const key = document.getElementById('key6').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData7 = () => {			
			const key = document.getElementById('key7').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData8 = () => {			
			const key = document.getElementById('key8').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData9 = () => {			
			const key = document.getElementById('key9').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData10 = () => {			
			const key = document.getElementById('key10').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData11 = () => {			
			const key = document.getElementById('key11').innerText;
			$uibModalInstance.close({ apiKey: key });
		}
		
		this.selectData12 = () => {			
			const key = document.getElementById('key12').innerText;
			$uibModalInstance.close({ apiKey: key });
		}

		}
	])




















































































































