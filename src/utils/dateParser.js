/**
 * 주어진 날짜 및 시간 정보를 파싱하여 다음과 같은 문자열을 반환한다.  
 *   (1) date만 입력된 경우 -> "YYYY년 M월 D일 (요일)"  
 *   (2) startTime, endTime만 입력된 경우 -> "hh:mm ~ hh:mm"  
 *   (3) date, startTime, endTime 모두 입력된 경우 -> "YYYY년 M월 D일 (요일)  hh:mm ~ hh:mm"  
 * @param {...string} dateInfo - 날짜 관련 문자열들
 * @returns {string|undefined} - 파싱된 문자열 또는 오류 시 undefined 반환
 */
export const dateParser = (...dateInfo) => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    let dateString;
    try {
        // (1) date만 입력 -> "YYYY년 M월 D일"
        if (dateInfo.length == 1) {
            const date = dateInfo[0];
            const onlyDate = new Date(Date.parse(date));
            dateString = `${onlyDate.getFullYear()}년 ${onlyDate.getMonth() + 1
                }월 ${onlyDate.getDate()}일 (${daysOfWeek[onlyDate.getDay()]})`
        }
        // (2) startTime, endTime 입력 -> "hh:mm ~ hh:mm"
        else if (dateInfo.length == 2) {
            const [hour1, minute1, second1] = dateInfo[0].split(":").map(Number);
            const [hour2, minute2, second2] = dateInfo[1].split(":").map(Number);

            const startTime = new Date(0, 0, 0, hour1, minute1, second1);
            const endTime = new Date(0, 0, 0, hour2, minute2, second2);

            dateString = `${String(
                startTime.getHours()
            ).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(
                2,
                "0"
            )} ~ ${String(endTime.getHours()).padStart(2, "0")}:${String(
                endTime.getMinutes()
            ).padStart(2, "0")}`;
        }
        // (3) date, startTime, endTime 입력 -> "YYYY년 M월 D일 hh:mm ~ hh:mm"
        else if (dateInfo.length == 3) {
            const date = dateInfo[0];
            const startTime = dateInfo[1];
            const endTime = dateInfo[2];
            const startDate = new Date(Date.parse(date + " " + startTime));
            const endDate = new Date(Date.parse(date + " " + endTime));
            dateString = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1
                }월 ${startDate.getDate()}일 (${daysOfWeek[startDate.getDay()]})  ${String(
                    startDate.getHours()
                ).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(
                    2,
                    "0"
                )} ~ ${String(endDate.getHours()).padStart(2, "0")}:${String(
                    endDate.getMinutes()
                ).padStart(2, "0")}`;
        } else {
            console.log(`[Parsing Error] ${dateInfo}`);
        }

        return dateString;
    } catch (e) {
        console.log(`[Parsing Error] ${e}`);
        return undefined;
    }
};