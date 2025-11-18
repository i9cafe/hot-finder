
angular.module('hotFinder')
.service('UtilsService', ['$timeout', '$uibModal', function($timeout, $uibModal) {

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
  

}]);
