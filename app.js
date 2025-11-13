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
    function($scope, $timeout) {

      /*************************** DEFAULT INFO SETUP ***************************/
      const vm = this;

	  let failedFlag = 'N';
	  
      vm.data = {};
      vm.data.apiKey = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";
		// AIzaSyDA4CE4IBeDHUKdAvkYUmioojsF9x_xWww
		
      let apiClient = axios.create({
        baseURL: "https://youtube.googleapis.com/youtube/v3",
        params: { key: vm.data.apiKey },
      });

	  const chanelBaseUrl = "https://www.youtube.com/channel/";

		// url 로 채널 id 찾기
		//https://commentpicker.com/youtube-channel-id.php
	  vm.channelMaster = {};
	  vm.channelMaster.array = [
		  {
			id: "UCOZnrJilN9FsL8pGd0by6xg",
			name: "썰이빛나는밤에",
			url: chanelBaseUrl + "UCOZnrJilN9FsL8pGd0by6xg",
			flag: "Y",
			comment: "1",
		  }, {
			id: "UCrW6eDWbbdmxr-XfOkvQKwQ",
			name: "사연튜브 • 사연라디오",
			url: chanelBaseUrl + "UCrW6eDWbbdmxr-XfOkvQKwQ",
			flag: "Y",
			comment: "2",
		  }, {
			id: "UC8XIOLMm8kpoaEzjovaoesw",
			name: "금빛이야기",
			url: chanelBaseUrl + "UC8XIOLMm8kpoaEzjovaoesw",
			flag: "Y",
			comment: "3",
		  }, {
			id: "UCepniAEbQ3T75M2OuInzIOw",
			name: "소리로 읽는 세상",
			url: chanelBaseUrl + "UCepniAEbQ3T75M2OuInzIOw",
			flag: "Y",
			comment: "4",
		  }, {
			id: "UCjgM7Q280TRWOHmDT6Nr34A",
			name: "탑골사연공원",
			url: chanelBaseUrl + "UCjgM7Q280TRWOHmDT6Nr34A",
			flag: "Y",
			comment: "5",
		  }, {
			id: "UCzmHMfc84ebwfkRQV5ufAKw",
			name: "황혼사연",
			url: chanelBaseUrl + "UCzmHMfc84ebwfkRQV5ufAKw",
			flag: "Y",
			comment: "6",
		  }, {
			id: "UCT2S9OFvyF4rMZZQeNcIu3Q",
			name: "인생사연",
			url: chanelBaseUrl + "UCT2S9OFvyF4rMZZQeNcIu3Q",
			flag: "Y",
			comment: "7",
		  }, {
			id: "UCko5Mjg45-Kz8P2mq_2FFsg",
			name: "풀빛사연",
			url: chanelBaseUrl + "UCko5Mjg45-Kz8P2mq_2FFsg",
			flag: "Y",
			comment: "8",
		  }, {
			id: "UCZmDNNxAYodRPudlI0si0XA",
			name: "매일사연",
			url: chanelBaseUrl + "UCZmDNNxAYodRPudlI0si0XA",
			flag: "Y",
			comment: "9",
		  }, {
			id: "UCnDG7vNvXXpYxtv8ao5oWlw",
			name: "인생정자",
			url: chanelBaseUrl + "UCnDG7vNvXXpYxtv8ao5oWlw",
			flag: "Y",
			comment: "10",
		  }, {
			id: "UC5Fznx6E3uzShi7n_kIEFRA",
			name: "사연만사",
			url: chanelBaseUrl + "UC5Fznx6E3uzShi7n_kIEFRA",
			flag: "Y",
			comment: "11",
		  }, {
			id: "UCXVtesz30jjhcUQZAlhOUqw",
			name: "은하수별동네",
			url: chanelBaseUrl + "UCXVtesz30jjhcUQZAlhOUqw",
			flag: "Y",
			comment: "12",
		  }, {
			id: "UCm9niqYY_OzexSD4zLvNBeQ",
			name: "운명같은이야기",
			url: chanelBaseUrl + "UCm9niqYY_OzexSD4zLvNBeQ",
			flag: "Y",
			comment: "13",
		  }, {
			id: "UCHq8jnJywM22kIwjo8RgCIg",
			name: "세상만사요지경속이다",
			url: chanelBaseUrl + "UCHq8jnJywM22kIwjo8RgCIg",
			flag: "Y",
			comment: "14",
		  }, {
			id: "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			name: "스페셜튜브",
			url: chanelBaseUrl + "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			flag: "Y",
			comment: "15",
		  }, {
			id: "UC6jMDfjyquRk30OSoe1xjJQ",
			name: "마음의등대",
			url: chanelBaseUrl + "UC6jMDfjyquRk30OSoe1xjJQ",
			flag: "Y",
			comment: "16",
		  }, {
			id: "UC-MGBGZzfLLfmDiZP73f6ZQ",
			name: "노후의아름다운이야기",
			url: chanelBaseUrl + "UC-MGBGZzfLLfmDiZP73f6ZQ",
			flag: "Y",
			comment: "17",
		  }, {
			id: "UClmsF6cF0oSTBlR9pfG0MZw",
			name: "은빛다방",
			url: chanelBaseUrl + "UClmsF6cF0oSTBlR9pfG0MZw",
			flag: "Y",
			comment: "18",
		  }, {
			id: "UCNuGU6mCxH-qXcfH7gjMlmA",
			name: "각설탕회관",
			url: chanelBaseUrl + "UCNuGU6mCxH-qXcfH7gjMlmA",
			flag: "Y",
			comment: "19",
		  }, {
			id: "UCOLQ6s0kRWGurtiZkn7lpsA",
			name: "늘푸른인생",
			url: chanelBaseUrl + "UCOLQ6s0kRWGurtiZkn7lpsA",
			flag: "Y",
			comment: "20",
		  }, {
			id: "UCKCN9FEc3M225mFPlGiOteQ",
			name: "인생풍경",
			url: chanelBaseUrl + "UCKCN9FEc3M225mFPlGiOteQ",
			flag: "Y",
			comment: "21",
		  }, {
			id: "UC-jw_--Ma-gr9N0WvD3A9Ow",
			name: "인생은육십부터",
			url: chanelBaseUrl + "UC-jw_--Ma-gr9N0WvD3A9Ow",
			flag: "Y",
			comment: "22",
		  }, {
			id: "UCP51IWwyjeKnf6Xk9rvYLkg",
			name: "사연의빛",
			url: chanelBaseUrl + "UCP51IWwyjeKnf6Xk9rvYLkg",
			flag: "Y",
			comment: "23",
		  }, {
			id: "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			name: "눈내린소나무같은인생사연",
			url: chanelBaseUrl + "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			flag: "Y",
			comment: "24",
		  }, {
			id: "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			name: "세월의지혜",
			url: chanelBaseUrl + "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			flag: "Y",
			comment: "25",
		  }, {
			id: "UCrtZDHeWyWmc_PXYh_bPQog",
			name: "감사월드",
			url: chanelBaseUrl + "UCrtZDHeWyWmc_PXYh_bPQog",
			flag: "Y",
			comment: "26",
		  }, {
			id: "UCJaX4fqnQGoq1oPbpv6pGmg",
			name: "하늘빛마음",
			url: chanelBaseUrl + "UCJaX4fqnQGoq1oPbpv6pGmg",
			flag: "Y",
			comment: "27",
		  }, {
			id: "UC1GyaYKcLa2lU5JBFCDP4VQ",
			name: "어둠속의빛",
			url: chanelBaseUrl + "UC1GyaYKcLa2lU5JBFCDP4VQ",
			flag: "Y",
			comment: "28",
		  }, {
			id: "UCXwBhLpVZQOfBid9_h-FMrA",
			name: "톡톡사연",
			url: chanelBaseUrl + "UCXwBhLpVZQOfBid9_h-FMrA",
			flag: "Y",
			comment: "29",
		  }, {
			id: "UCrRBSlHTvHGOd6hyF3DLPPw",
			name: "랄라하의사연드라마",
			url: chanelBaseUrl + "UCrRBSlHTvHGOd6hyF3DLPPw",
			flag: "Y",
			comment: "30",
		  }
	  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'));	
		
	vm.channelMaster.okTotalCount = vm.channelMaster.array.filter(function(target) {
			return target.flag === "Y";
		  }).length;
	  	  
      vm.data.hide = "접기";
      vm.data.totalCount = 0;

      vm.params = {};
      vm.params.excuteMode = "CHANNEL";
      vm.params.shortsLong = "long";
      vm.params.shortsSecond = "";
      vm.params.recentDay = 10;
      vm.params.country = "KR";
      vm.params.language = "ko";
      vm.params.maxSearchCountByChannel = 10;
      vm.params.maxSearchCountByKeyword = 50;
      vm.params.minViewCount = 20000;
      vm.params.viewCountByMinTime = 500;
      vm.params.checkPopular = "Y";
      vm.params.keyword = "";
	  
	  vm.keyword = {};
	  vm.keyword.includeKey = "";
	  vm.keyword.exceptKey = "";

      $scope.gridOptions = {
        enableColumnResizing: true,
        enableSorting: true,
        enableColumnMoving: false,	
		exporterMenuCsv: false, 

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
        vm.params.maxSearchCountByChannel = 10;
        vm.params.maxSearchCountByKeyword = 50;
        vm.params.minViewCount = 20000;
        vm.params.viewCountByMinTime = 500;
        vm.params.checkPopular = "Y";
        vm.params.keyword = "";

        $timeout(() => {
          document.getElementById('searchbox-shortsSecond').setAttribute("readonly", true);
        });
      };

      this.search = async () => {

		  failedFlag = 'N';

		  apiClient = axios.create({
	        baseURL: "https://youtube.googleapis.com/youtube/v3",
	        params: { key: vm.data.apiKey },
	      });

		if (vm.params.maxSearchCountByChannel === undefined || vm.params.maxSearchCountByChannel === null || vm.params.maxSearchCountByChannel === "" || 
			vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
			alert("채널당 최대 검색 수는 1 ~ 50 사이의 값을 입력해주세요.");
			return;
		}

		  if (vm.params.maxSearchCountByKeyword === undefined || vm.params.maxSearchCountByKeyword === null || vm.params.maxSearchCountByKeyword === "" || 
			  vm.params.maxSearchCountByKeyword < 1 || vm.params.maxSearchCountByKeyword > 50) {
			alert("검색어당 최대 검색 수는 1 ~ 50 사이의 값을 입력해주세요.");
			return;
		}

		if (vm.params.shortsLong === 'short' && (vm.params.shortsSecond === undefined || vm.params.shortsSecond === null || vm.params.shortsSecond === "" || vm.params.shortsSecond < 1)) {
			alert("1 이상의 값을 입력하세요. [쇼츠 기준(초)]");
			return;
		}

		if (vm.params.recentDay === undefined || vm.params.recentDay === null || vm.params.recentDay === "" || vm.params.recentDay < 1) {
			alert("1 이상의 값을 입력하세요. [최근 며칠간의 영상을 조회할까요]");
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
						
			this.showLoader(); // 로딩 시작
			
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
				
				for (let i = 0; i < items.length; i++) {
				  let item = items[i];

				  let videoId = item.id.videoId;
				  let videoInfo = await this.doSearchVideo(videoId);
				  item.videoInfo = videoInfo;

				  let channelId = item.snippet.channelId;
				  let channelInfo = await this.doSearchChannel(channelId);
				  item.channelInfo = channelInfo;
				}			
				
				for (let j = 0; j < items.length; j++) {
				  let object = {};

				  object.channelName = items[j].snippet.channelTitle;
				  object.videoTitle = items[j].videoInfo.data.items[0].snippet.title;
				  object.videoUploadDate = items[j].snippet.publishedAt;
				  object.viewCount = Number(items[j].videoInfo.data.items[0].statistics.viewCount);
				  let uploadDate = new Date(object.videoUploadDate);
				  let diffDate = nowDate.getTime() - uploadDate.getTime();
				  object.viewCountByTime = (Number(object.viewCount) / (diffDate / (1000 * 60 * 60))).toFixed(2);
				  object.subscriberCount = Number(items[j].channelInfo.data.items[0].statistics.subscriberCount);
				  object.viewCountBySubscriberCount = (Number(object.viewCount) / Number(object.subscriberCount)).toFixed(2);
				  object.duration = this.formatISODuration(items[j].videoInfo.data.items[0].contentDetails.duration);
				  object.playTime = Number(this.formatISODurationSecond(items[j].videoInfo.data.items[0].contentDetails.duration));
				  object.videoUrl = "https://www.youtube.com/watch?v=" + items[j].id.videoId;
				  object.thumbnailsUrl = "https://img.youtube.com/vi/" + items[j].id.videoId + "/0.jpg";
					object.videoUploadDate = object.videoUploadDate.replace("T", " ");
					object.videoUploadDate = object.videoUploadDate.replace("Z", "");
			      
				  if (index === 0) {
					result[j] = object;
				  } else {
					result[j + dataBeforeCnt] = object; 
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
			
			this.hideLoader(); // 로딩 종료

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
			  
			vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;

			this.showLoader(); // 로딩 시작

			let items = await this.doSearchKeywordMode();

			if (failedFlag === 'Y') {
				return;	
			}

			if (items === undefined || items === null || items.length === 0) {
			  return;
			}

			for (let i = 0; i < items.length; i++) {
			  let item = items[i];

			  let videoId = item.id.videoId;
			  let videoInfo = await this.doSearchVideo(videoId);
			  item.videoInfo = videoInfo;

			  let channelId = item.snippet.channelId;
			  let channelInfo = await this.doSearchChannel(channelId);
			  item.channelInfo = channelInfo;
			}

			let result = [];
			let nowDate = new Date();

			for (let j = 0; j < items.length; j++) {
			  let object = {};

			  object.channelName = items[j].snippet.channelTitle;
			  object.videoTitle = items[j].videoInfo.data.items[0].snippet.title;
			  object.videoUploadDate = items[j].snippet.publishedAt;
			  object.viewCount = Number(items[j].videoInfo.data.items[0].statistics.viewCount);
			  let uploadDate = new Date(object.videoUploadDate);
			  let diffDate = nowDate.getTime() - uploadDate.getTime();
			  object.viewCountByTime = (Number(object.viewCount) / (diffDate / (1000 * 60 * 60))).toFixed(2);
			  object.subscriberCount = Number(items[j].channelInfo.data.items[0].statistics.subscriberCount);
			  object.viewCountBySubscriberCount = (Number(object.viewCount) / Number(object.subscriberCount)).toFixed(2);
			  object.duration = this.formatISODuration(items[j].videoInfo.data.items[0].contentDetails.duration);
			  object.playTime = Number(this.formatISODurationSecond(items[j].videoInfo.data.items[0].contentDetails.duration));
			  object.videoUrl = "https://www.youtube.com/watch?v=" + items[j].id.videoId;
			  object.thumbnailsUrl = "https://img.youtube.com/vi/" + items[j].id.videoId + "/0.jpg";
					object.videoUploadDate = object.videoUploadDate.replace("T", " ");
					object.videoUploadDate = object.videoUploadDate.replace("Z", "");

			  result[j] = object;
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

			this.hideLoader(); // 로딩 종료

			if (vm.data.totalCount === 0) {
			  alert("검색조건을 만족하는 조회 결과가 없습니다.");
			}
		} else { // 둘다

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
			  
			vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;
			
			this.showLoader(); // 로딩 시작
			
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
				
				for (let i = 0; i < items.length; i++) {
				  let item = items[i];

				  let videoId = item.id.videoId;
				  let videoInfo = await this.doSearchVideo(videoId);
				  item.videoInfo = videoInfo;

				  let channelId = item.snippet.channelId;
				  let channelInfo = await this.doSearchChannel(channelId);
				  item.channelInfo = channelInfo;
				}			
				
				for (let j = 0; j < items.length; j++) {
				  let object = {};

				  object.channelName = items[j].snippet.channelTitle;
				  object.videoTitle = items[j].videoInfo.data.items[0].snippet.title;
				  object.videoUploadDate = items[j].snippet.publishedAt;
				  object.viewCount = Number(items[j].videoInfo.data.items[0].statistics.viewCount);
				  let uploadDate = new Date(object.videoUploadDate);
				  let diffDate = nowDate.getTime() - uploadDate.getTime();
				  object.viewCountByTime = (Number(object.viewCount) / (diffDate / (1000 * 60 * 60))).toFixed(2);
				  object.subscriberCount = Number(items[j].channelInfo.data.items[0].statistics.subscriberCount);
				  object.viewCountBySubscriberCount = (Number(object.viewCount) / Number(object.subscriberCount)).toFixed(2);
				  object.duration = this.formatISODuration(items[j].videoInfo.data.items[0].contentDetails.duration);
				  object.playTime = Number(this.formatISODurationSecond(items[j].videoInfo.data.items[0].contentDetails.duration));
				  object.videoUrl = "https://www.youtube.com/watch?v=" + items[j].id.videoId;
				  object.thumbnailsUrl = "https://img.youtube.com/vi/" + items[j].id.videoId + "/0.jpg";
					object.videoUploadDate = object.videoUploadDate.replace("T", " ");
					object.videoUploadDate = object.videoUploadDate.replace("Z", "");
			      
				  if (index === 0) {
					result[j] = object;
				  } else {
					result[j + dataBeforeCnt] = object; 
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
			
			this.hideLoader(); // 로딩 종료

			if (vm.data.totalCount === 0) {
			  alert("검색조건을 만족하는 조회 결과가 없습니다.");
			}
			
		}
      }

      this.hide = () => {
        if (vm.data.hide === "접기") {
          document.getElementById('search-area').style.display = 'none';
          vm.data.hide = "펴기";
        } else {
          document.getElementById('search-area').style.display = 'block';
          vm.data.hide = "접기";
        }
      };

      this.doSearchKeywordMode = async () => {
        try {
          const today = new Date();

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
              publishedAfter: new Date(today.setDate(today.getDate() - vm.params.recentDay)),
            },
          });

          return response.data.items;
        } catch (error) {
          const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
          } else if (error.message.indexOf("400") > -1) {
			alert('잘못된 API KEY 입니다.');
		  } else {          
            alert('[Error] api: search, detail: ' + error);
          }

	      failedFlag = 'Y';
          this.hideLoader(); // 로딩 종료
		  return [];
        }
      };
	  
	  this.doSearchChannelMode = async (arguChannelId) => {
        try {
          const today = new Date();

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
              publishedAfter: new Date(today.setDate(today.getDate() - vm.params.recentDay)),
            },
          });
			
          return response.data.items;
        } catch (error) {
          const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
          } else if (error.message.indexOf("400") > -1) {
			alert('잘못된 API KEY 입니다.');
		  } else {          
            alert('[Error] api: search, detail: ' + error);
          }

	      failedFlag = 'Y';
          this.hideLoader(); // 로딩 종료
		  return [];
        }
      };
	  
	  this.doSearchBothMode = async (arguChannelId) => {
        try {
          const today = new Date();

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
              publishedAfter: new Date(today.setDate(today.getDate() - vm.params.recentDay)),
            },
          });
			
          return response.data.items;
        } catch (error) {
          const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
          } else if (error.message.indexOf("400") > -1) {
			alert('잘못된 API KEY 입니다.');
		  } else {          
            alert('[Error] api: search, detail: ' + error);
          }

	      failedFlag = 'Y';
          this.hideLoader(); // 로딩 종료
		  return [];
        }
      };

      this.doSearchVideo = async (videoId) => {
        try {
          const response = await apiClient.get('videos', {
            params: {
              part: 'snippet, statistics, contentDetails',
              id: videoId,
              //chart: "mostPopular",
            },
          });

          return response;
        } catch (error) {
          const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
          } else if (error.message.indexOf("400") > -1) {
			alert('잘못된 API KEY 입니다.');
		  } else {          
            alert('[Error] api: search, detail: ' + error);
          }

	      failedFlag = 'Y';
          this.hideLoader(); // 로딩 종료
		  return [];
        }
      };

      this.doSearchChannel = async (channelId) => {
        try {
          const response = await apiClient.get('channels', {
            params: {
              part: 'snippet, statistics',
              id: channelId,
            },
          });

          return response;
        } catch (error) {
          const resetTimeKST = this.getKoreaTimeFromPacificMidnight();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST);
          } else if (error.message.indexOf("400") > -1) {
			alert('잘못된 API KEY 입니다.');
		  } else {          
            alert('[Error] api: search, detail: ' + error);
          }

	      failedFlag = 'Y';
          this.hideLoader(); // 로딩 종료
		  return [];
        }
      };

	this.escapeCSV = (value) => {
	    if (value === null || value === undefined) return '';
	    let cell = String(value);
	    cell = cell.replace(/"/g, '""'); // 따옴표 이스케이프
	    if (/[",\n]/.test(cell)) {
	      cell = `"${cell}"`; // 콤마, 따옴표, 줄바꿈이 있으면 전체 감싸기
	    }
	    return cell;
	  }

      this.excelDownload = () => {
		  //$scope.gridApi.exporter.csvExport("visible", "visible");
		  
		  // 컬럼별 name 배열 (데이터 접근용)
			const columnNames = $scope.gridOptions.columnDefs.map(col => col.name);

			// 컬럼별 displayName 배열 (CSV 헤더용)
			const columnHeaders = $scope.gridOptions.columnDefs.map(col => col.displayName || col.name);
			
			const rows = $scope.gridOptions.data;

			// CSV 문자열 생성
			let csv = '';
			  csv += columnHeaders.map(this.escapeCSV).join(',') + '\n';
			
			  rows.forEach(row => {
			    const rowData = columnNames.map(colName => this.escapeCSV(row[colName]));
			    csv += rowData.join(',') + '\n';
			  });

			// UTF-8 BOM 추가
			const csvWithBOM = '\uFEFF' + csv;
			
			// 오늘 날짜 문자열 생성: YYYYMMDD
			const today = new Date();
			const yyyy = today.getFullYear();
			const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0~11
			const dd = String(today.getDate()).padStart(2, '0');
			const dateStr = `${yyyy}${mm}${dd}`;

			// 파일명에 날짜 포함
			const fileName = `유튜브조회결과_${dateStr}.csv`;

			// Blob 생성 후 다운로드
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

      this.formatISODuration = (duration) => {
        // 정규식으로 각 단위를 추출
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

        // 값이 모두 0일 경우
        if (result.length === 0) result.push('0초');

        return result.join(' ');
      };

      this.formatISODurationSecond = (duration) => {
        // 정규식으로 각 단위를 추출
        const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
        const matches = duration.match(regex);
      
        if (!matches) return '0초';
      
        const days = parseInt(matches[1] || 0, 10);
        const hours = parseInt(matches[2] || 0, 10);
        const minutes = parseInt(matches[3] || 0, 10);
        const seconds = parseInt(matches[4] || 0, 10);
      
        // 총 초 계산
        const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
      
        return totalSeconds;
      };

      this.changeShortsLong = () => {
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

	  this.clickKeywordTab = () => {
		const keywordInputControl = document.getElementById('keyword-includeKey');
		keywordInputControl.focus();
	  };

      // 로딩 화면 보이기
      this.showLoader = () => {
        document.getElementById('loader').style.display = 'flex';
        document.getElementById('content').style.display = 'none';
      };

      // 로딩 화면 숨기기
      this.hideLoader = () => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
      };

		this.clickHome = () => {
			location.reload(); // 페이지 새로고침
		}

		this.clickGridCheckbox = () => {

			vm.channelMaster.okTotalCount = vm.channelMaster.array.filter(function(target) {
				return target.flag === "Y";
			  }).length;
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

		this.showKey = () => {


		};

    }
  ])

  .controller('IndexController', [
    '$scope',
    function($scope) {

      /*************************** DEFAULT INFO SETUP ***************************/
      const vm = this;

  	  let today = new Date();
  	  let year = today.getFullYear(); // 년도
  	  let month = today.getMonth() + 1; // 월 (0부터 시작하므로 1 더함)
  	  let day = today.getDate(); // 일

  	  const today_MMdd = String(month).padStart(2, '0') + String(day).padStart(2, '0');

      const USER_ID = 'gw' + today_MMdd;
      const USER_PW = 1203;

      /*************************** FUNCTION LIST ***************************/
      this.login = () => {

        const id = document.getElementById("id");
        const pw = document.getElementById("pw");

        if (String(id.value) === null || String(id.value).trim() === '') {
          alert("Please Enter ID");
          return;
        } else if (String(pw.value) === null || String(pw.value).trim() === '') {
          alert("Please Enter Password");
          return;
        } else if (String(id.value).toLowerCase() !== USER_ID || Number(pw.value) !== USER_PW) {

          alert("Login Failed");
          return;

        } else {
          location.href = "main.html";
        }
      };

    }
  ])







































































