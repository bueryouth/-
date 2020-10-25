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
//二维表
function scheduleHtmlParser(html) {
    var $ = cheerio.load(html, {
        decodeEntities: false
    });
    let result = []
    let index = 10; //初始化第一个数据为位置
    const info = $(html).find('tbody').html().split(/<\/td>/);
    // console.log($(html).find('tbody').html().split(/<\/td>/)); //test
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
