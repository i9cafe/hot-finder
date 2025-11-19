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
      vm.data.apiKey = "AIzaSyCg2tnEwBThaOS6-sdEzz--8skbl_C3Gps";

	  let apiClient = axios.create({
	        baseURL: "https://youtube.googleapis.com/youtube/v3",
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
			comment: "1"
		  }, {
			id: "UCrW6eDWbbdmxr-XfOkvQKwQ",
			name: "사연튜브 • 사연라디오",
			url: BU + "UCrW6eDWbbdmxr-XfOkvQKwQ",
			flag: "Y",
			comment: "2"
		  }, {
			id: "UC8XIOLMm8kpoaEzjovaoesw",
			name: "금빛이야기",
			url: BU + "UC8XIOLMm8kpoaEzjovaoesw",
			flag: "Y",
			comment: "3"
		  }, {
			id: "UCepniAEbQ3T75M2OuInzIOw",
			name: "소리로읽는세상",
			url: BU + "UCepniAEbQ3T75M2OuInzIOw",
			flag: "Y",
			comment: "4"
		  }, {
			id: "UCjgM7Q280TRWOHmDT6Nr34A",
			name: "탑골사연공원",
			url: BU + "UCjgM7Q280TRWOHmDT6Nr34A",
			flag: "Y",
			comment: "5"
		  }, {
			id: "UCzmHMfc84ebwfkRQV5ufAKw",
			name: "황혼사연",
			url: BU + "UCzmHMfc84ebwfkRQV5ufAKw",
			flag: "Y",
			comment: "6"
		  }, {
			id: "UCT2S9OFvyF4rMZZQeNcIu3Q",
			name: "인생사연",
			url: BU + "UCT2S9OFvyF4rMZZQeNcIu3Q",
			flag: "Y",
			comment: "7"
		  }, {
			id: "UCko5Mjg45-Kz8P2mq_2FFsg",
			name: "풀빛사연",
			url: BU + "UCko5Mjg45-Kz8P2mq_2FFsg",
			flag: "Y",
			comment: "8"
		  }, {
			id: "UCZmDNNxAYodRPudlI0si0XA",
			name: "매일사연",
			url: BU + "UCZmDNNxAYodRPudlI0si0XA",
			flag: "Y",
			comment: "9"
		  }, {
			id: "UCnDG7vNvXXpYxtv8ao5oWlw",
			name: "인생정자",
			url: BU + "UCnDG7vNvXXpYxtv8ao5oWlw",
			flag: "Y",
			comment: "10"
		  }, {
			id: "UC5Fznx6E3uzShi7n_kIEFRA",
			name: "사연만사",
			url: BU + "UC5Fznx6E3uzShi7n_kIEFRA",
			flag: "Y",
			comment: "11"
		  }, {
			id: "UCXVtesz30jjhcUQZAlhOUqw",
			name: "은하수별동네",
			url: BU + "UCXVtesz30jjhcUQZAlhOUqw",
			flag: "Y",
			comment: "12"
		  }, {
			id: "UCm9niqYY_OzexSD4zLvNBeQ",
			name: "운명같은이야기",
			url: BU + "UCm9niqYY_OzexSD4zLvNBeQ",
			flag: "Y",
			comment: "13"
		  }, {
			id: "UCHq8jnJywM22kIwjo8RgCIg",
			name: "세상만사요지경속이다",
			url: BU + "UCHq8jnJywM22kIwjo8RgCIg",
			flag: "Y",
			comment: "14"
		  }, {
			id: "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			name: "스페셜튜브",
			url: BU + "UCRJK3vc6sLqwTUkAZt7_Z6Q",
			flag: "Y",
			comment: "15"
		  }, {
			id: "UC6jMDfjyquRk30OSoe1xjJQ",
			name: "마음의등대",
			url: BU + "UC6jMDfjyquRk30OSoe1xjJQ",
			flag: "Y",
			comment: "16"
		  }, {
			id: "UC-MGBGZzfLLfmDiZP73f6ZQ",
			name: "노후의아름다운이야기",
			url: BU + "UC-MGBGZzfLLfmDiZP73f6ZQ",
			flag: "Y",
			comment: "17"
		  }, {
			id: "UClmsF6cF0oSTBlR9pfG0MZw",
			name: "은빛다방",
			url: BU + "UClmsF6cF0oSTBlR9pfG0MZw",
			flag: "Y",
			comment: "18"
		  }, {
			id: "UCNuGU6mCxH-qXcfH7gjMlmA",
			name: "각설탕회관",
			url: BU + "UCNuGU6mCxH-qXcfH7gjMlmA",
			flag: "Y",
			comment: "19"
		  }, {
			id: "UCOLQ6s0kRWGurtiZkn7lpsA",
			name: "늘푸른인생",
			url: BU + "UCOLQ6s0kRWGurtiZkn7lpsA",
			flag: "Y",
			comment: "20"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "21"
		  }, {
			id: "UC-jw_--Ma-gr9N0WvD3A9Ow",
			name: "인생은육십부터",
			url: BU + "UC-jw_--Ma-gr9N0WvD3A9Ow",
			flag: "Y",
			comment: "22"
		  }, {
			id: "UCP51IWwyjeKnf6Xk9rvYLkg",
			name: "사연의빛",
			url: BU + "UCP51IWwyjeKnf6Xk9rvYLkg",
			flag: "Y",
			comment: "23"
		  }, {
			id: "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			name: "눈내린소나무같은인생사연",
			url: BU + "UCbs5S2Jmrrrk6u_pGJ1EsDg",
			flag: "Y",
			comment: "24"
		  }, {
			id: "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			name: "세월의지혜",
			url: BU + "UCwUcHg9hRa-5rjJ7vv8rJzQ",
			flag: "Y",
			comment: "25"
		  }, {
			id: "UCrtZDHeWyWmc_PXYh_bPQog",
			name: "감사월드",
			url: BU + "UCrtZDHeWyWmc_PXYh_bPQog",
			flag: "Y",
			comment: "26"
		  }, {
			id: "UCJaX4fqnQGoq1oPbpv6pGmg",
			name: "하늘빛마음",
			url: BU + "UCJaX4fqnQGoq1oPbpv6pGmg",
			flag: "Y",
			comment: "27"
		  }, {
			id: "UC1GyaYKcLa2lU5JBFCDP4VQ",
			name: "어둠속의빛",
			url: BU + "UC1GyaYKcLa2lU5JBFCDP4VQ",
			flag: "Y",
			comment: "28"
		  }, {
			id: "UCXwBhLpVZQOfBid9_h-FMrA",
			name: "톡톡사연",
			url: BU + "UCXwBhLpVZQOfBid9_h-FMrA",
			flag: "Y",
			comment: "29"
		  }, {
			id: "UCrRBSlHTvHGOd6hyF3DLPPw",
			name: "랄라하의사연드라마",
			url: BU + "UCrRBSlHTvHGOd6hyF3DLPPw",
			flag: "Y",
			comment: "30"
		  }, {
			id: "UCMIPYHFP0Y6rMR9pMCfw22Q",
			name: "추억의향기",
			url: BU + "UCMIPYHFP0Y6rMR9pMCfw22Q",
			flag: "Y",
			comment: "31"
		  }, {
			id: "UCV42dR87lzxj1rW_PKBzOFg",
			name: "백만사연",
			url: BU + "UCV42dR87lzxj1rW_PKBzOFg",
			flag: "Y",
			comment: "32"
		  }, {
			id: "UCVE2CnAhq2k2w9Tzey2Bqcw",
			name: "구름같은이야기",
			url: BU + "UCVE2CnAhq2k2w9Tzey2Bqcw",
			flag: "Y",
			comment: "33"
		  }, {
			id: "UCXKjRRSHojm4fahC0j1LIuQ",
			name: "인생따라바람따라",
			url: BU + "UCXKjRRSHojm4fahC0j1LIuQ",
			flag: "Y",
			comment: "34"
		  }, {
			id: "UCtHooblia6W73O16zN7jxfw",
			name: "인생나날",
			url: BU + "UCtHooblia6W73O16zN7jxfw",
			flag: "Y",
			comment: "35"
		  }, {
			id: "UCfil2r_kgxcFiU8sO0q-Grg",
			name: "밤의이야기",
			url: BU + "UCfil2r_kgxcFiU8sO0q-Grg",
			flag: "Y",
			comment: "36"
		  }, {
			id: "UCeC22b4HaVTyha58HrMjIsA",
			name: "노을빛인생",
			url: BU + "UCeC22b4HaVTyha58HrMjIsA",
			flag: "Y",
			comment: "37"
		  }, {
			id: "UCWL95jlSaNHx2XQHjd4sOeA",
			name: "감동이야기",
			url: BU + "UCWL95jlSaNHx2XQHjd4sOeA",
			flag: "Y",
			comment: "38"
		  }, {
			id: "UCYEZFZKSR66PyYPY92SKRng",
			name: "고부관계",
			url: BU + "UCYEZFZKSR66PyYPY92SKRng",
			flag: "Y",
			comment: "39"
		  }, {
			id: "UCqId-7lAPFeuzqMqzQm_osA",
			name: "마음이야기",
			url: BU + "UCqId-7lAPFeuzqMqzQm_osA",
			flag: "Y",
			comment: "40"
		  }, {
			id: "UCS2CpRATJ495FCZe7RP_yHg",
			name: "밤의인생",
			url: BU + "UCS2CpRATJ495FCZe7RP_yHg",
			flag: "Y",
			comment: "41"
		  }, {
			id: "UC0miLal8tz9efrRfpfElpGw",
			name: "보라빛인생사연",
			url: BU + "UC0miLal8tz9efrRfpfElpGw",
			flag: "Y",
			comment: "42"
		  }, {
			id: "UCCcouVtd0bGzsn9mM1EeBNw",
			name: "감동쓰나미",
			url: BU + "UCCcouVtd0bGzsn9mM1EeBNw",
			flag: "Y",
			comment: "43"
		  }, {
			id: "UCj82PP56tg53pCQWWXm9Vxg",
			name: "이야기술술",
			url: BU + "UCj82PP56tg53pCQWWXm9Vxg",
			flag: "Y",
			comment: "44"
		  }, {
			id: "UC9AHX1dC3Xofj67Kfm4ZHFg",
			name: "삶의감동",
			url: BU + "UC9AHX1dC3Xofj67Kfm4ZHFg",
			flag: "Y",
			comment: "45"
		  }, {
			id: "UCXGTwL06yRZLjNn_tiVx5ug",
			name: "포기하지마",
			url: BU + "UCXGTwL06yRZLjNn_tiVx5ug",
			flag: "Y",
			comment: "46"
		  }, {
			id: "UCBKugWHJLt-b9QCV01XA3sg",
			name: "노년생활",
			url: BU + "UCBKugWHJLt-b9QCV01XA3sg",
			flag: "Y",
			comment: "47"
		  }, {
			id: "UCl6OqGKkmEEONlSjYD_hynQ",
			name: "구름같은사연",
			url: BU + "UCl6OqGKkmEEONlSjYD_hynQ",
			flag: "Y",
			comment: "48"
		  }, {
			id: "UCRTT55661mbChMNq1XAyJoA",
			name: "달달한인생여행",
			url: BU + "UCRTT55661mbChMNq1XAyJoA",
			flag: "Y",
			comment: "49"
		  }, {
			id: "UCNiF2AnoWdCptQbCFdqBuJw",
			name: "인생감동",
			url: BU + "UCNiF2AnoWdCptQbCFdqBuJw",
			flag: "Y",
			comment: "50"
		  }, {
			id: "UCitqF98OhVgH813fXaNv6sQ",
			name: "감동은선물",
			url: BU + "UCitqF98OhVgH813fXaNv6sQ",
			flag: "Y",
			comment: "51"
		  }, {
			id: "UCWWlhM1vgxcoRBDolu7GIAw",
			name: "사연서점",
			url: BU + "UCWWlhM1vgxcoRBDolu7GIAw",
			flag: "Y",
			comment: "52"
		  }, {
			id: "UCaMDndB5LgqRFvIigy0a2Aw",
			name: "인생교훈지혜",
			url: BU + "UCaMDndB5LgqRFvIigy0a2Aw",
			flag: "Y",
			comment: "53"
		  }, {
			id: "UCIUwPzbbypAXQ81Y_M6wyLA",
			name: "이야기아랫목",
			url: BU + "UCIUwPzbbypAXQ81Y_M6wyLA",
			flag: "Y",
			comment: "54"
		  }, {
			id: "UCApT86tUJBVMNO52iVWUJ6w",
			name: "삶의교훈등불",
			url: BU + "UCApT86tUJBVMNO52iVWUJ6w",
			flag: "Y",
			comment: "55"
		  }, {
			id: "UCQXFk2Rxo83zVgJiRwDVOcg",
			name: "감정이야기",
			url: BU + "UCQXFk2Rxo83zVgJiRwDVOcg",
			flag: "Y",
			comment: "56"
		  }, {
			id: "UCkbFDChEAGahpXuIEFtx_BA",
			name: "드라마인생사연",
			url: BU + "UCkbFDChEAGahpXuIEFtx_BA",
			flag: "Y",
			comment: "57"
		  }, {
			id: "UCAADkg4ye9oAMjxgmGEKk_w",
			name: "세월의온기",
			url: BU + "UCAADkg4ye9oAMjxgmGEKk_w",
			flag: "Y",
			comment: "58"
		  }, {
			id: "UC_nzYc1jF9CHHyaFKnL2tRA",
			name: "인생세상",
			url: BU + "UC_nzYc1jF9CHHyaFKnL2tRA",
			flag: "Y",
			comment: "59"
		  }, {
			id: "UCZwB8Va7XSRKlcy8ralTaVQ",
			name: "어머니의정원",
			url: BU + "UCZwB8Va7XSRKlcy8ralTaVQ",
			flag: "Y",
			comment: "60"
		  }, {
			id: "UCmZkEggG98yxOL4iEvwj7Mg",
			name: "사연보름달",
			url: BU + "UCmZkEggG98yxOL4iEvwj7Mg",
			flag: "Y",
			comment: "61"
		  }, {
			id: "UCTWQLX_se9Go8SJFGQ0xNKQ",
			name: "지혜백서",
			url: BU + "UCTWQLX_se9Go8SJFGQ0xNKQ",
			flag: "Y",
			comment: "62"
		  }, {
			id: "UCl1JOZvMCD9WaC5odFMXQYw",
			name: "인생마당",
			url: BU + "UCl1JOZvMCD9WaC5odFMXQYw",
			flag: "Y",
			comment: "63"
		  }, {
			id: "UCtTsF5hammtb8WYDW2VHpIA",
			name: "인생의이야기",
			url: BU + "UCtTsF5hammtb8WYDW2VHpIA",
			flag: "Y",
			comment: "64"
		  }, {
			id: "UC0YiWzRCN3AAb7a0nrgYseQ",
			name: "달빛인생사연",
			url: BU + "UC0YiWzRCN3AAb7a0nrgYseQ",
			flag: "Y",
			comment: "65"
		  }, {
			id: "UCGNAYwkJkeqvfmOv0o-uY3g",
			name: "감동정거장",
			url: BU + "UCGNAYwkJkeqvfmOv0o-uY3g",
			flag: "Y",
			comment: "66"
		  }, {
			id: "UC6SZ7KSlPrecXoEPflZGEnA",
			name: "인생지혜길",
			url: BU + "UC6SZ7KSlPrecXoEPflZGEnA",
			flag: "Y",
			comment: "67"
		  }, {
			id: "UCKCN9FEc3M225mFPlGiOteQ",
			name: "인생풍경",
			url: BU + "UCKCN9FEc3M225mFPlGiOteQ",
			flag: "Y",
			comment: "68"
		  }, {
			id: "UCj7PybOOLhgx7fqmOmrMJkA",
			name: "추억찻집",
			url: BU + "UCj7PybOOLhgx7fqmOmrMJkA",
			flag: "Y",
			comment: "69"
		  }, {
			id: "UC3E-gJGVeJkevN2ujtrLHkA",
			name: "감동수다",
			url: BU + "UC3E-gJGVeJkevN2ujtrLHkA",
			flag: "Y",
			comment: "70"
		  }, {
			id: "UCQHrg5u6SEUNY-50Q7cDcOw",
			name: "현자의빛",
			url: BU + "UCQHrg5u6SEUNY-50Q7cDcOw",
			flag: "Y",
			comment: "71"
		  }, {
			id: "UCL8PczL6V3e82HazJoaAKUg",
			name: "햇빛사연",
			url: BU + "UCL8PczL6V3e82HazJoaAKUg",
			flag: "Y",
			comment: "72"
		  }, {
			id: "UCYiSJFAzdIXJBknGpnkNDOQ",
			name: "생각모음",
			url: BU + "UCYiSJFAzdIXJBknGpnkNDOQ",
			flag: "Y",
			comment: "73"
		  }, {
			id: "UC56g-Q3t7GjcYtrUGbqYNZw",
			name: "이야기꾼",
			url: BU + "UC56g-Q3t7GjcYtrUGbqYNZw",
			flag: "Y",
			comment: "74"
		  }, {
			id: "UCXemnCQk4I4gZpQW59_zoOQ",
			name: "인생의필름",
			url: BU + "UCXemnCQk4I4gZpQW59_zoOQ",
			flag: "Y",
			comment: "75"
		  }, {
			id: "UCqSaGOxZ_fbEoA6gO04I1EA",
			name: "그시절책갈피",
			url: BU + "UCqSaGOxZ_fbEoA6gO04I1EA",
			flag: "Y",
			comment: "76"
		  }, {
			id: "UCDeTGxoUrj_-fqnBU9ctJig",
			name: "인생지혜말씀",
			url: BU + "UCDeTGxoUrj_-fqnBU9ctJig",
			flag: "Y",
			comment: "77"
		  }, {
			id: "UCGOWtFBBQa5Z4TVlqY-8agw",
			name: "감동만족",
			url: BU + "UCGOWtFBBQa5Z4TVlqY-8agw",
			flag: "Y",
			comment: "78"
		  }, {
			id: "UCO1-4foSzj6kfbrNa3KeajQ",
			name: "밤의사연",
			url: BU + "UCO1-4foSzj6kfbrNa3KeajQ",
			flag: "Y",
			comment: "79"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "80"
		  }, {
			id: "UCrqx0Z_eUsvf1M9r1s98d9g",
			name: "인생드라마주식회사",
			url: BU + "UCrqx0Z_eUsvf1M9r1s98d9g",
			flag: "N",
			comment: "81"
		  }, {
			id: "UC7AAByethNqAYxWdUzpGYKQ",
			name: "인생두글자",
			url: BU + "UC7AAByethNqAYxWdUzpGYKQ",
			flag: "N",
			comment: "82"
		  }, {
			id: "UCKfJgcK0GO3_QRrFBnIU6Cw",
			name: "노후의벗",
			url: BU + "UCKfJgcK0GO3_QRrFBnIU6Cw",
			flag: "N",
			comment: "83"
		  }, {
			id: "UCCS0E_UoX_MmN3Wu3k9z2ag",
			name: "우리의인생은봄날",
			url: BU + "UCCS0E_UoX_MmN3Wu3k9z2ag",
			flag: "N",
			comment: "84"
		  }, {
			id: "UCfOh6emG2Ke9IfN1z-WFsQg",
			name: "뒷집사연",
			url: BU + "UCfOh6emG2Ke9IfN1z-WFsQg",
			flag: "N",
			comment: "85"
		  }, {
			id: "UCeVCvsxQqUI7WGz-CXahjGA",
			name: "천년만년인생",
			url: BU + "UCeVCvsxQqUI7WGz-CXahjGA",
			flag: "N",
			comment: "86"
		  }, {
			id: "UCQNuZVeRLIIymAfCFLZOVwA",
			name: "세월이야속해",
			url: BU + "UCQNuZVeRLIIymAfCFLZOVwA",
			flag: "N",
			comment: "87"
		  }, {
			id: "UC7WL420V87oPi6b580vgDJQ",
			name: "은빛이야기다방",
			url: BU + "UC7WL420V87oPi6b580vgDJQ",
			flag: "N",
			comment: "88"
		  }, {
			id: "UCN9eb0JUyAKFL7bUou_ZZLQ",
			name: "삶의여정",
			url: BU + "UCN9eb0JUyAKFL7bUou_ZZLQ",
			flag: "N",
			comment: "89"
		  }, {
			id: "UCgw1JIxlFp1uFbp93d9LIWw",
			name: "사연쌀롱",
			url: BU + "UCgw1JIxlFp1uFbp93d9LIWw",
			flag: "N",
			comment: "90"
		  }, {
			id: "UCg1lK3oQwAUCRvXSqvvwwUw",
			name: "꽃보다내인생",
			url: BU + "UCg1lK3oQwAUCRvXSqvvwwUw",
			flag: "N",
			comment: "91"
		  }, {
			id: "UCVE2CnAhq2k2w9Tzey2Bqcw",
			name: "구름같은이야기",
			url: BU + "UCVE2CnAhq2k2w9Tzey2Bqcw",
			flag: "N",
			comment: "92"
		  }, {
			id: "UCisJX40-aHLeQAKvgOkva7g",
			name: "오늘도사이다",
			url: BU + "UCisJX40-aHLeQAKvgOkva7g",
			flag: "N",
			comment: "93"
		  }, {
			id: "UCVusNTjDbwyo9UwviW-CHEA",
			name: "쿵따리인생사연",
			url: BU + "UCVusNTjDbwyo9UwviW-CHEA",
			flag: "N",
			comment: "94"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "95"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "96"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "97"
		  }, {
			id: "TEST",
			name: "NAME",
			url: BU + "TEST",
			flag: "N",
			comment: "98"
		  }
	  ].sort((a, b) => a.name.localeCompare(b.name, 'ko'));	
		
	vm.channelMaster.okTotalCount = vm.channelMaster.array.filter((target) => {
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

		this.clickHome = () => {
			location.reload(); 
		}

      this.search = async () => {

			  vm.failedFlag = 'N';
	
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
				
		  if (confirm("설정한 검색 조건으로 검색을 진행하시겠습니까?")) {
			  
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
						
						let items = await vm.doSearchChannelMode(channelId, apiClient);
		
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString, apiClient);			  
						  let channelList = await vm.doSearchChannels(channelIdsString, apiClient);
								
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
		
					vm.pageToken = "";
					  
					vm.params.keyword = vm.keyword.includeKey + ' ' + vm.keyword.exceptKey;
		
					this.showLoader(); 
		
					let items = await vm.doSearchKeywordMode(apiClient);
		
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString, apiClient);			  
						  let channelList = await vm.doSearchChannels(channelIdsString, apiClient);
							
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
						
						items = await vm.doSearchKeywordModeToken(apiClient);
		
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString, apiClient);			  
						  let channelList = await vm.doSearchChannels(channelIdsString, apiClient);
								
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
						
						let items = await vm.doSearchBothMode(channelId, apiClient);
		
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
						
						  let videoList = await vm.doSearchVideos(videoIdsString, apiClient);			  
						  let channelList = await vm.doSearchChannels(channelIdsString, apiClient);
								
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
				}

		  } else {
			  
		  }
      }

      vm.doSearchKeywordMode = async (apiClient) => {
			return await UtilsService.doSearchKeywordMode(apiClient, vm);  
      };	  

      vm.doSearchKeywordModeToken = async (apiClient) => {
			return await UtilsService.doSearchKeywordModeToken(apiClient, vm); 
      };
	  
	  vm.doSearchChannelMode = async (arguChannelId, apiClient) => {
			return await UtilsService.doSearchChannelMode(arguChannelId, apiClient, vm);   
      };
	  
	  vm.doSearchBothMode = async (arguChannelId, apiClient) => {
			return await UtilsService.doSearchBothMode(arguChannelId, apiClient, vm);        
      }; 

      vm.doSearchVideos = async (videoIds, apiClient) => {
			return await UtilsService.doSearchVideos(videoIds, apiClient, vm);
      };
		
      vm.doSearchChannels = async (channelIds, apiClient) => {
			return await UtilsService.doSearchChannels(channelIds, apiClient, vm);
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


























