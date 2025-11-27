angular.module('hotFinder')
.service('UtilsService', ['$timeout', '$uibModal', '$rootScope', function($timeout, $uibModal, $rootScope) {	

		this.search = async (vm) => {

			  vm.failedFlag = 'N';
	
			  vm.apiClient = axios.create({
				baseURL: vm.data.bu,
				params: { key: vm.data.apiKey }
			  });
	
			if (vm.params.shortsLong === 'short' && (vm.isNullOrEmpty(vm.params.shortsSecond) || vm.params.shortsSecond < 1)) {
				alert("1 이상의 값을 입력하세요. [쇼츠 기준(초)]");
				return;
			}
	
			if (vm.data.recentUse === 'Y' && (vm.isNullOrEmpty(vm.params.recentDay) || vm.params.recentDay < 1)) {
				alert("1 이상의 값을 입력하세요. [최근 며칠간의 영상을 조회할까요]");
				return;
			}
	
			  if (vm.data.recentUse === 'N' && vm.isNullOrEmpty(vm.params.startDate)) {
				alert("날짜를 선택하세요. [검색 시작일]");
				return;
			}
	
			  if (vm.data.recentUse === 'N' && vm.isNullOrEmpty(vm.params.endDate)) {
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
	
			if (vm.isNullOrEmpty(vm.params.minViewCount) || vm.params.minViewCount < 1) {
				alert("1 이상의 값을 입력하세요. [최소 조회수]");
				return;
			}
	
			if (vm.isNullOrEmpty(vm.params.viewCountByMinTime) || vm.params.viewCountByMinTime < 1) {
				alert("1 이상의 값을 입력하세요. [최소 시간당 조회수]");
				return;
			}				
			  
				if (vm.params.excuteMode === "CHANNEL") { 
		
					if (vm.channelMaster.okTotalCount === 0) {
						alert("채널 모드 사전 설정 탭에서 검색할 채널을 1개 이상 체크하세요.");
						return;
					}

					if (vm.channelMaster.okTotalCount > 98) {
						alert("검색할 채널은 최대 98개까지 가능합니다.");
						return;
					}
		
					if (vm.isNullOrEmpty(vm.params.maxSearchCountByChannel) || 
					vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
					alert("1 ~ 50 사이의 값을 입력해주세요. [채널당 최대 검색 수]");
					return;
				}

						
			  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
								
					vm.showLoader(); 
					
					let result = [];			
					let nowDate = new Date();
					
					let dataBeforeCnt = 0;
								
					for (let index = 0; index < vm.channelMaster.array.length; index++) {
						
						let channelId = vm.channelMaster.array[index].id;
						
						if (vm.isNullOrEmpty(channelId) || channelId.indexOf("U") === -1) {
						  continue;
						}
		
						if (vm.channelMaster.array[index].flag === "N") {
							continue;
						}
						
						let items = await vm.doSearchChannelMode(channelId);
		
						if (vm.failedFlag === 'Y') {
							return;	
						}
		
						if (vm.isNullOrEmpty(items) || items.length === 0) {
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString);			  
						  let channelList = await vm.doSearchChannels(channelIdsString);
								
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
		
							obj = vm.makeObj(obj, itm);
						  
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
				
							result = result.sort((a, b) => {
							  const cmp = b.viewCount - a.viewCount;
							  if (cmp !== 0) return cmp;
							  
							  return b.viewCountByTime - a.viewCountByTime;   
							});
								
							for (let k = 0; k < result.length; k++) {
							  result[k].no = k + 1;
							}
				
							vm.gridOptions.data = result;
							$rootScope.$applyAsync();
				
							vm.data.totalCount = result.length;
							
							vm.hideLoader();
				
							if (vm.data.totalCount === 0) {
							  alert("검색조건을 만족하는 조회 결과가 없습니다.");
							}
					
			
					  } else {
						  
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

						
			  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
		
					vm.pageToken = "";
					  
					vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;
		
					vm.showLoader(); 
		
					let items = await vm.doSearchKeywordMode();
		
					if (vm.failedFlag === 'Y') {
						return;	
					}
		
					if (vm.isNullOrEmpty(items) || items.length === 0) {
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString);			  
						  let channelList = await vm.doSearchChannels(channelIdsString);
							
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
		
							obj = vm.makeObj(obj, itm);
		
					  result[j] = obj;
					}
					
					lastDataLengthCount = result.length;
					
					for (let token_index = 1; token_index < vm.data.pageTokenPage; token_index++) {
						if (vm.pageToken === "") break;
						
						items = await vm.doSearchKeywordModeToken();
		
						if (vm.failedFlag === 'Y') {
							return;	
						}
		
						if (vm.isNullOrEmpty(items) || items.length === 0) {
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString);			  
						  let channelList = await vm.doSearchChannels(channelIdsString);
								
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
		
							obj = vm.makeObj(obj, itm);
		
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
			
						result = result.sort((a, b) => {
							  const cmp = b.viewCount - a.viewCount;
							  if (cmp !== 0) return cmp;
							  
							  return b.viewCountByTime - a.viewCountByTime;   
							});
			
						for (let k = 0; k < result.length; k++) {
						  result[k].no = k + 1;
						}
			
						vm.gridOptions.data = result;
						$rootScope.$applyAsync();
			
						vm.data.totalCount = result.length;
			
						vm.hideLoader(); 
			
						if (vm.data.totalCount === 0) {
						  alert("검색조건을 만족하는 조회 결과가 없습니다.");
						}
								
					  } else {
						  
					  }
				} else {
		
					if (vm.channelMaster.okTotalCount === 0) {
						alert("채널 모드 사전 설정 탭에서 검색할 채널을 1개 이상 체크하세요.");
						return;
					}

					if (vm.channelMaster.okTotalCount > 98) {
						alert("검색할 채널은 최대 98개까지 가능합니다.");
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
		
					if (vm.isNullOrEmpty(vm.params.maxSearchCountByChannel) || 
					vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
					alert("1 ~ 50 사이의 값을 입력해주세요. [채널당 최대 검색 수]");
					return;
				}
		
				  if (vm.isNullOrEmpty(vm.params.maxSearchCountByKeyword) || 
					  vm.params.maxSearchCountByKeyword < 1 || vm.params.maxSearchCountByKeyword > 50) {
					alert("1 ~ 50 사이의 값을 입력해주세요. [검색어당 최대 검색 수]");
					return;
				}
					
			  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
					  
					vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;
					
					vm.showLoader(); 
					
					let result = [];			
					let nowDate = new Date();
					
					let dataBeforeCnt = 0;
								
					for (let index = 0; index < vm.channelMaster.array.length; index++) {
						
						let channelId = vm.channelMaster.array[index].id;
						
						if (vm.isNullOrEmpty(channelId) || channelId.indexOf("U") === -1) {
						  continue;
						}
		
						if (vm.channelMaster.array[index].flag === "N") {
							continue;
						}
						
						let items = await vm.doSearchBothMode(channelId);
		
						if (vm.failedFlag === 'Y') {
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString);			  
						  let channelList = await vm.doSearchChannels(channelIdsString);
								
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
		
							obj = vm.makeObj(obj, itm);
						  
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
			
						result = result.sort((a, b) => {
							  const cmp = b.viewCount - a.viewCount;
							  if (cmp !== 0) return cmp;
							  
							  return b.viewCountByTime - a.viewCountByTime;   
							});
			
						for (let k = 0; k < result.length; k++) {
						  result[k].no = k + 1;
						}
			
						vm.gridOptions.data = result;
						$rootScope.$applyAsync();
			
						vm.data.totalCount = result.length;
						
						vm.hideLoader(); 
			
						if (vm.data.totalCount === 0) {
						  alert("검색조건을 만족하는 조회 결과가 없습니다.");
						}	
				  		
					  } else {
						  
					  }
			}
      }

      this.doSearchKeywordModeToken = async (vm) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await vm.apiClient.get('search', {
            params: {
              part: 'snippet',
              maxResults: (vm.params.maxSearchCountByKeyword <= 0 ? 1 : vm.params.maxSearchCountByKeyword),
              type: "video",
              regionCode: vm.params.country,
              relevanceLanguage: vm.params.language,
              videoDuration: vm.params.shortsLong,
			  order: (vm.params.checkPopular === 'Y' ? 'viewCount' : 'relevance'),
              q: vm.params.keyword,
			  pageToken: vm.pageToken,
              publishedAfter: (vm.data.recentUse === 'Y' ? new Date(today.setDate(today.getDate() - vm.params.recentDay)) : new Date(Date.UTC(y, m - 1, d))),
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c + 1)))
            }
          });
		  
		  if (response.data.nextPageToken !== undefined && response.data.nextPageToken !== null &&
			response.data.nextPageToken !== "") {
				vm.pageToken = response.data.nextPageToken;
			} else {
				vm.pageToken = "";				
			}

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };

      this.doSearchKeywordMode = async (vm) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await vm.apiClient.get('search', {
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
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c + 1)))
            }
          });
		  
		  if (response.data.nextPageToken !== undefined && response.data.nextPageToken !== null &&
			response.data.nextPageToken !== "") {
				vm.pageToken = response.data.nextPageToken;
			} else {
				vm.pageToken = "";				
			}

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  
	  this.doSearchChannelMode = async (arguChannelId, vm) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await vm.apiClient.get('search', {
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
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c + 1)))
            }
          });
			
          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
	  
	  this.doSearchBothMode = async (arguChannelId, vm) => {
        try {
          const today = new Date();
		  
		  const [y, m, d] = document.getElementById('search-startDate').value.split("-").map(Number);		  
		  const [a, b, c] = document.getElementById('search-endDate').value.split("-").map(Number);

          const response = await vm.apiClient.get('search', {
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
			  publishedBefore: (vm.data.recentUse === 'Y' ? new Date() : new Date(Date.UTC(a, b - 1, c + 1)))
            }
          });
			
          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      }; 

	this.doSearchVideos = async (videoIds, vm) => {
        try {
          const response = await vm.apiClient.get('videos', {
            params: {
              part: 'snippet, statistics, contentDetails',
              id: videoIds
            },
          });

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };
		
      this.doSearchChannels = async (channelIds, vm) => {
        try {
          const response = await vm.apiClient.get('channels', {
            params: {
              part: 'snippet, statistics',
              id: channelIds
            },
          });

          return response.data.items;
        } catch (error) {
          this.errorFunc(error);

	      vm.failedFlag = 'Y';
          this.hideLoader(); 
		  return [];
        }
      };

      this.reset = (vm) => {
		  
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
			
			vm.data.pageTokenPage = 1;
			document.getElementById('searchbox-pageToken').setAttribute("readonly", true);
			document.getElementById('searchbox-pageToken').style.color = 'gray';
			
			this.updateConsume(vm);
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
		  
		  this.isNullOrEmpty = (value) => {
		      return value === undefined || value === null || value === "";
		  };

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

		    this.escapeCSV = (value) => {
		        if (value === null || value === undefined) return '';
		        let cell = String(value);
		        cell = cell.replace(/"/g, '""'); 
		        if (/[",\n]/.test(cell)) cell = `"${cell}"`;
		        return cell;
		    };

		    this.excelDownload = (vm) => {
		        if (!vm.gridOptions || !vm.gridOptions.data || vm.data.totalCount === 0) {
					alert("다운로드할 데이터가 없습니다.");
					return;
				}
				
		        const columnNames = vm.gridOptions.columnDefs.map(col => col.name);
		        const columnHeaders = vm.gridOptions.columnDefs.map(col => col.displayName || col.name);
		        const rows = vm.gridOptions.data;
		
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

			 this.formatISODuration = (duration) => {
		
				 if (!duration) {
					return '';
				 }
				 
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
	
			 if (!duration) {
				return '';
			 }
			  
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

		this.clickGridCheckbox = (vm) => {
	        vm.channelMaster.okTotalCount = vm.channelMaster.array.filter(item => item.flag === 'Y').length;
			
			
			if (vm.channelMaster.array.length === vm.channelMaster.okTotalCount) {
				$timeout(() => {
					vm.data.channelAllFlag = 'Y';
					this.updateConsume(vm);
				});
			} else {
				$timeout(() => {
					vm.data.channelAllFlag = 'N';
					this.updateConsume(vm);
				});
			}			
	    };
	
	    this.clickGridCheckboxAll = (vm) => {
	        const flag = vm.data.channelAllFlag === 'Y' ? 'Y' : 'N';
	        vm.channelMaster.array.forEach(item => item.flag = flag);
	        vm.channelMaster.okTotalCount = flag === 'Y' ? vm.channelMaster.array.length : 0;
			
			this.updateConsume(vm);
	    };	

	    this.longTable = (vm) => {
	        const element = document.getElementById('scrollable-grid');
			
	        if (vm.data.longTableDesc === '리스트 펼치기') {
	            $timeout(() => {
	                element.style.removeProperty('max-height');
	                vm.data.longTableDesc = '리스트 접기';
	            });
	        } else {
	            $timeout(() => {
	                element.style.setProperty('max-height', '181px');
	                vm.data.longTableDesc = '리스트 펼치기';
	            });
	        }
	    };	
		
		this.changePageToken = (vm) => {
			this.updateConsume(vm);			
		}

	    this.updateConsume = (vm) => {
			if (vm.params.excuteMode === "CHANNEL") {
				vm.data.consume = vm.channelMaster.okTotalCount === 0 ? '-' : Number(vm.channelMaster.okTotalCount) * 102;	
			} else if (vm.params.excuteMode === "KEYWORD") {
				if (vm.data.pageTokenPage && vm.data.pageTokenPage >= 1 && vm.data.pageTokenPage <= 10) {					
					vm.data.consume = vm.channelMaster.okTotalCount === 0 ? '-' : Number(vm.channelMaster.okTotalCount) * 102;
				} else {
					vm.data.consume = '-';
				}
			} else {
				vm.data.consume = Number(vm.channelMaster.okTotalCount) * 102;	
			}
			
			const element = document.getElementById('consume');
			
			if (vm.data.consume > 10000) {			
				$timeout(() => {
	                element.style.color = 'orangered';
	            });
			} else {
				$timeout(() => {
	                element.style.color = 'gainsboro';
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

		this.changeExcuteMode = (vm) => {

			const element = document.getElementById('searchbox-pageToken');
			
			if (vm.params.excuteMode === "CHANNEL") {
				$timeout(() => {
					vm.data.pageTokenPage = 1;
		            element.setAttribute("readonly", true);
					element.style.color = 'gray';
					this.updateConsume(vm);
					
				});			
			} else if (vm.params.excuteMode === "KEYWORD") {
				$timeout(() => {
					vm.data.pageTokenPage = 1;
				    element.removeAttribute("readonly"); 
					element.style.color = 'lightgray';
					  element.focus();
					this.updateConsume(vm);
					
				});			
			} else {
				$timeout(() => {
					vm.data.pageTokenPage = 1;
		            element.setAttribute("readonly", true);
					element.style.color = 'gray';
					this.updateConsume(vm);
					
				});			
			}			
			
		};	

		this.changeChannelSet = (vm) => {
			
			if (vm.data.set === "set1") {
				$timeout(() => {					
					vm.channelMaster.array.forEach((item, index) => {
					  if (item.ord >= 1 && item.ord <= 98) {
						  item.flag = "Y";
					  } else {
						  item.flag = "N";
					  }
					});
					
					vm.data.channelAllFlag = 'N';
					
					vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
						return target.flag === "Y";
					  }).length;
					  
					  this.updateConsume(vm);					
				});			
			} else if (vm.data.set === "set2") {
				$timeout(() => {					
					vm.channelMaster.array.forEach((item, index) => {
					  if (item.ord >= 99 && item.ord <= 196) {
						  item.flag = "Y";
					  } else {
						  item.flag = "N";
					  }
					});
					
					vm.data.channelAllFlag = 'N';
					
					vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
						return target.flag === "Y";
					  }).length;
					  
					  this.updateConsume(vm);					
				});			
			} else if (vm.data.set === "set3") {
				$timeout(() => {					
					vm.channelMaster.array.forEach((item, index) => {
					  if (item.ord >= 197 && item.ord <= 294) {
						  item.flag = "Y";
					  } else {
						  item.flag = "N";
					  }
					});
					
					vm.data.channelAllFlag = 'N';
					
					vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
						return target.flag === "Y";
					  }).length;
					  
					  this.updateConsume(vm);					
				});			
			} 
		};

		this.changeChannelOrder = (vm) => {
			
			if (vm.data.order === "abc") {
				$timeout(() => {					
					vm.channelMaster.array.sort((a, b) => {
						  const nameCompare = a.name.localeCompare(b.name, 'ko');
						  if (nameCompare !== 0) return nameCompare;
						  
						  return b.sub - a.sub;   
						});

					vm.channelMaster.array.forEach((item, index) => {
					  item.ord = index + 1;
					  if (item.ord >= 1 && item.ord <= 98) {
						  item.flag = "Y";
					  } else if (item.ord > 98) {
						  item.flag = "N";		
					  }
					}); 
					
					vm.data.channelAllFlag = 'N';
					
					vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
						return target.flag === "Y";
					  }).length;
					  
					  vm.data.set = "set1";
					  
					  this.updateConsume(vm);
					
				});			
			} else if (vm.data.order === "sub") {
				$timeout(() => {					
					vm.channelMaster.array.sort((a, b) => {
						  const subCompare = b.sub - a.sub; 
						  if (subCompare !== 0) return subCompare;
						  
						  return a.name.localeCompare(b.name, 'ko');   
						});

					vm.channelMaster.array.forEach((item, index) => {
					  item.ord = index + 1;
					  if (item.ord >= 1 && item.ord <= 98) {
						  item.flag = "Y";
					  } else if (item.ord > 98) {
						  item.flag = "N";		
					  }
					}); 
					
					vm.data.channelAllFlag = 'N';
					
					vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
						return target.flag === "Y";
					  }).length;
					  
					  vm.data.set = "set1";
					  
					  this.updateConsume(vm);
					
				});			
			} 
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
