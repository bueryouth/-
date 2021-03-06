function  convert(str) {  //星期几换算   
    var  arr  =   ["一", "二", "三", "四", "五", "六", "七", "八bai", "九", "十"];    
    for  (var  i  =  0;  i  <  arr.length;  i++)  {        
        str  =  str.replace(new  RegExp(arr[i],  "g"),   (i + 1));    
    }    
    return  str;
}

function str2IntList(week) {
    // 将全角逗号替换为半角逗号
    let reg = new RegExp("，", "g");
    week.replace(reg, ',');
    let weeks = [];
    // 以逗号为界分割字符串，遍历分割的字符串
    week.split(",").forEach(w => {
        if (w.search('-') != -1) {
            let range = w.split("-");
            let start = parseInt(range[0]);
            let end = parseInt(range[1]);
            for (let i = start; i <= end; i++) {
                if (!weeks.includes(i)) {
                    weeks.push(i);
                }
            }
        } else if (w.length != 0) {
            let v = parseInt(w);
            if (!weeks.includes(v)) {
                weeks.push(v);
            }
        }
    });
    return weeks;
}

function scheduleHtmlParser(html) {
    var $ = cheerio.load(html, {
        decodeEntities: false
    });
    let result = []
	if($(html).find('thead').text()==""){
		let index = 10; //初始化第一个数据为位置
		const info = $(html).find('tbody').html().split(/<\/td>/);
		while (index < info.length) {
			let count = 1; //初始化周一
			for (count; count <= 14; count++) {
				if(info[index]!=null){
					if (info[index].replace(/[^\u4e00-\u9fa5]/g, '') != "") { //判断是否有课
						let date = info[index].split(/<br>|bolder">|<\/font><br>|<\/div>/); //数据分析
						for (let i = 1; i < date.length; i += 5) {
							const course = {}; //定义课程存储
							course.day = count % 8; //星期几
							course.name = date[i]; //课程名
							course.teacher = date[i + 1]; //教师名
							course.position = date[i  + 3]; //教室名
							if (date[i  + 2] != null) {
								let test = date[i  + 2].split(/ |\[|\]/); //数字分析
								let l = 1;
								if (test.length > 3) { //判断并跳过单双字符
									course.weeks = str2IntList(test[0]) //第几周(适配单双周)
									.filter((week) => {
										if (test[1] != null) {
											if (test[1] === '单' && week % 2 === 1) {
												return true;
											} else if (test[1] === '双' && week % 2 === 0) {
												return true;
											}
											return false;
										}
										return true;
									})
									l += 2;
								} else {
									course.weeks = str2IntList(test[0]); //第几周
								}
								if (test[l] != null) {
									course.sections = str2IntList(test[l]).map((s) => { //第几节
										return {
											section: s
										}
									})
								}
							}
							console.log(course); //显示
							result.push(course); //存入
						}
					}
				}
				index = count == 7 ? index + 2 : index + 1;
				count = count == 7 ? count + 1 : count;
			}
			index += 3;
		}
	}else{
		let index = 11; //初始化第一个数据为位置
		const info = $(html).find('tr').text().split("\n\t\t\t\t\t");
		while (index < info.length) {
			let date = info[index + 7].split(/" "|周|\[|\]|\(|\),|\)/); //数据分析
			for (let j = 0; j < date.length - 1; j += 5) {
				const course = {};
				course.name = info[index].split("]")[1]; //课程名
				course.teacher = info[index + 4].split("]")[1]; //教师名
				if (date[j] != null) {
					if (date[j + 1] == "") { //判断并跳过单双字符
						course.weeks = str2IntList(date[j]) //第几周(适配单双周)
						.filter((week) => {
							if (date[j + 2] != null) {
								if (date[j + 2] === '单' && week % 2 === 1) {
									return true;
								} else if (date[j + 2] === '双' && week % 2 === 0) {
									return true;
								}
								return false;
							}
							return true;
						})
						j += 2;
					} else {
						course.weeks = str2IntList(date[j]); //第几周
					}
				}
				if (date[j + 1] == "") {
					j += 2;
				}
				if (date[j + 3] != null) {
					course.position = date[j + 3].trim(); //教室
				}
				if (date[j + 1] != null) {
					course.day = parseInt(convert(date[j + 1].trim())) //星期几	
				}
				if (date[j + 2] != null) {
					course.sections = str2IntList(date[j + 2]).map((s) => { //第几节
						return {
							section: s
						}
					})
				}
				console.log(course);
				result.push(course);
			}
			index += 13; //    下一堂课
			if (info[index] == '课程') {
				index += 9;
			}
		}
	}
    let sectionTimes = [{
        "section": 1,
        "startTime": "08:30",
        "endTime": "09:15"
    }, {
        "section": 2,
        "startTime": "09:25",
        "endTime": "10:10"
    }, {
        "section": 3,
        "startTime": "10:30",
        "endTime": "11:15"
    }, {
        "section": 4,
        "startTime": "11:25",
        "endTime": "12:10"
    }, {
        "section": 5,
        "startTime": "14:10",
        "endTime": "14:55"
    }, {
        "section": 6,
        "startTime": "15:05",
        "endTime": "15:50"
    }, {
        "section": 7,
        "startTime": "16:00",
        "endTime": "16:45"
    }, {
        "section": 8,
        "startTime": "16:55",
        "endTime": "17:40"
    }, {
        "section": 9,
        "startTime": "18:30",
        "endTime": "19:15"
    }, {
        "section": 10,
        "startTime": "19:25",
        "endTime": "20:10"
    }]
    console.log(sectionTimes)
    return {
        courseInfos: result,
        sectionTimes: sectionTimes
    };
}
