/**
 * 주어진 날짜 및 시간 정보를 파싱하여 다음과 같은 문자열을 반환한다.
 *   (1) date, startTime, endTime 모두 입력된 경우 -> "YYYY년 M월 D일 (요일)  hh:mm ~ hh:mm"  
 *   (2) date 만 입력된 경우 -> "YYYY년 M월 D일 (요일)"  
 * @param {string} date - 날짜 문자열 (YYYY-MM-DD 형식)
 * @param {string} startTime - 시작 시간 문자열 (HH:mm:ss 형식, 옵션)
 * @param {string} endTime - 종료 시간 문자열 (HH:mm:ss 형식, 옵션)
 * @returns {string|undefined} - 파싱된 문자열 또는 오류 시 undefined 반환
 */
export const dateParser = (date, startTime = undefined, endTime = undefined) => {
    try {
        // date, startTime, endTime 입력 -> "YYYY년 M월 D일 hh:mm ~ hh:mm"
        const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
        let dateString;
        if (startTime && endTime) {
            const startDate = new Date(Date.parse(date + " " + startTime));
            const endDate = new Date(Date.parse(date + " " + endTime));
            dateString = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1
                }월 ${startDate.getDate()}일 (${daysOfWeek[startDate.getDay()]}) ${String(
                    startDate.getHours()
                ).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(
                    2,
                    "0"
                )} ~ ${String(endDate.getHours()).padStart(2, "0")}:${String(
                    endDate.getMinutes()
                ).padStart(2, "0")}`;
        } else {
            // date만 입력 -> "YYYY년 M월 D일"
            const onlyDate = new Date(Date.parse(date));
            dateString = `${onlyDate.getFullYear()}년 ${onlyDate.getMonth() + 1
                }월 ${onlyDate.getDate()}일 (${daysOfWeek[onlyDate.getDay()]})`
        }
        return dateString;
    } catch (e) {
        console.log("Parsing Error!!!")
        return undefined;
    }
};