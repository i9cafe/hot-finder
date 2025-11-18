'use strict';

const app = angular.module('hotFinder', ['ngRoute'
                , 'ui.bootstrap'
                , "ui.grid"
                , "ui.grid.resizeColumns"
                , "ui.grid.moveColumns"
                , "ui.grid.exporter"
				, 'ui.grid.pagination'
				, 'ui.grid.selection'])

  .controller('MainController', [
    '$scope',
    '$timeout',
	'$uibModal',
	  'UtilsService',
    function($scope, $timeout, $uibModal, UtilsService) {

      /*************************** DEFAULT INFO SETUP ***************************/
      const vm = this;

	  let failedFlag = 'N';
	  let pageToken = "";
	  
      vm.data = {};
      vm.data.apiKey = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";

	let apiClient = axios.create({
	        baseURL: "https://youtube.googleapis.com/youtube/v3",
	        params: { key: vm.data.apiKey }
	      });

	  const chanelBaseUrl = "https://www.youtube.com/channel/";

		// 채널ID 찾기 https://commentpicker.com/youtube-channel-id.php
	  vm.channelMaster = {};
	  vm.channelMaster.array = [
		  {
			id: "UCOZnrJilN9FsL8pGd0by6xg",
			name: "썰이빛나는밤에",
			url: chanelBaseUrl + "UCOZnrJilN9FsL8pGd0by6xg",
			flag: "Y",
			comment: "1"
		  }, {
			id: "UCrW6eDWbbdmxr-XfOkvQKwQ",
			name: "사연튜브 • 사연라디오",
			url: chanelBaseUrl + "UCrW6eDWbbdmxr-XfOkvQKwQ",
			flag: "Y",
			comment: "2"
		  }, {
			id: "UC8XIOLMm8kpoaEzjovaoesw",
			name: "금빛이야기",
			url: chanelBaseUrl + "UC8XIOLMm8kpoaEzjovaoesw",
			flag: "Y",
			comment: "3"
		  }, {
			id: "UCepniAEbQ3T75M2OuInzIOw",
			name: "소리로 읽는 세상",
			url: chanelBaseUrl + "UCepniAEbQ3T75M2OuInzIOw",
			flag: "Y",
			comment: "4"
		  }, {
			id: "UCjgM7Q280TRWOHmDT6Nr34A",
			name: "탑골사연공원",
			url: chanelBaseUrl + "UCjgM7Q280TRWOHmDT6Nr34A",
			flag: "Y",
			comment: "5"
		  }, {
			id: "UCzmHMfc84ebwfkRQV5ufAKw",
			name: "황혼사연",
			url: chanelBaseUrl + "UCzmHMfc84ebwfkRQV5ufAKw",
			flag: "Y",
			comment: "6"
		  }, {
			id: "UCT2S9OFvyF4rMZZQeNcIu3Q",
			name: "인생사연",
			url: chanelBaseUrl + "UCT2S9OFvyF4rMZZQeNcIu3Q",
			flag: "Y",
			comment: "7"
		  }, {
			id: "UCko5Mjg45-Kz8P2mq_2FFsg",
			name: "풀빛사연",
			url: chanelBaseUrl + "UCko5Mjg45-Kz8P2mq_2FFsg",
			flag: "Y",
			comment: "8"
		  }, {
			id: "UCZmDNNxAYodRPudlI0si0XA",
			name: "매일사연",
			url: chanelBaseUrl + "UCZmDNNxAYodRPudlI0si0XA",
			flag: "Y",
			comment: "9"
		  }, {
			id: "UCnDG7vNvXXpYxtv8ao5oWlw",
			name: "인생정자",
			url: chanelBaseUrl + "UCnDG7vNvXXpYxtv8ao5oWlw",
			flag: "Y",
			comment: "10"
		  }, {
			id: "UC5Fznx6E3uzShi7n_kIEFRA",
			name: "사연만사",
			url: chanelBaseUrl + "UC5Fznx6E3uzShi7n_kIEFRA",
			flag: "Y",
			comment: "11"
		  }, {
			id: "UCXVtesz30jjhcUQZAlhOUqw",
			name: "은하수별동네",
			url: chanelBaseUrl + "UCXVtesz30jjhcUQZAlhOUqw",
			flag: "Y",
			comment: "12"
		  }, {
			id: "UCm9niqYY_OzexSD4zLvNBeQ",
			name: "운명같은이야기",
			url: chanelBaseUrl + "UCm9niqYY_OzexSD4zLvNBeQ",
			flag: "Y",
			comment: "13"
		  }, {
			id: "UCHq8jnJywM22kIwjo8RgCIg",
			name: "세상만사요지경속이다",
			url: chanelBaseUrl + "UCHq8jnJywM22kIwjo8RgCIg",
			flag: "Y",
			comment: "14"
		  }, {
			id: "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			name: "스페셜튜브",
			url: chanelBaseUrl + "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			flag: "Y",
			comment: "15"
		  }, {
			id: "UC6jMDfjyquRk30OSoe1xjJQ",
			name: "마음의등대",
			url: chanelBaseUrl + "UC6jMDfjyquRk30OSoe1xjJQ",
			flag: "Y",
			comment: "16"
		  }, {
			id: "UC-MGBGZzfLLfmDiZP73f6ZQ",
			name: "노후의아름다운이야기",
			url: chanelBaseUrl + "UC-MGBGZzfLLfmDiZP73f6ZQ",
			flag: "Y",
			comment: "17"
		  }, {
			id: "UClmsF6cF0oSTBlR9pfG0MZw",
			name: "은빛다방",
			url: chanelBaseUrl + "UClmsF6cF0oSTBlR9pfG0MZw",
			flag: "Y",
			comment: "18"
		  }, {
			id: "UCNuGU6mCxH-qXcfH7gjMlmA",
			name: "각설탕회관",
			url: chanelBaseUrl + "UCNuGU6mCxH-qXcfH7gjMlmA",
			flag: "Y",
			comment: "19"
		  }, {
			id: "UCOLQ6s0kRWGurtiZkn7lpsA",
			name: "늘푸른인생",
			url: chanelBaseUrl + "UCOLQ6s0kRWGurtiZkn7lpsA",
			flag: "Y",
			comment: "20"
		  }, {
			id: "UCKCN9FEc3M225mFPlGiOteQ",
			name: "인생풍경",
			url: chanelBaseUrl + "UCKCN9FEc3M225mFPlGiOteQ",
			flag: "Y",
			comment: "21"
		  }, {
			id: "UC-jw_--Ma-gr9N0WvD3A9Ow",
			name: "인생은육십부터",
			url: chanelBaseUrl + "UC-jw_--Ma-gr9N0WvD3A9Ow",
			flag: "Y",
			comment: "22"
		  }, {
			id: "UCP51IWwyjeKnf6Xk9rvYLkg",
			name: "사연의빛",
			url: chanelBaseUrl + "UCP51IWwyjeKnf6Xk9rvYLkg",
			flag: "Y",
			comment: "23"
		  }, {
			id: "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			name: "눈내린소나무같은인생사연",
			url: chanelBaseUrl + "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			flag: "Y",
			comment: "24"
		  }, {
			id: "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			name: "세월의지혜",
			url: chanelBaseUrl + "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			flag: "Y",
			comment: "25"
		  }, {
			id: "UCrtZDHeWyWmc_PXYh_bPQog",
			name: "감사월드",
			url: chanelBaseUrl + "UCrtZDHeWyWmc_PXYh_bPQog",
			flag: "Y",
			comment: "26"
		  }, {
			id: "UCJaX4fqnQGoq1oPbpv6pGmg",
			name: "하늘빛마음",
			url: chanelBaseUrl + "UCJaX4fqnQGoq1oPbpv6pGmg",
			flag: "Y",
			comment: "27"
		  }, {
			id: "UC1GyaYKcLa2lU5JBFCDP4VQ",
			name: "어둠속의빛",
			url: chanelBaseUrl + "UC1GyaYKcLa2lU5JBFCDP4VQ",
			flag: "Y",
			comment: "28"
		  }, {
			id: "UCXwBhLpVZQOfBid9_h-FMrA",
			name: "톡톡사연",
			url: chanelBaseUrl + "UCXwBhLpVZQOfBid9_h-FMrA",
			flag: "Y",
			comment: "29"
		  }, {
			id: "UCrRBSlHTvHGOd6hyF3DLPPw",
			name: "랄라하의사연드라마",
			url: chanelBaseUrl + "UCrRBSlHTvHGOd6hyF3DLPPw",
			flag: "Y",
			comment: "30"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "31"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "32"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "33"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "34"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "35"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "36"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "37"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "38"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "39"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "40"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "41"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "42"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "43"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "44"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "45"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "46"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "47"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "48"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "49"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "50"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "51"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "52"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "53"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "54"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "55"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "56"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "57"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "58"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "59"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "60"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "61"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "62"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "63"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "64"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "65"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "66"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "67"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "68"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "69"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "70"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "71"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "72"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "73"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "74"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "75"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "76"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "77"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "78"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "79"
		  }, {
			id: "TEST",
			name: "NAME",
			url: chanelBaseUrl + "TEST",
			flag: "N",
			comment: "80"
		  }
	  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'));	
		
	vm.channelMaster.okTotalCount = vm.channelMaster.array.filter(function(target) {
			return target.flag === "Y";
		  }).length;
	  	  
      vm.data.hide = "접기";
      vm.data.totalCount = 0;
	  
	  vm.data.longTableDesc = '리스트 펼치기';
	  vm.data.channelAllFlag = 'Y';
		
		  vm.data.pageTokenPage = 1;
	    vm.data.recentUse = 'Y';

      vm.params = {};
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
		vm.params.startDate = null;
		vm.params.endDate = null;
	  
	  vm.keyword = {};
	  vm.keyword.includeKey = "";
	  vm.keyword.exceptKey = "";

      $scope.gridOptions = {
        enableColumnResizing: true,
        enableSorting: true,
        enableColumnMoving: false,	
		exporterMenuCsv: false, 
		virtualizationThreshold: 1000,

        onRegisterApi: function (gridapi) {
          $scope.gridApi = gridapi;
        }
      };

      $scope.gridOptions.columnDefs = [
        { displayName: "No", field: "no", width: "5%", pinnedLeft: true },
        { displayName: "채널명", field: "channelName", width: "11%", pinnedLeft: true },
        { displayName: "제목", field: "videoTitle", width: "14%", pinnedLeft: true },
        { displayName: "업로드일", field: "videoUploadDate", width: "11%", cellFilter: "date:'yyyy-MM-dd hh:mm:ss'" },
        { displayName: "조회수", field: "viewCount", width: "7%", cellFilter: 'number' },
        { displayName: "시간당조회수", field: "viewCountByTime", width: "9%", cellFilter: 'number:2' },
        { displayName: "구독자수", field: "subscriberCount", width: "7%", cellFilter: 'number' },
        { displayName: "구독자수대비조회수", field: "viewCountBySubscriberCount", width: "12%", cellFilter: 'number:2' },
        { displayName: "영상길이", field: "duration", width: "9%" },
        { displayName: "영상링크", field: "videoUrl", width: "7%",
          cellTemplate: '<div class="ui-grid-cell-contents">' +
                          '<a href="{{COL_FIELD}}" target="_blank">' +
                            '{{COL_FIELD}}' +
                          '</a>' +
                        '</div>' 
        },
        { displayName: "썸네일링크", field: "thumbnailsUrl", width: "8%",
          cellTemplate: '<div class="ui-grid-cell-contents">' +
                          '<a href="{{COL_FIELD}}" target="_blank">' +
                            '{{COL_FIELD}}' +
                          '</a>' +
                        '</div>' 
        },
      ];

      $scope.gridOptions.data = [];

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

      this.search = async () => {

		  failedFlag = 'N';

		  apiClient = axios.create({
	        baseURL: "https://youtube.googleapis.com/youtube/v3",
	        params: { key: vm.data.apiKey }
	      });

		if (vm.params.shortsLong === 'short' && (vm.params.shortsSecond === undefined || vm.params.shortsSecond === null || vm.params.shortsSecond === "" || vm.params.shortsSecond < 1)) {
			alert("1 이상의 값을 입력하세요. [쇼츠 기준(초)]");
			return;
		}

		if (vm.data.recentUse === 'Y' && (vm.params.recentDay === undefined || vm.params.recentDay === null || vm.params.recentDay === "" || vm.params.recentDay < 1)) {
			alert("1 이상의 값을 입력하세요. [최근 며칠간의 영상을 조회할까요]");
			return;
		}

		  if (vm.data.recentUse === 'N' && (vm.params.startDate === undefined || vm.params.startDate === null || vm.params.startDate === "")) {
			alert("날짜를 선택하세요. [검색 시작일]");
			return;
		}

		  if (vm.data.recentUse === 'N' && (vm.params.endDate === undefined || vm.params.endDate === null || vm.params.endDate === "")) {
			alert("날짜를 선택하세요. [검색 종료일]");
			return;
		}		  

		  const start = new Date(vm.params.startDate);
		  const end = new Date(vm.params.endDate);
		  const now = new Date();

		  if (vm.data.recentUse === 'N' && (start.getTime() >= now.getTime()) ) {
			alert("검색 시작일이 오늘 날짜를 넘을 수 없습니다.");
			return;
		}

		  if (vm.data.recentUse === 'N' && (start.getTime() >= end.getTime()) ) {
			alert("검색 종료일이 검색 시작일보다 같거나 이전 날짜일 수 없습니다.");
			return;
		}

		if (vm.params.minViewCount === undefined || vm.params.minViewCount === null || vm.params.minViewCount === "" || vm.params.minViewCount < 1) {
			alert("1 이상의 값을 입력하세요. [최소 조회수]");
			return;
		}

		if (vm.params.viewCountByMinTime === undefined || vm.params.viewCountByMinTime === null || vm.params.viewCountByMinTime === "" || vm.params.viewCountByMinTime < 1) {
			alert("1 이상의 값을 입력하세요. [최소 시간당 조회수]");
			return;
		}
		
		if (vm.params.excuteMode === "CHANNEL") { 

			if (vm.channelMaster.okTotalCount === 0) {
				alert("채널 모드 사전 설정 탭에서 검색할 채널을 1개 이상 체크하세요.");
				return;
			}

			if (vm.params.maxSearchCountByChannel === undefined || vm.params.maxSearchCountByChannel === null || vm.params.maxSearchCountByChannel === "" || 
			vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
			alert("1 ~ 50 사이의 값을 입력해주세요. [채널당 최대 검색 수]");
			return;
		}
						
			this.showLoader(); 
			
			let result = [];			
			let nowDate = new Date();
			
			let dataBeforeCnt = 0;
						
			for (let index = 0; index < vm.channelMaster.array.length; index++) {
				
				let channelId = vm.channelMaster.array[index].id;
				
				if (channelId === undefined || channelId === null || channelId.indexOf("U") === -1) {
				  continue;
				}

				if (vm.channelMaster.array[index].flag === "N") {
					continue;
				}
				
				let items = await this.doSearchChannelMode(channelId);

				if (failedFlag === 'Y') {
					return;	
				}

				if (items === undefined || items === null || items.length === 0) {
				  continue;					
				}
				
				let videoIdsString = "";
				let channelIdsString = "";

				for (let i = 0; i < items.length; i++) {
				  videoIdsString += items[i].id.videoId + ",";
				  channelIdsString += items[i].snippet.channelId + ",";
				}				
			
			if (videoIdsString.length > 0) {
				videoIdsString = videoIdsString.slice(0, -1);
			}
			if (channelIdsString.length > 0) {
				channelIdsString = channelIdsString.slice(0, -1);
			}
				
				  let videoList = await this.doSearchVideos(videoIdsString);			  
				  let channelList = await this.doSearchChannels(channelIdsString);
						
				Loop1:
				for (let i = 0; i < items.length; i++) {
				  let item = items[i];

				  Loop2:
				  for (let m = 0; m < videoList.length; m++) {
					  if (item.id.videoId === videoList[m].id) {
						item.videoInfo = videoList[m];
						break Loop2;					
					  }
				  }
				  
				  Loop3:
				  for (let n = 0; n < channelList.length; n++) {
					  if (item.snippet.channelId === channelList[n].id) {
						item.channelInfo = channelList[n];
						break Loop3;					
					  }				  
				  }
				}			
				
				for (let j = 0; j < items.length; j++) {
				  let obj = {};
					let itm = items[j];

					obj = this.makeObj(obj, itm);
			      
				  if (index === 0) {
					result[j] = obj;
				  } else {
					result[j + dataBeforeCnt] = obj; 
				  }
				}	

				dataBeforeCnt = result.length;				
			}			

			if (vm.params.shortsLong === "short" && Number(vm.params.shortsSecond) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.playTime) <= Number(vm.params.shortsSecond);
			  });
			}

			if (Number(vm.params.minViewCount) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCount) >= Number(vm.params.minViewCount);
			  });
			}

			if (Number(vm.params.viewCountByMinTime) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCountByTime) >= Number(vm.params.viewCountByMinTime);
			  });
			}

			result = result.sort((a, b) => b.viewCount - a.viewCount); 

			for (let k = 0; k < result.length; k++) {
			  result[k].no = k + 1;
			}

			$scope.gridOptions.data = result;
			$scope.$apply();

			vm.data.totalCount = result.length;
			
			this.hideLoader();

			if (vm.data.totalCount === 0) {
			  alert("검색조건을 만족하는 조회 결과가 없습니다.");
			}
			
		} else if (vm.params.excuteMode === "KEYWORD") {	
			
			if (vm.keyword.includeKey === "") {
			  alert("키워드 모드 사전 설정 탭에서 검색 키워드를 입력하세요.");
			  const keywordInput = document.getElementById('keyword-includeKey');
			  keywordInput.focus();
			  return;
			}		

			if (vm.keyword.exceptKey.length > 0 && vm.keyword.exceptKey.indexOf("-") === -1) {
			  alert("제외할 키워드는 키워드 앞에 '-'를 붙여주세요. 예) -낚시 -다이빙");
			  const keywordInput2 = document.getElementById('keyword-exceptKey');
			  keywordInput2.focus();
			  return;
			}	

		  if (vm.params.maxSearchCountByKeyword === undefined || vm.params.maxSearchCountByKeyword === null || vm.params.maxSearchCountByKeyword === "" || 
			  vm.params.maxSearchCountByKeyword < 1 || vm.params.maxSearchCountByKeyword > 50) {
			alert("1 ~ 50 사이의 값을 입력해주세요. [검색어당 최대 검색 수 1]");
			return;
		}

			if (vm.data.pageTokenPage === undefined || vm.data.pageTokenPage === null || vm.data.pageTokenPage === "" || 
			  vm.data.pageTokenPage < 1 || vm.data.pageTokenPage > 10) {
			alert("1 ~ 10 사이의 값을 입력해주세요. [검색어당 최대 검색 수 2]");
			return;
		}
			  
			vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;

			this.showLoader(); 

			let items = await this.doSearchKeywordMode();

			if (failedFlag === 'Y') {
				return;	
			}

			if (items === undefined || items === null || items.length === 0) {
			  return;
			}
			
			let videoIdsString = "";
			let channelIdsString = "";

			for (let i = 0; i < items.length; i++) {
			  videoIdsString += items[i].id.videoId + ",";
			  channelIdsString += items[i].snippet.channelId + ",";
			}				
			
			if (videoIdsString.length > 0) {
				videoIdsString = videoIdsString.slice(0, -1);
			}
			if (channelIdsString.length > 0) {
				channelIdsString = channelIdsString.slice(0, -1);
			}
				
				  let videoList = await this.doSearchVideos(videoIdsString);			  
				  let channelList = await this.doSearchChannels(channelIdsString);
			  		
			Loop1:
			for (let i = 0; i < items.length; i++) {
			  let item = items[i];

			  Loop2:
			  for (let m = 0; m < videoList.length; m++) {
				  if (item.id.videoId === videoList[m].id) {
					item.videoInfo = videoList[m];
					break Loop2;					
				  }
			  }
			  
			  Loop3:
			  for (let n = 0; n < channelList.length; n++) {
				  if (item.snippet.channelId === channelList[n].id) {
					item.channelInfo = channelList[n];
					break Loop3;					
				  }				  
			  }
			}			

			let result = [];
			let nowDate = new Date();
			let lastDataLengthCount = 0;

			for (let j = 0; j < items.length; j++) {
			  let obj = {};
				let itm = items[j];

					obj = this.makeObj(obj, itm);

			  result[j] = obj;
			}
			
			lastDataLengthCount = result.length;
			
			for (let token_index = 1; token_index < vm.data.pageTokenPage; token_index++) {
				if (pageToken === "") break;
				
				items = await this.doSearchKeywordModeToken(pageToken);

				if (failedFlag === 'Y') {
					return;	
				}

				if (items === undefined || items === null || items.length === 0) {
				  break;
				}

				videoIdsString = "";
				channelIdsString = "";

				for (let r = 0; r < items.length; r++) {
				  videoIdsString += items[r].id.videoId + ",";
				  channelIdsString += items[r].snippet.channelId + ",";
				}	
			
				if (videoIdsString.length > 0) {
					videoIdsString = videoIdsString.slice(0, -1);
				}
				if (channelIdsString.length > 0) {
					channelIdsString = channelIdsString.slice(0, -1);
				}
				
				  let videoList = await this.doSearchVideos(videoIdsString);			  
				  let channelList = await this.doSearchChannels(channelIdsString);
						
				Loop1:
				for (let i = 0; i < items.length; i++) {
				  let item = items[i];

				  Loop2:
				  for (let m = 0; m < videoList.length; m++) {
					  if (item.id.videoId === videoList[m].id) {
						item.videoInfo = videoList[m];
						break Loop2;					
					  }
				  }
				  
				  Loop3:
				  for (let n = 0; n < channelList.length; n++) {
					  if (item.snippet.channelId === channelList[n].id) {
						item.channelInfo = channelList[n];
						break Loop3;					
					  }				  
				  }
				}	
				
				for (let v = 0; v < items.length; v++) {
				  let obj = {};
					let itm = items[v];

					obj = this.makeObj(obj, itm);

				  result[lastDataLengthCount + v] = obj;
				}
				
				lastDataLengthCount = result.length;
				
			}

			if (vm.params.shortsLong === "short" && Number(vm.params.shortsSecond) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.playTime) <= Number(vm.params.shortsSecond);
			  });
			}

			if (Number(vm.params.minViewCount) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCount) >= Number(vm.params.minViewCount);
			  });
			}

			if (Number(vm.params.viewCountByMinTime) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCountByTime) >= Number(vm.params.viewCountByMinTime);
			  });
			}

			result = result.sort((a, b) => b.viewCount - a.viewCount); 

			for (let k = 0; k < result.length; k++) {
			  result[k].no = k + 1;
			}

			$scope.gridOptions.data = result;
			$scope.$apply();

			vm.data.totalCount = result.length;

			this.hideLoader(); 

			if (vm.data.totalCount === 0) {
			  alert("검색조건을 만족하는 조회 결과가 없습니다.");
			}
		} else {

			if (vm.channelMaster.okTotalCount === 0) {
				alert("채널 모드 사전 설정 탭에서 검색할 채널을 1개 이상 체크하세요.");
				return;
			}
		
			if (vm.keyword.includeKey === "") {
			  alert("키워드 모드 사전 설정 탭에서 검색 키워드를 입력하세요.");
			  const keywordInput = document.getElementById('keyword-includeKey');
			  keywordInput.focus();
			  return;
			}			

			if (vm.keyword.exceptKey.length > 0 && vm.keyword.exceptKey.indexOf("-") === -1) {
			  alert("제외할 키워드는 키워드 앞에 '-'를 붙여주세요. 예) -낚시 -다이빙");
			  const keywordInput2 = document.getElementById('keyword-exceptKey');
			  keywordInput2.focus();
			  return;
			}	

			if (vm.params.maxSearchCountByChannel === undefined || vm.params.maxSearchCountByChannel === null || vm.params.maxSearchCountByChannel === "" || 
			vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
			alert("1 ~ 50 사이의 값을 입력해주세요. [채널당 최대 검색 수]");
			return;
		}

		  if (vm.params.maxSearchCountByKeyword === undefined || vm.params.maxSearchCountByKeyword === null || vm.params.maxSearchCountByKeyword === "" || 
			  vm.params.maxSearchCountByKeyword < 1 || vm.params.maxSearchCountByKeyword > 50) {
			alert("1 ~ 50 사이의 값을 입력해주세요. [검색어당 최대 검색 수]");
			return;
		}
			  
			vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;
			
			this.showLoader(); 
			
			let result = [];			
			let nowDate = new Date();
			
			let dataBeforeCnt = 0;
						
			for (let index = 0; index < vm.channelMaster.array.length; index++) {
				
				let channelId = vm.channelMaster.array[index].id;
				
				if (channelId === undefined || channelId === null || channelId.indexOf("U") === -1) {
				  continue;
				}

				if (vm.channelMaster.array[index].flag === "N") {
					continue;
				}
				
				let items = await this.doSearchBothMode(channelId);

				if (failedFlag === 'Y') {
					return;	
				}

				if (items === undefined || items === null || items.length === 0) {
				  continue;
				}
				
				let videoIdsString = "";
				let channelIdsString = "";

				for (let i = 0; i < items.length; i++) {
				  videoIdsString += items[i].id.videoId + ",";
				  channelIdsString += items[i].snippet.channelId + ",";
				}				
			
			if (videoIdsString.length > 0) {
				videoIdsString = videoIdsString.slice(0, -1);
			}
			if (channelIdsString.length > 0) {
				channelIdsString = channelIdsString.slice(0, -1);
			}
				
				  let videoList = await this.doSearchVideos(videoIdsString);			  
				  let channelList = await this.doSearchChannels(channelIdsString);
						
				Loop1:
				for (let i = 0; i < items.length; i++) {
				  let item = items[i];

				  Loop2:
				  for (let m = 0; m < videoList.length; m++) {
					  if (item.id.videoId === videoList[m].id) {
						item.videoInfo = videoList[m];
						break Loop2;					
					  }
				  }
				  
				  Loop3:
				  for (let n = 0; n < channelList.length; n++) {
					  if (item.snippet.channelId === channelList[n].id) {
						item.channelInfo = channelList[n];
						break Loop3;					
					  }				  
				  }
				}			
				
				for (let j = 0; j < items.length; j++) {
				  let obj = {};
					let itm = items[j];

					obj = this.makeObj(obj, itm);
			      
				  if (index === 0) {
					result[j] = obj;
				  } else {
					result[j + dataBeforeCnt] = obj; 
				  }
				}	

				dataBeforeCnt = result.length;				
			}			

			if (vm.params.shortsLong === "short" && Number(vm.params.shortsSecond) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.playTime) <= Number(vm.params.shortsSecond);
			  });
			}

			if (Number(vm.params.minViewCount) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCount) >= Number(vm.params.minViewCount);
			  });
			}

			if (Number(vm.params.viewCountByMinTime) >= 0) {
			  result = result.filter(function(target) {
				return Number(target.viewCountByTime) >= Number(vm.params.viewCountByMinTime);
			  });
			}

			result = result.sort((a, b) => b.viewCount - a.viewCount); 

			for (let k = 0; k < result.length; k++) {
			  result[k].no = k + 1;
			}

			$scope.gridOptions.data = result;
			$scope.$apply();

			vm.data.totalCount = result.length;
			
			this.hideLoader(); 

			if (vm.data.totalCount === 0) {
			  alert("검색조건을 만족하는 조회 결과가 없습니다.");
			}
			
		}
      }

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

      this.doSearchKeywordMode = async () => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await apiClient.get('search', {
            params: {
              part: 'snippet',
              maxResults: (vm.params.maxSearchCountByKeyword <= 0 ? 1 : vm.params.maxSearchCountByKeyword),
              type: "video",
              regionCode: vm.params.country,
              relevanceLanguage: vm.params.language,
              videoDuration: vm.params.shortsLong,
			  order: (vm.params.checkPopular === 'Y' ? 'viewCount' : 'relevance'),
              q: vm.params.keyword,
              publishedAfter: (vm.data.recentUse === 'Y' ? new Date(today.setDate(today.getDate() - vm.params.recentDay)) : new Date(Date.UTC(y, m - 1, d))),
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c)))
            }
          });
		  
		  if (response.data.nextPageToken !== undefined && response.data.nextPageToken !== null &&
			response.data.nextPageToken !== "") {
				pageToken = response.data.nextPageToken;
			} else {
				pageToken = "";				
			}

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  

      this.doSearchKeywordModeToken = async (argPageToken) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await apiClient.get('search', {
            params: {
              part: 'snippet',
              maxResults: (vm.params.maxSearchCountByKeyword <= 0 ? 1 : vm.params.maxSearchCountByKeyword),
              type: "video",
              regionCode: vm.params.country,
              relevanceLanguage: vm.params.language,
              videoDuration: vm.params.shortsLong,
			  order: (vm.params.checkPopular === 'Y' ? 'viewCount' : 'relevance'),
              q: vm.params.keyword,
			  pageToken: argPageToken,
              publishedAfter: (vm.data.recentUse === 'Y' ? new Date(today.setDate(today.getDate() - vm.params.recentDay)) : new Date(Date.UTC(y, m - 1, d))),
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c)))
            }
          });
		  
		  if (response.data.nextPageToken !== undefined && response.data.nextPageToken !== null &&
			response.data.nextPageToken !== "") {
				pageToken = response.data.nextPageToken;
			} else {
				pageToken = "";				
			}

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  
	  this.doSearchChannelMode = async (arguChannelId) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await apiClient.get('search', {
            params: {
              part: 'snippet',
              maxResults: (vm.params.maxSearchCountByChannel <= 0 ? 1 : vm.params.maxSearchCountByChannel),
              type: "video",
              regionCode: vm.params.country,
              relevanceLanguage: vm.params.language,
              videoDuration: vm.params.shortsLong,
			  order: (vm.params.checkPopular === 'Y' ? 'viewCount' : 'relevance'),
              channelId: arguChannelId,
              publishedAfter: (vm.data.recentUse === 'Y' ? new Date(today.setDate(today.getDate() - vm.params.recentDay)) : new Date(Date.UTC(y, m - 1, d))),
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c)))
            }
          });
			
          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  
	  this.doSearchBothMode = async (arguChannelId) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await apiClient.get('search', {
            params: {
              part: 'snippet',
              maxResults: (vm.params.maxSearchCountByChannel <= 0 ? 1 : vm.params.maxSearchCountByChannel),
              type: "video",
              regionCode: vm.params.country,
              relevanceLanguage: vm.params.language,
              videoDuration: vm.params.shortsLong,
			  order: (vm.params.checkPopular === 'Y' ? 'viewCount' : 'relevance'),
              channelId: arguChannelId,
			  q: vm.params.keyword,
              publishedAfter: (vm.data.recentUse === 'Y' ? new Date(today.setDate(today.getDate() - vm.params.recentDay)) : new Date(Date.UTC(y, m - 1, d))),
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c)))
            }
          });
			
          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      }; 

      this.doSearchVideos = async (videoIds) => {
        try {
          const response = await apiClient.get('videos', {
            params: {
              part: 'snippet, statistics, contentDetails',
              id: videoIds
            },
          });

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
		
      this.doSearchChannels = async (channelIds) => {
        try {
          const response = await apiClient.get('channels', {
            params: {
              part: 'snippet, statistics',
              id: channelIds
            },
          });

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  
	  vm.changeStartDate = () => {
			UtilsService.changeStartDate();
	  };

      vm.changeShortsLong = () => {
			UtilsService.changeShortsLong(vm);
      };

		vm.changeRecentUse = () => {
			UtilsService.changeRecentUse(vm);
      };

		vm.errorFunc = (e) => {
			UtilsService.errorFunc(e);
		};

      vm.formatISODuration = (d) => {
			UtilsService.formatISODuration(d);
      };

      vm.formatISODurationSecond = (d) => {
			UtilsService.formatISODurationSecond(d);
      };

	  vm.clickKeywordTab = () => {
        UtilsService.clickKeywordTab();
	  };
		
	  vm.escapeCSV = (v) => {
        UtilsService.escapeCSV(v);
	  }

      vm.excelDownload = () => {
        UtilsService.excelDownload($scope.gridOptions);
	  };

      vm.showLoader = () => {
        UtilsService.showLoader();
      };

      vm.hideLoader = () => {
        UtilsService.hideLoader();
      };

		this.clickHome = () => {
			location.reload(); 
		}

      vm.hide = () => {
        UtilsService.hide(vm);
      };

		vm.clickGridCheckbox = () => {
			UtilsService.clickGridCheckbox(vm.channelMaster);
		};
		
		vm.longTable = () => {	
			UtilsService.longTable(vm.data);
		};
		
		vm.clickGridCheckboxAll = () => {
			UtilsService.clickGridCheckboxAll(vm.channelMaster, vm.data.channelAllFlag);				
		};

      vm.getKoreaTimeFromPacificMidnight = () => {
			UtilsService.getKoreaTimeFromPacificMidnight();
      };

		vm.showKey = () => {
				UtilsService.showKey().result.then(result => {
		            if (result && result.apiKey) vm.data.apiKey = result.apiKey;
		        }, cancel => {
													  
				});
		};

		vm.clearInclude = () => {	
        	UtilsService.clearInclude(vm);
		};

		vm.clearExcept = () => {		
        	UtilsService.clearExcept(vm);
		};

    }
  ])
	








































































































































