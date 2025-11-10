'use strict';

const app = angular.module('hotFinder', ['ngRoute'
                , 'ui.bootstrap'
                , "ui.grid"
                , "ui.grid.resizeColumns"
                , "ui.grid.moveColumns"
                , "ui.grid.exporter"])

  .controller('MainController', [
    '$scope',
    '$modal',
    function($scope, $modal) {

      /*************************** DEFAULT INFO SETUP ***************************/
      const vm = this;
      const YOUTUBE_API_KEY = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";
      const apiClient = axios.create({
        baseURL: "https://youtube.googleapis.com/youtube/v3",
        params: { key: YOUTUBE_API_KEY },
      });

      vm.data = {};
      vm.data.hide = "접기";
      vm.data.totalCount = 0;

      vm.params = {};
      vm.params.excuteMode = "KEYWORD";
      vm.params.shortsLong = "short";
      vm.params.shortsSecond = 30;
      vm.params.recentDay = 10;
      vm.params.country = "KR";
      vm.params.language = "ko";
      vm.params.maxSearchCountByChannel = 10;
      vm.params.maxSearchCountByKeyword = 50;
      vm.params.minViewCount = 1000;
      vm.params.viewCountByMinTime = 10;
      vm.params.checkPopular = "N";
      vm.params.keyword = "";

  	  //alert('Welcome! Have a nice day :)');

      $scope.gridOptions = {
          enableColumnResizing: true,

          onRegisterApi: function (gridapi) {
            $scope.gridApi = gridapi;
          }
      };

      $scope.gridOptions.columnDefs = [
        { displayName: "채널명", field: "channelName", width: "20%" },
        { displayName: "제목", field: "videoTitle", width: "25%" },
        { displayName: "업로드일", field: "videoUploadDate", width: "15%", cellFilter: "date:'yyyy-MM-dd hh:mm:ss'" },
        { displayName: "조회수", field: "viewCount", width: "10%", cellFilter: 'number' },
        { displayName: "시간당조회수", field: "viewCountByTime", width: "15%", cellFilter: 'number' },
        { displayName: "구독자수", field: "subscriberCount", width: "10%", cellFilter: 'number' },
        { displayName: "구독자수대비조회수", field: "viewCountBySubscriberCount", width: "15%", cellFilter: 'number' },
        { displayName: "영상길이", field: "duration", width: "15%" },
        { displayName: "영상링크", field: "videoUrl", width: "30%" },
        { displayName: "썸네일링크", field: "thumbnailsUrl", width: "30%" },
      ];

      $scope.gridOptions.data = [];

      this.reset = () => {
        vm.params.excuteMode = "KEYWORD";
        vm.params.shortsLong = "short";
        vm.params.shortsSecond = 30;
        vm.params.recentDay = 10;
        vm.params.country = "KR";
        vm.params.language = "ko";
        vm.params.maxSearchCountByChannel = 10;
        vm.params.maxSearchCountByKeyword = 50;
        vm.params.minViewCount = 1000;
        vm.params.viewCountByMinTime = 10;
        vm.params.checkPopular = "N";
        vm.params.keyword = "";
      };

      this.search = async () => {

        if (vm.params.keyword === "") {
          alert("검색 키워드를 입력하세요!");
          const keywordInput = document.getElementById('searchbox-keyword');
          keywordInput.focus();
          return;
        }

        this.showLoader(); // 로딩 시작

        let items = await this.doSearch();

        if (items === null || items.length === 0) {
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
          object.viewCount = items[j].videoInfo.data.items[0].statistics.viewCount;
          let uploadDate = new Date(object.videoUploadDate);
          let diffDate = nowDate.getTime() - uploadDate.getTime();
          object.viewCountByTime = (Number(object.viewCount) / (diffDate / (1000 * 60 * 60))).toFixed(0);
          object.subscriberCount = items[j].channelInfo.data.items[0].statistics.videoCount;
          object.viewCountBySubscriberCount = (Number(object.viewCount) / Number(object.subscriberCount)).toFixed(0);
          object.duration = this.formatISODuration(items[j].videoInfo.data.items[0].contentDetails.duration);
          object.playTime = this.formatISODurationSecond(items[j].videoInfo.data.items[0].contentDetails.duration);
          object.videoUrl = "https://www.youtube.com/watch?v=" + items[j].id.videoId;
          object.thumbnailsUrl = "https://img.youtube.com/vi/" + items[j].id.videoId + "/0.jpg";

          result[j] = object;
        }

        if (vm.params.shortsLong === "short" && vm.params.shortsSecond > 0) {
          result = result.filter(function(target) {
            return Number(target.playTime) <= Number(vm.params.shortsSecond);
          });
        }

        if (vm.params.minViewCount > 0) {
          result = result.filter(function(target) {
            return Number(target.viewCount) > Number(vm.params.minViewCount);
          });
        }

        if (vm.params.viewCountByMinTime > 0) {
          result = result.filter(function(target) {
            return Number(target.viewCountByTime) > Number(vm.params.viewCountByMinTime);
          });
        }

        $scope.gridOptions.data = result;
        $scope.$apply();

        vm.data.totalCount = result.length;

        this.hideLoader(); // 로딩 종료

        if (vm.data.totalCount === 0) {
          alert("조회 결과가 0건 입니다!");
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

      this.doSearch = async () => {
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
              q: vm.params.keyword,
              publishedAfter: new Date(today.setDate(today.getDate() - vm.params.recentDay)),
            },
          });

          return response.data.items;
        } catch (error) {
          alert('[Error] api: search, detail: ' + error);
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
          alert('[Error] api: videos, detail: ' + error);
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
          alert('[Error] api: channels, detail: ' + error);
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
        let value = document.getElementById('searchbox-shortsLong').value;

        if (value === "short") {
           document.getElementById('label-shortsSecond').style.color = "yellow";
        } else {
           document.getElementById('label-shortsSecond').style.color = "#9AA3BE";
        }      
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











