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
	  
      const YOUTUBE_API_KEY = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";
      const apiClient = axios.create({
        baseURL: "https://youtube.googleapis.com/youtube/v3",
        params: { key: YOUTUBE_API_KEY },
      });
	  
	  vm.channelMaster = {};
	  vm.channelMaster.array = [
		  {
			id: "UCOZnrJilN9FsL8pGd0by6xg",
			name: "썰이빛나는밤에",
		  }, {
			id: "UCrW6eDWbbdmxr-XfOkvQKwQ",
			name: "사연튜브 • 사연라디오",
		  }, {
			id: "3",
			name: "3",
		  }, {
			id: "4",
			name: "4",
		  }, {
			id: "5",
			name: "5",
		  }, {
			id: "6",
			name: "6",
		  }, {
			id: "...",
			name: "...",
		  }, {
			id: "134",
			name: "134",
		  }, {
			id: "135",
			name: "135",
		  }
	  ];
	  	  
      vm.data = {};
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
      vm.params.checkPopular = "N";
      vm.params.keyword = "";
	  
	  vm.keyword = {};
	  vm.keyword.includeKey = "";
	  vm.keyword.exceptKey = "";

  	  //alert('Welcome! Have a nice day :)');

      $scope.gridOptions = {
        enableColumnResizing: true,
        enableSorting: true,
        enableColumnMoving: false,	
		exporterCsvFilename: 'export.csv',
	    exporterCsvCustomFormatter: function(grid, csv) {
			return '\uFEFF' + csv; // BOM 추가
		  },
		exporterMenuCsv: false, // 메뉴 비활성화 (직접 버튼으로 다운로드)

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
        vm.params.checkPopular = "N";
        vm.params.keyword = "";

        $timeout(() => {
          document.getElementById('searchbox-shortsSecond').setAttribute("readonly", true);
        });
      };

      this.search = async () => {
		
		if (vm.params.excuteMode === "CHANNEL") { 
			
			//alert("해당 기능은 아직 준비 중입니다.");
			//return;
			
			this.showLoader(); // 로딩 시작
			
			let result = [];			
			let nowDate = new Date();
			
			let dataBeforeCnt = 0;
						
			for (let index = 0; index < vm.channelMaster.array.length; index++) {
				
				let channelId = vm.channelMaster.array[index].id;
				
				if (channelId === undefined || channelId === null || channelId.indexOf("U") === -1) {
				  continue;
				}
				
				let items = await this.doSearchChannelMode(channelId);

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
			      
				  if (index === 0) {
					result[j] = object;
				  } else {
					result[j + dataBeforeCnt] = object; 
				  }
				}	

				dataBeforeCnt += result.length;				
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

			for (let k = 0; k < result.length; k++) {
			  result[k].no = k + 1;
			}

			$scope.gridOptions.data = result;
			$scope.$apply();

			vm.data.totalCount = result.length;
			
			this.hideLoader(); // 로딩 종료

			if (vm.data.totalCount === 0) {
			  alert("검색 조건에 해당하는 조회 결과가 0건 입니다!");
			}
			
		} else if (vm.params.excuteMode === "KEYWORD") {			
			if (vm.keyword.includeKey === "") {
			  alert("키워드 설정 탭에서 검색 키워드를 입력하세요.");
			  const keywordInput = document.getElementById('keyword-includeKey');
			  keywordInput.focus();
			  return;
			}		
			  
			vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;

			this.showLoader(); // 로딩 시작

			let items = await this.doSearchKeywordMode();

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

			for (let k = 0; k < result.length; k++) {
			  result[k].no = k + 1;
			}

			$scope.gridOptions.data = result;
			$scope.$apply();

			vm.data.totalCount = result.length;

			this.hideLoader(); // 로딩 종료

			if (vm.data.totalCount === 0) {
			  alert("검색 조건에 해당하는 조회 결과가 0건 입니다!");
			}
		} else { // 둘다
			
			alert("해당 기능은 아직 준비 중입니다.");
			
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
          const resetTimeKST = getYouTubeQuotaResetTimeKST();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }));
          } else {          
            alert('[Error] api: search, detail: ' + error);
          }
          this.hideLoader(); // 로딩 종료
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
          const resetTimeKST = getYouTubeQuotaResetTimeKST();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }));
          } else {          
            alert('[Error] api: search, detail: ' + error);
          }
          this.hideLoader(); // 로딩 종료
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
          const resetTimeKST = getYouTubeQuotaResetTimeKST();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }));
          } else {          
            alert('[Error] api: search, detail: ' + error);
          }
          this.hideLoader(); // 로딩 종료
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
          const resetTimeKST = getYouTubeQuotaResetTimeKST();
          
          if (error.message.indexOf("403") > -1) {
            alert('일일 할당량을 모두 사용하셨습니다. \n' + '초기화되는 시간: ' + resetTimeKST.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }));
          } else {          
            alert('[Error] api: search, detail: ' + error);
          }
          this.hideLoader(); // 로딩 종료
        }
      };

      this.excelDownload = () => {
		  $scope.gridApi.exporter.csvExport("visible", "visible", true);
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
          
          vm.params.shortsSecond = (vm.params.shortsLong === "short") ? 30 : "";   
        });
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

      /**
       * YouTube Data API v3 할당량 초기화 시간이
       * 한국 시간(KST) 기준으로 언제인지 계산해주는 함수
       */
      this.getYouTubeQuotaResetTimeKST = () => {
        // 현재 날짜 기준으로 "오늘"의 태평양 자정(00:00 PST/PDT) 구하기
        const now = new Date();
      
        // 태평양 표준시 기준의 자정 생성
        const pacificMidnight = new Date(
          now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
        );
        pacificMidnight.setHours(0, 0, 0, 0);
      
        // 이 태평양 자정을 UTC로 변환
        const utcTime = new Date(
          pacificMidnight.toLocaleString("en-US", { timeZone: "UTC" })
        );
      
        // UTC → KST(UTC+9) 로 변환
        const kstTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
      
        return kstTime;
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














