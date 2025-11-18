
angular.module('hotFinder')
.service('UtilsService', ['$timeout', '$uibModal', function($timeout, $uibModal) {

      this.reset = () => {
		  
        vm.params.excuteMode = "CHANNEL";
        vm.params.shortsLong = "long";
        vm.params.shortsSecond = "";
        vm.params.recentDay = 10;
        vm.params.country = "KR";
        vm.params.language = "ko";
        vm.params.maxSearchCountByChannel = 50;
        vm.params.maxSearchCountByKeyword = 50;
        vm.params.minViewCount = 20000;
        vm.params.viewCountByMinTime = 500;
        vm.params.checkPopular = "Y";
        vm.params.keyword = "";

		  vm.data.pageTokenPage = 1;
	    vm.data.recentUse = 'Y';

        $timeout(() => {
          document.getElementById('searchbox-shortsSecond').setAttribute("readonly", true);
          document.getElementById('search-startDate').setAttribute("readonly", true);
          document.getElementById('search-endDate').setAttribute("readonly", true);
          document.getElementById('searchbox-recentDay').removeAttribute("readonly"); 		  		  
		  
			document.getElementById('search-startDate').style.color = 'gray';
			document.getElementById('search-endDate').style.color = 'gray';
			document.getElementById('searchbox-recentDay').style.color = 'lightgray';
			
			vm.params.recentDay = 10;
			vm.params.startDate = null;
			vm.params.endDate = null;
        });
      };

	this.makeObj = (obj, itm) => {
			
			let nowDate = new Date();

			obj = {};

			obj.channelName = itm.snippet.channelTitle;
				  obj.videoTitle = itm.videoInfo.snippet.title;
				  obj.videoUploadDate = itm.snippet.publishedAt;
				  obj.viewCount = Number(itm.videoInfo.statistics.viewCount);
				  let uploadDate = new Date(obj.videoUploadDate);
				  let diffDate = nowDate.getTime() - uploadDate.getTime();
				  obj.viewCountByTime = (Number(obj.viewCount) / (diffDate / (1000 * 60 * 60))).toFixed(2);
				  obj.subscriberCount = Number(itm.channelInfo.statistics.subscriberCount);
				  obj.viewCountBySubscriberCount = (Number(obj.viewCount) / Number(obj.subscriberCount)).toFixed(2);
				  obj.duration = this.formatISODuration(itm.videoInfo.contentDetails.duration);
				  obj.playTime = Number(this.formatISODurationSecond(itm.videoInfo.contentDetails.duration));
				  obj.videoUrl = "https://www.youtube.com/watch?v=" + itm.id.videoId;
				  obj.thumbnailsUrl = "https://img.youtube.com/vi/" + itm.id.videoId + "/0.jpg";
					obj.videoUploadDate = obj.videoUploadDate.replace("T", " ");
					obj.videoUploadDate = obj.videoUploadDate.replace("Z", "");
			
			return obj;
		};

	// ======================
  // API 에러 처리
  // ======================
  this.errorFunc = (error) => {
      const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
      if (error.message.indexOf("403") > -1) {
          alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
      } else if (error.message.indexOf("400") > -1) {
          alert('잘못된 API KEY 입니다.');
      } else {          
          alert('[Error]: ' + error.message);
      }
  };

	// ======================
  // Loader
  // ======================
  this.showLoader = () => {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('content').style.display = 'none';
      };

      this.hideLoader = () => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
      };

	 // ======================
  // 시간 관련
  // ======================
  this.getKoreaTimeFromPacificMidnight = () => {
				const n = new Date(), y = n.getUTCFullYear(),
		        s = new Date(Date.UTC(y,2,8 + (7-new Date(Date.UTC(y,2,8)).getUTCDay())%7,10)),
		        e = new Date(Date.UTC(y,10,1 + (7-new Date(Date.UTC(y,10,1)).getUTCDay())%7,9)),
		        o = (n >= s && n < e ? -7 : -8),
		        k = new Date(Date.UTC(y,n.getUTCMonth(),n.getUTCDate(),-o,0,0)+9*3600*1000),
		        h = k.getUTCHours();
		  return `${h>=12?'오후':'오전'} ${h%12||12}시`; 
      };

	// ======================
    // Excel / CSV 처리
    // ======================
    this.escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        let cell = String(value);
        cell = cell.replace(/"/g, '""'); 
        if (/[",\n]/.test(cell)) cell = `"${cell}"`;
        return cell;
    };

    this.excelDownload = (gridOptions) => {
        if (!gridOptions || !gridOptions.data) return;

        const columnNames = gridOptions.columnDefs.map(col => col.name);
        const columnHeaders = gridOptions.columnDefs.map(col => col.displayName || col.name);
        const rows = gridOptions.data;

        let csv = columnHeaders.map(this.escapeCSV).join(',') + '\n';
        rows.forEach(row => {
            const rowData = columnNames.map(colName => this.escapeCSV(row[colName]));
            csv += rowData.join(',') + '\n';
        });

        const csvWithBOM = '\uFEFF' + csv;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;

        const fileName = `유튜브조회결과_${dateStr}.csv`;
        const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

 // ======================
    // ISO Duration 처리
    // ======================
	 this.formatISODuration = (duration) => {
        const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
        const matches = duration.match(regex);

        if (!matches) return '';

        const days = parseInt(matches[1] || 0, 10);
        const hours = parseInt(matches[2] || 0, 10);
        const minutes = parseInt(matches[3] || 0, 10);
        const seconds = parseInt(matches[4] || 0, 10);

        let result = [];

        if (days) result.push(`${days}일`);
        if (hours) result.push(`${hours}시간`);
        if (minutes) result.push(`${minutes}분`);
        if (seconds) result.push(`${seconds}초`);

        if (result.length === 0) result.push('0초');

        return result.join(' ');
      };

      this.formatISODurationSecond = (duration) => {
        const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
        const matches = duration.match(regex);
      
        if (!matches) return '0초';
      
        const days = parseInt(matches[1] || 0, 10);
        const hours = parseInt(matches[2] || 0, 10);
        const minutes = parseInt(matches[3] || 0, 10);
        const seconds = parseInt(matches[4] || 0, 10);
      
        const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
      
        return totalSeconds;
      };

	this.clickKeywordTab = () => {
		const keywordInputControl = document.getElementById('keyword-includeKey');
		keywordInputControl.focus();
	  };

	this.clearInclude = (vm) => {			
	  		vm.keyword.includeKey = "";
			
			let element = document.getElementById('keyword-includeKey');
			  element.focus();
		};

		this.clearExcept = (vm) => {			
	  		vm.keyword.exceptKey = "";
			
			let element = document.getElementById('keyword-exceptKey');
			  element.focus();
		};

	this.clickGridCheckbox = (channelMaster) => {
        channelMaster.okTotalCount = channelMaster.array.filter(item => item.flag === 'Y').length;
    };

    this.clickGridCheckboxAll = (channelMaster, channelAllFlag) => {
        const flag = channelAllFlag === 'Y' ? 'Y' : 'N';
        channelMaster.array.forEach(item => item.flag = flag);
        channelMaster.okTotalCount = flag === 'Y' ? channelMaster.array.length : 0;
    };

    this.longTable = (data) => {
        const element = document.getElementById('scrollable-grid');
        if (data.longTableDesc === '리스트 펼치기') {
            $timeout(() => {
                element.style.removeProperty('max-height');
                data.longTableDesc = '리스트 접기';
            });
        } else {
            $timeout(() => {
                element.style.setProperty('max-height', '181px');
                data.longTableDesc = '리스트 펼치기';
            });
        }
    };

	this.showKey = () => {
        return $uibModal.open({
            templateUrl: 'modal.html',
            windowClass: 'modal-fullscreen',
            controller: 'SubController',
            controllerAs: 'self',
            backdrop: 'static',
            size: 'sm',
            animation: true,
            resolve: { parameters: () => ({ data: "success" }) }
        });
    };	

      this.hide = (vm) => {
        if (vm.data.hide === "접기") {
          document.getElementById('search-area').style.display = 'none';
          vm.data.hide = "펴기";
        } else {
          document.getElementById('search-area').style.display = 'block';
          vm.data.hide = "접기";
        }
      };

	this.changeStartDate = () => {
		  const searchEnd = document.getElementById('search-endDate');
		  
		  searchEnd.focus();
		  
		  if (searchEnd.showPicker) {
			searchEnd.showPicker();
		  }
	  };

      this.changeShortsLong = (vm) => {
        $timeout(() => {  
          
          const searchbox = document.getElementById('searchbox-shortsSecond');
          if (!searchbox) return;          
          if (vm.params.shortsLong !== "short") {
            searchbox.setAttribute("readonly", true);
          } else {
            searchbox.removeAttribute("readonly");   
            searchbox.focus();
          }
          
          vm.params.shortsSecond = (vm.params.shortsLong === "short") ? 300 : "";   
        });
      };

		this.changeRecentUse = (vm) => {
			const searchRec = document.getElementById('searchbox-recentDay');
	          
	          const searchStart = document.getElementById('search-startDate');
				
	          const searchEnd = document.getElementById('search-endDate');

			if (vm.data.recentUse === "Y") {				
				$timeout(() => {
				  searchRec.removeAttribute("readonly"); 
		            searchStart.setAttribute("readonly", true);
		            searchEnd.setAttribute("readonly", true);
					searchStart.style.color = 'gray';
					searchEnd.style.color = 'gray';
					searchRec.style.color = 'lightgray';
					vm.params.recentDay = 10;
					  searchRec.focus();
				});			
			} else {
				$timeout(() => {
		            searchRec.setAttribute("readonly", true);
		            searchStart.removeAttribute("readonly"); 
		            searchEnd.removeAttribute("readonly"); 
					searchStart.style.color = 'lightgray';
					searchEnd.style.color = 'lightgray';
					searchRec.style.color = 'gray';
					vm.params.recentDay = null;
					  searchStart.focus();
					  if (searchStart.showPicker) {
						searchStart.showPicker();
					  }
				});		
			}			
      };
  

}])

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

		
	}])
