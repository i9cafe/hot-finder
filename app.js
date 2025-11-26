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

	  vm.failedFlag = 'N';
	  vm.pageToken = "";
	  
      vm.data = {};
	  vm.data.bu = "https://youtube.googleapis.com/youtube/v3";
      vm.data.apiKey = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";

	   vm.apiClient = axios.create({
	        baseURL: vm.data.bu,
	        params: { key: vm.data.apiKey }
	    });

	  const BU = "https://www.youtube.com/channel/";

		// 채널ID 찾기 https://commentpicker.com/youtube-channel-id.php
	  vm.channelMaster = {};
	  vm.channelMaster.array = [
		  {
			id: "UCOZnrJilN9FsL8pGd0by6xg",
			name: "썰이빛나는밤에",
			url: BU + "UCOZnrJilN9FsL8pGd0by6xg",
			flag: "Y",
			ord: 1,
			sub: 575000
		  }, {
			id: "UCrW6eDWbbdmxr-XfOkvQKwQ",
			name: "사연튜브사연라디오",
			url: BU + "UCrW6eDWbbdmxr-XfOkvQKwQ",
			flag: "Y",
			ord: 2,
			sub: 447000
		  }, {
			id: "UC8XIOLMm8kpoaEzjovaoesw",
			name: "금빛이야기",
			url: BU + "UC8XIOLMm8kpoaEzjovaoesw",
			flag: "Y",
			ord: 3,
			sub: 86300
		  }, {
			id: "UCepniAEbQ3T75M2OuInzIOw",
			name: "소리로읽는세상",
			url: BU + "UCepniAEbQ3T75M2OuInzIOw",
			flag: "Y",
			ord: 4,
			sub: 82500
		  }, {
			id: "UCjgM7Q280TRWOHmDT6Nr34A",
			name: "탑골사연공원",
			url: BU + "UCjgM7Q280TRWOHmDT6Nr34A",
			flag: "Y",
			ord: 5,
			sub: 17800
		  }, {
			id: "UCzmHMfc84ebwfkRQV5ufAKw",
			name: "황혼사연",
			url: BU + "UCzmHMfc84ebwfkRQV5ufAKw",
			flag: "Y",
			ord: 6,
			sub: 13100
		  }, {
			id: "UCT2S9OFvyF4rMZZQeNcIu3Q",
			name: "인생사연",
			url: BU + "UCT2S9OFvyF4rMZZQeNcIu3Q",
			flag: "Y",
			ord: 7,
			sub: 238000
		  }, {
			id: "UCko5Mjg45-Kz8P2mq_2FFsg",
			name: "풀빛사연",
			url: BU + "UCko5Mjg45-Kz8P2mq_2FFsg",
			flag: "Y",
			ord: 8,
			sub: 71600
		  }, {
			id: "UCZmDNNxAYodRPudlI0si0XA",
			name: "매일사연",
			url: BU + "UCZmDNNxAYodRPudlI0si0XA",
			flag: "Y",
			ord: 9,
			sub: 46400
		  }, {
			id: "UCnDG7vNvXXpYxtv8ao5oWlw",
			name: "인생정자",
			url: BU + "UCnDG7vNvXXpYxtv8ao5oWlw",
			flag: "Y",
			ord: 10,
			sub: 29600
		  }, {
			id: "UC5Fznx6E3uzShi7n_kIEFRA",
			name: "사연만사",
			url: BU + "UC5Fznx6E3uzShi7n_kIEFRA",
			flag: "Y",
			ord: 11,
			sub: 51300
		  }, {
			id: "UCXVtesz30jjhcUQZAlhOUqw",
			name: "은하수별동네",
			url: BU + "UCXVtesz30jjhcUQZAlhOUqw",
			flag: "Y",
			ord: 12,
			sub: 11600
		  }, {
			id: "UCm9niqYY_OzexSD4zLvNBeQ",
			name: "운명같은이야기",
			url: BU + "UCm9niqYY_OzexSD4zLvNBeQ",
			flag: "Y",
			ord: 13,
			sub: 50900
		  }, {
			id: "UCHq8jnJywM22kIwjo8RgCIg",
			name: "세상만사요지경속이다",
			url: BU + "UCHq8jnJywM22kIwjo8RgCIg",
			flag: "Y",
			ord: 14,
			sub: 124000
		  }, {
			id: "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			name: "스페셜튜브",
			url: BU + "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			flag: "Y",
			ord: 15,
			sub: 162000
		  }, {
			id: "UC6jMDfjyquRk30OSoe1xjJQ",
			name: "마음의등대",
			url: BU + "UC6jMDfjyquRk30OSoe1xjJQ",
			flag: "Y",
			ord: 16,
			sub: 23800
		  }, {
			id: "UC-MGBGZzfLLfmDiZP73f6ZQ",
			name: "노후의아름다운이야기",
			url: BU + "UC-MGBGZzfLLfmDiZP73f6ZQ",
			flag: "Y",
			ord: 17,
			sub: 69600
		  }, {
			id: "UClmsF6cF0oSTBlR9pfG0MZw",
			name: "은빛다방",
			url: BU + "UClmsF6cF0oSTBlR9pfG0MZw",
			flag: "Y",
			ord: 18,
			sub: 44800
		  }, {
			id: "UCNuGU6mCxH-qXcfH7gjMlmA",
			name: "각설탕회관",
			url: BU + "UCNuGU6mCxH-qXcfH7gjMlmA",
			flag: "Y",
			ord: 19,
			sub: 5310
		  }, {
			id: "UCOLQ6s0kRWGurtiZkn7lpsA",
			name: "늘푸른인생",
			url: BU + "UCOLQ6s0kRWGurtiZkn7lpsA",
			flag: "Y",
			ord: 20,
			sub: 43000
		  }, {
			id: "UC6IIOR-Z7v5_kyMXbmEplfQ",
			name: "인생바라기",
			url: BU + "UC6IIOR-Z7v5_kyMXbmEplfQ",
			flag: "Y",
			ord: 21,
			sub: 57800
		  }, {
			id: "UC-jw_--Ma-gr9N0WvD3A9Ow",
			name: "인생은육십부터",
			url: BU + "UC-jw_--Ma-gr9N0WvD3A9Ow",
			flag: "Y",
			ord: 22,
			sub: 45000
		  }, {
			id: "UCP51IWwyjeKnf6Xk9rvYLkg",
			name: "사연의빛",
			url: BU + "UCP51IWwyjeKnf6Xk9rvYLkg",
			flag: "Y",
			ord: 23,
			sub: 37400
		  }, {
			id: "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			name: "눈내린소나무같은인생사연",
			url: BU + "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			flag: "Y",
			ord: 24,
			sub: 50200
		  }, {
			id: "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			name: "세월의지혜",
			url: BU + "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			flag: "Y",
			ord: 25,
			sub: 84600
		  }, {
			id: "UCrtZDHeWyWmc_PXYh_bPQog",
			name: "감사월드",
			url: BU + "UCrtZDHeWyWmc_PXYh_bPQog",
			flag: "Y",
			ord: 26,
			sub: 42900
		  }, {
			id: "UCJaX4fqnQGoq1oPbpv6pGmg",
			name: "하늘빛마음",
			url: BU + "UCJaX4fqnQGoq1oPbpv6pGmg",
			flag: "Y",
			ord: 27,
			sub: 24300
		  }, {
			id: "UC1GyaYKcLa2lU5JBFCDP4VQ",
			name: "어둠속의빛",
			url: BU + "UC1GyaYKcLa2lU5JBFCDP4VQ",
			flag: "Y",
			ord: 28,
			sub: 32300
		  }, {
			id: "UCXwBhLpVZQOfBid9_h-FMrA",
			name: "톡톡사연",
			url: BU + "UCXwBhLpVZQOfBid9_h-FMrA",
			flag: "Y",
			ord: 29,
			sub: 348000
		  }, {
			id: "UCrRBSlHTvHGOd6hyF3DLPPw",
			name: "랄라하의사연드라마",
			url: BU + "UCrRBSlHTvHGOd6hyF3DLPPw",
			flag: "Y",
			ord: 30,
			sub: 433000
		  }, {
			id: "UCMIPYHFP0Y6rMR9pMCfw22Q",
			name: "추억의향기",
			url: BU + "UCMIPYHFP0Y6rMR9pMCfw22Q",
			flag: "Y",
			ord: 31,
			sub: 10100
		  }, {
			id: "UCV42dR87lzxj1rW_PKBzOFg",
			name: "백만사연",
			url: BU + "UCV42dR87lzxj1rW_PKBzOFg",
			flag: "Y",
			ord: 32,
			sub: 56400
		  }, {
			id: "UC8uOInmvo02yFikl3sJ1ohg",
			name: "사연속으로",
			url: BU + "UC8uOInmvo02yFikl3sJ1ohg",
			flag: "Y",
			ord: 33,
			sub: 210000
		  }, {
			id: "UCXKjRRSHojm4fahC0j1LIuQ",
			name: "인생따라바람따라",
			url: BU + "UCXKjRRSHojm4fahC0j1LIuQ",
			flag: "Y",
			ord: 34,
			sub: 28100
		  }, {
			id: "UCtHooblia6W73O16zN7jxfw",
			name: "인생나날",
			url: BU + "UCtHooblia6W73O16zN7jxfw",
			flag: "Y",
			ord: 35,
			sub: 70000
		  }, {
			id: "UCfil2r_kgxcFiU8sO0q-Grg",
			name: "밤의이야기",
			url: BU + "UCfil2r_kgxcFiU8sO0q-Grg",
			flag: "Y",
			ord: 36,
			sub: 28500
		  }, {
			id: "UCeC22b4HaVTyha58HrMjIsA",
			name: "노을빛인생",
			url: BU + "UCeC22b4HaVTyha58HrMjIsA",
			flag: "Y",
			ord: 37,
			sub: 25800
		  }, {
			id: "UCWL95jlSaNHx2XQHjd4sOeA",
			name: "감동이야기",
			url: BU + "UCWL95jlSaNHx2XQHjd4sOeA",
			flag: "Y",
			ord: 38,
			sub: 114000
		  }, {
			id: "UCYEZFZKSR66PyYPY92SKRng",
			name: "고부관계",
			url: BU + "UCYEZFZKSR66PyYPY92SKRng",
			flag: "Y",
			ord: 39,
			sub: 2280
		  }, {
			id: "UCqId-7lAPFeuzqMqzQm_osA",
			name: "마음이야기",
			url: BU + "UCqId-7lAPFeuzqMqzQm_osA",
			flag: "Y",
			ord: 40,
			sub: 10500
		  }, {
			id: "UCS2CpRATJ495FCZe7RP_yHg",
			name: "밤의인생",
			url: BU + "UCS2CpRATJ495FCZe7RP_yHg",
			flag: "Y",
			ord: 41,
			sub: 15200
		  }, {
			id: "UC0miLal8tz9efrRfpfElpGw",
			name: "보라빛인생사연",
			url: BU + "UC0miLal8tz9efrRfpfElpGw",
			flag: "Y",
			ord: 42,
			sub: 15300
		  }, {
			id: "UCCcouVtd0bGzsn9mM1EeBNw",
			name: "감동쓰나미",
			url: BU + "UCCcouVtd0bGzsn9mM1EeBNw",
			flag: "Y",
			ord: 43,
			sub: 15800
		  }, {
			id: "UCj82PP56tg53pCQWWXm9Vxg",
			name: "이야기술술",
			url: BU + "UCj82PP56tg53pCQWWXm9Vxg",
			flag: "Y",
			ord: "44",
			sub: 5030
		  }, {
			id: "UC9AHX1dC3Xofj67Kfm4ZHFg",
			name: "삶의감동",
			url: BU + "UC9AHX1dC3Xofj67Kfm4ZHFg",
			flag: "Y",
			ord: 45,
			sub: 13600
		  }, {
			id: "UCXGTwL06yRZLjNn_tiVx5ug",
			name: "포기하지마",
			url: BU + "UCXGTwL06yRZLjNn_tiVx5ug",
			flag: "Y",
			ord: 46,
			sub: 3720
		  }, {
			id: "UCBKugWHJLt-b9QCV01XA3sg",
			name: "노년생활",
			url: BU + "UCBKugWHJLt-b9QCV01XA3sg",
			flag: "Y",
			ord: 47,
			sub: 11100
		  }, {
			id: "UCl6OqGKkmEEONlSjYD_hynQ",
			name: "구름같은사연",
			url: BU + "UCl6OqGKkmEEONlSjYD_hynQ",
			flag: "Y",
			ord: 48,
			sub: 14000
		  }, {
			id: "UCRTT55661mbChMNq1XAyJoA",
			name: "달달한인생여행",
			url: BU + "UCRTT55661mbChMNq1XAyJoA",
			flag: "Y",
			ord: 49,
			sub: 135000
		  }, {
			id: "UCNiF2AnoWdCptQbCFdqBuJw",
			name: "인생감동",
			url: BU + "UCNiF2AnoWdCptQbCFdqBuJw",
			flag: "Y",
			ord: 50,
			sub: 35400
		  }, {
			id: "UCitqF98OhVgH813fXaNv6sQ",
			name: "감동은선물",
			url: BU + "UCitqF98OhVgH813fXaNv6sQ",
			flag: "Y",
			ord: 51,
			sub: 1710
		  }, {
			id: "UCWWlhM1vgxcoRBDolu7GIAw",
			name: "사연서점",
			url: BU + "UCWWlhM1vgxcoRBDolu7GIAw",
			flag: "Y",
			ord: 52,
			sub: 88000
		  }, {
			id: "UCaMDndB5LgqRFvIigy0a2Aw",
			name: "인생교훈지혜",
			url: BU + "UCaMDndB5LgqRFvIigy0a2Aw",
			flag: "Y",
			ord: 53,
			sub: 141000
		  }, {
			id: "UCIUwPzbbypAXQ81Y_M6wyLA",
			name: "이야기아랫목",
			url: BU + "UCIUwPzbbypAXQ81Y_M6wyLA",
			flag: "Y",
			ord: 54,
			sub: 9730
		  }, {
			id: "UCApT86tUJBVMNO52iVWUJ6w",
			name: "삶의교훈등불",
			url: BU + "UCApT86tUJBVMNO52iVWUJ6w",
			flag: "Y",
			ord: 55,
			sub: 38500
		  }, {
			id: "UCQXFk2Rxo83zVgJiRwDVOcg",
			name: "감정이야기",
			url: BU + "UCQXFk2Rxo83zVgJiRwDVOcg",
			flag: "Y",
			ord: 56,
			sub: 20400
		  }, {
			id: "UCkbFDChEAGahpXuIEFtx_BA",
			name: "드라마인생사연",
			url: BU + "UCkbFDChEAGahpXuIEFtx_BA",
			flag: "Y",
			ord: 57,
			sub: 4470
		  }, {
			id: "UCAADkg4ye9oAMjxgmGEKk_w",
			name: "세월의온기",
			url: BU + "UCAADkg4ye9oAMjxgmGEKk_w",
			flag: "Y",
			ord: 58,
			sub: 21300
		  }, {
			id: "UC_nzYc1jF9CHHyaFKnL2tRA",
			name: "인생세상",
			url: BU + "UC_nzYc1jF9CHHyaFKnL2tRA",
			flag: "Y",
			ord: 59,
			sub: 120000
		  }, {
			id: "UCZwB8Va7XSRKlcy8ralTaVQ",
			name: "어머니의정원",
			url: BU + "UCZwB8Va7XSRKlcy8ralTaVQ",
			flag: "Y",
			ord: 60,
			sub: 92300
		  }, {
			id: "UCmZkEggG98yxOL4iEvwj7Mg",
			name: "사연보름달",
			url: BU + "UCmZkEggG98yxOL4iEvwj7Mg",
			flag: "Y",
			ord: 61,
			sub: 50400
		  }, {
			id: "UCTWQLX_se9Go8SJFGQ0xNKQ",
			name: "지혜백서",
			url: BU + "UCTWQLX_se9Go8SJFGQ0xNKQ",
			flag: "Y",
			ord: 62,
			sub: 158000
		  }, {
			id: "UCl1JOZvMCD9WaC5odFMXQYw",
			name: "인생마당",
			url: BU + "UCl1JOZvMCD9WaC5odFMXQYw",
			flag: "Y",
			ord: 63,
			sub: 128000
		  }, {
			id: "UCtTsF5hammtb8WYDW2VHpIA",
			name: "인생의이야기",
			url: BU + "UCtTsF5hammtb8WYDW2VHpIA",
			flag: "Y",
			ord: 64,
			sub: 89100
		  }, {
			id: "UC0YiWzRCN3AAb7a0nrgYseQ",
			name: "달빛인생사연",
			url: BU + "UC0YiWzRCN3AAb7a0nrgYseQ",
			flag: "Y",
			ord: 65,
			sub: 53400
		  }, {
			id: "UCGNAYwkJkeqvfmOv0o-uY3g",
			name: "감동정거장",
			url: BU + "UCGNAYwkJkeqvfmOv0o-uY3g",
			flag: "Y",
			ord: 66,
			sub: 40200
		  }, {
			id: "UC6SZ7KSlPrecXoEPflZGEnA",
			name: "인생지혜길",
			url: BU + "UC6SZ7KSlPrecXoEPflZGEnA",
			flag: "Y",
			ord: 67,
			sub: 54200
		  }, {
			id: "UCKCN9FEc3M225mFPlGiOteQ",
			name: "인생풍경",
			url: BU + "UCKCN9FEc3M225mFPlGiOteQ",
			flag: "Y",
			ord: 68,
			sub: 133000
		  }, {
			id: "UCj7PybOOLhgx7fqmOmrMJkA",
			name: "추억찻집",
			url: BU + "UCj7PybOOLhgx7fqmOmrMJkA",
			flag: "Y",
			ord: 69,
			sub: 13100
		  }, {
			id: "UC3E-gJGVeJkevN2ujtrLHkA",
			name: "감동수다",
			url: BU + "UC3E-gJGVeJkevN2ujtrLHkA",
			flag: "Y",
			ord: 70,
			sub: 14000
		  }, {
			id: "UCQHrg5u6SEUNY-50Q7cDcOw",
			name: "현자의빛",
			url: BU + "UCQHrg5u6SEUNY-50Q7cDcOw",
			flag: "Y",
			ord: 71,
			sub: 146000
		  }, {
			id: "UCL8PczL6V3e82HazJoaAKUg",
			name: "햇빛사연",
			url: BU + "UCL8PczL6V3e82HazJoaAKUg",
			flag: "Y",
			ord: 72,
			sub: 21300
		  }, {
			id: "UCYiSJFAzdIXJBknGpnkNDOQ",
			name: "생각모음",
			url: BU + "UCYiSJFAzdIXJBknGpnkNDOQ",
			flag: "Y",
			ord: 73,
			sub: 18600
		  }, {
			id: "UC56g-Q3t7GjcYtrUGbqYNZw",
			name: "이야기꾼",
			url: BU + "UC56g-Q3t7GjcYtrUGbqYNZw",
			flag: "Y",
			ord: 74,
			sub: 24200
		  }, {
			id: "UCXemnCQk4I4gZpQW59_zoOQ",
			name: "인생의필름",
			url: BU + "UCXemnCQk4I4gZpQW59_zoOQ",
			flag: "Y",
			ord: 75,
			sub: 12000
		  }, {
			id: "UCqSaGOxZ_fbEoA6gO04I1EA",
			name: "그시절책갈피",
			url: BU + "UCqSaGOxZ_fbEoA6gO04I1EA",
			flag: "Y",
			ord: 76,
			sub: 7230
		  }, {
			id: "UCDeTGxoUrj_-fqnBU9ctJig",
			name: "인생지혜말씀",
			url: BU + "UCDeTGxoUrj_-fqnBU9ctJig",
			flag: "Y",
			ord: 77,
			sub: 18800
		  }, {
			id: "UCGOWtFBBQa5Z4TVlqY-8agw",
			name: "감동만족",
			url: BU + "UCGOWtFBBQa5Z4TVlqY-8agw",
			flag: "Y",
			ord: 78,
			sub: 7690
		  }, {
			id: "UCO1-4foSzj6kfbrNa3KeajQ",
			name: "밤의사연",
			url: BU + "UCO1-4foSzj6kfbrNa3KeajQ",
			flag: "Y",
			ord: 79,
			sub: 39700
		  }, {
			id: "UCZnxPsj0PssE8ysBtpxqVrg",
			name: "반전의순간",
			url: BU + "UCZnxPsj0PssE8ysBtpxqVrg",
			flag: "Y",
			ord: 80,
			sub: 11200
		  }, {
			id: "UCrqx0Z_eUsvf1M9r1s98d9g",
			name: "인생드라마주식회사",
			url: BU + "UCrqx0Z_eUsvf1M9r1s98d9g",
			flag: "Y",
			ord: 81,
			sub: 3910
		  }, {
			id: "UC7AAByethNqAYxWdUzpGYKQ",
			name: "인생두글자",
			url: BU + "UC7AAByethNqAYxWdUzpGYKQ",
			flag: "Y",
			ord: 82,
			sub: 26700
		  }, {
			id: "UCKfJgcK0GO3_QRrFBnIU6Cw",
			name: "노후의벗",
			url: BU + "UCKfJgcK0GO3_QRrFBnIU6Cw",
			flag: "Y",
			ord: 83,
			sub: 22600
		  }, {
			id: "UCCS0E_UoX_MmN3Wu3k9z2ag",
			name: "우리의인생은봄날",
			url: BU + "UCCS0E_UoX_MmN3Wu3k9z2ag",
			flag: "Y",
			ord: 84,
			sub: 9570
		  }, {
			id: "UCfOh6emG2Ke9IfN1z-WFsQg",
			name: "뒷집사연",
			url: BU + "UCfOh6emG2Ke9IfN1z-WFsQg",
			flag: "Y",
			ord: 85,
			sub: 48300
		  }, {
			id: "UCeVCvsxQqUI7WGz-CXahjGA",
			name: "천년만년인생",
			url: BU + "UCeVCvsxQqUI7WGz-CXahjGA",
			flag: "Y",
			ord: 86,
			sub: 12600
		  }, {
			id: "UCQNuZVeRLIIymAfCFLZOVwA",
			name: "세월이야속해",
			url: BU + "UCQNuZVeRLIIymAfCFLZOVwA",
			flag: "Y",
			ord: 87,
			sub: 38100
		  }, {
			id: "UC7WL420V87oPi6b580vgDJQ",
			name: "은빛이야기다방",
			url: BU + "UC7WL420V87oPi6b580vgDJQ",
			flag: "Y",
			ord: 88,
			sub: 576
		  }, {
			id: "UCN9eb0JUyAKFL7bUou_ZZLQ",
			name: "삶의여정",
			url: BU + "UCN9eb0JUyAKFL7bUou_ZZLQ",
			flag: "Y",
			ord: 89,
			sub: 44000
		  }, {
			id: "UCgw1JIxlFp1uFbp93d9LIWw",
			name: "사연쌀롱",
			url: BU + "UCgw1JIxlFp1uFbp93d9LIWw",
			flag: "Y",
			ord: 90,
			sub: 349000
		  }, {
			id: "UCg1lK3oQwAUCRvXSqvvwwUw",
			name: "꽃보다내인생",
			url: BU + "UCg1lK3oQwAUCRvXSqvvwwUw",
			flag: "Y",
			ord: 91,
			sub: 6520
		  }, {
			id: "UCVE2CnAhq2k2w9Tzey2Bqcw",
			name: "구름같은이야기",
			url: BU + "UCVE2CnAhq2k2w9Tzey2Bqcw",
			flag: "Y",
			ord: 92,
			sub: 142000
		  }, {
			id: "UCisJX40-aHLeQAKvgOkva7g",
			name: "오늘도사이다",
			url: BU + "UCisJX40-aHLeQAKvgOkva7g",
			flag: "Y",
			ord: 93,
			sub: 6320
		  }, {
			id: "UCVusNTjDbwyo9UwviW-CHEA",
			name: "쿵따리인생사연",
			url: BU + "UCVusNTjDbwyo9UwviW-CHEA",
			flag: "Y",
			ord: 94,
			sub: 12900
		  }, {
			id: "UCP4DU-Jz5kqB4c5tgpPKYzg",
			name: "인생한스푼사연한줌",
			url: BU + "UCP4DU-Jz5kqB4c5tgpPKYzg",
			flag: "Y",
			ord: 95,
			sub: 21800
		  }, {
			id: "UCmivQaFhTIry7sgBg6efzcQ",
			name: "노을사연",
			url: BU + "UCmivQaFhTIry7sgBg6efzcQ",
			flag: "Y",
			ord: 96,
			sub: 16000
		  }, {
			id: "UCjMupHmI6SMn6H0pwEfC7ew",
			name: "벼락사연",
			url: BU + "UCjMupHmI6SMn6H0pwEfC7ew",
			flag: "Y",
			ord: 97,
			sub: 3260
		  }, {
			id: "UCBEt3Wa4XPBuSHdehxCOKWw",
			name: "생생인생극장",
			url: BU + "UCBEt3Wa4XPBuSHdehxCOKWw",
			flag: "Y",
			ord: 98,
			sub: 28400
		  }, {
			id: "UCEgpJ18XQyaaow4VyGWBESA",
			name: "숨겨진사연",
			url: BU + "UCEgpJ18XQyaaow4VyGWBESA",
			flag: "Y",
			ord: 99,
			sub: 20100
		  }, {
			id: "UCOHL9SQpsqSBl0G7eqN6iJw",
			name: "목소리로듣는인생",
			url: BU + "UCOHL9SQpsqSBl0G7eqN6iJw",
			flag: "Y",
			ord: 100,
			sub: 1990
		  }
	  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'));

	vm.channelMaster.array.forEach((item, index) => {
	  item.ord = index + 1;
	  if (item.ord >= 1 && item.ord <= 98) {
		  item.flag = "Y";
	  } else if (item.ord > 98) {
		  item.flag = "N";		
	  }
	}); 
		
	vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
			return target.flag === "Y";
		  }).length;
	  	  
      vm.data.hide = "접기";
      vm.data.totalCount = 0;
	  
	  vm.data.longTableDesc = '리스트 펼치기';
	  vm.data.channelAllFlag = 'N';
		
		  vm.data.pageTokenPage = 1;
	    vm.data.recentUse = 'Y';
		
		vm.data.set = "set1";
		vm.data.order = "abc";

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

		this.clickHome = () => {
			location.reload(); 
		}

      this.search = async () => {

			  vm.failedFlag = 'N';
	
			  vm.apiClient = axios.create({
				baseURL: vm.data.bu,
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

					if (vm.channelMaster.okTotalCount > 98) {
						alert("검색할 채널은 최대 98개까지 가능합니다.");
						return;
					}
		
					if (vm.params.maxSearchCountByChannel === undefined || vm.params.maxSearchCountByChannel === null || vm.params.maxSearchCountByChannel === "" || 
					vm.params.maxSearchCountByChannel < 1 || vm.params.maxSearchCountByChannel > 50) {
					alert("1 ~ 50 사이의 값을 입력해주세요. [채널당 최대 검색 수]");
					return;
				}

						
			  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
								
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
						
						let items = await vm.doSearchChannelMode(channelId);
		
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
		
					this.showLoader(); 
		
					let items = await vm.doSearchKeywordMode();
		
					if (vm.failedFlag === 'Y') {
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
					
			  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
					  
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
						  
					  }
			}
      }

      vm.doSearchKeywordMode = async () => {
			return await UtilsService.doSearchKeywordMode(vm);  
      };	  

      vm.doSearchKeywordModeToken = async () => {
			return await UtilsService.doSearchKeywordModeToken(vm); 
      };
	  
	  vm.doSearchChannelMode = async (arguChannelId) => {
			return await UtilsService.doSearchChannelMode(arguChannelId, vm);   
      };
	  
	  vm.doSearchBothMode = async (arguChannelId) => {
			return await UtilsService.doSearchBothMode(arguChannelId, vm);        
      }; 

      vm.doSearchVideos = async (videoIds) => {
			return await UtilsService.doSearchVideos(videoIds, vm);
      };
		
      vm.doSearchChannels = async (channelIds) => {
			return await UtilsService.doSearchChannels(channelIds, vm);
      };

      vm.reset = () => {		  
			UtilsService.reset(vm);
      };

	  vm.makeObj = (obj, itm) => {
		    return UtilsService.makeObj(obj, itm);
	  };

		vm.changeExcuteMode = () => {
			UtilsService.changeExcuteMode(vm);
      };
	  
	  vm.changeStartDate = () => {
			UtilsService.changeStartDate();
	  };

      vm.changeShortsLong = () => {
			UtilsService.changeShortsLong(vm);
      };

      vm.changeChannelSet = () => {
			UtilsService.changeChannelSet(vm);
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

      vm.hide = () => {
        UtilsService.hide(vm);
      };

		vm.clickGridCheckbox = () => {
			UtilsService.clickGridCheckbox(vm);
		};
		
		vm.longTable = () => {	
			UtilsService.longTable(vm);
		};
		
		vm.clickGridCheckboxAll = () => {
			UtilsService.clickGridCheckboxAll(vm);				
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











