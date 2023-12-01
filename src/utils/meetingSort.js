import { dateParser } from "./dateParser";

/**
 * "HH:mm:ss" 형식의 두 문자열을 입력받아 두 시간 사이의 밀리 초를 리턴하는 함수
 * @param {string} startTime - 시작 시간 문자열
 * @param {string} endTime - 종료 시간 문자열
 * @returns {number} - 두 시간 사이의 밀리 초
 */
export const getMillisecondsBetweenTimes = (startTime, endTime) => {
    // 시간 문자열을 "HH:mm:ss" 형식에서 추출
    const [hour1, minute1, second1] = startTime.split(":").map(Number);
    const [hour2, minute2, second2] = endTime.split(":").map(Number);

    // Date 객체를 사용하여 두 시간을 밀리초로 변환
    const date1 = new Date(0, 0, 0, hour1, minute1, second1);
    const date2 = new Date(0, 0, 0, hour2, minute2, second2);

    // 두 날짜 사이의 밀리초 차이 계산
    const timeDifference = date2 - date1;

    return timeDifference;
};


/**
 * 밀리초를 입력받아 해당 시간 안에 총 몇 개의 셀이 존재하는지를 리턴하는 함수
 * @param {number} millisec - 밀리 초
 * @returns {number} - 셀 개수
 */
export const getCellCount = (millisec) => {
    return millisec / (60000 * 15);  // x분 / 15 -> 15분 단위 셀의 개수를 리턴
};


/**
 * 요일별 전체 미팅 셀 데이터, 미팅 시작 시간, 미팅 끝 시간, 최소 시간을 입력받아,
 * 최소 시간을 기준으로 요일별 가장 많이 겹치는 시간대에 대한 데이터를 리턴하는 함수
 * @param {object} input - 요일별 전체 미팅 셀 데이터 (Object)
 * @param {string} startTime - 미팅 시작 시간 문자열 ("hh:mm:ss")
 * @param {string} endTime - 미팅 끝 시간 문자열 ("hh:mm:ss")
 * @param {number} minCellCount - 최소 셀 개수 (Int)
 * @returns {object} - 요일별 가장 많이 겹치는 시간대 데이터 (Object)
 */
export const getSortedMeetingInfo = (input, startTime, endTime, minCellCount) => {

    const cellCount = getCellCount(getMillisecondsBetweenTimes(startTime, endTime));  // 총 셀 개수
    const dayCount = input.schedules.length;  // 총 요일 수
    const memberCount = input.members;        // 참여한 총 멤버 수

    let intervalStart = "00:00:00";    // Interval 시작 시간
    let intervalEnd = "00:00:00";      // Interval 종료 시간
    let intervalExist = false;         // Interval 진행 중인지 여부
    let continuousCellCount = 0;       // 연속된 셀 개수
    let timeString = "";               // "hh:mm ~ hh:mm" 형식 문자열
    let memRatioString = "";           // "m/n 명" 형식 문자열
    let minMemberCount = memberCount;  // 최소 인원 수
    let times = {};                    // schedule 내 모든 셀 객체 리스트

    /* Iteration에서 사용된 변수 초기화 */
    const initVars = () => {
        intervalStart = "00:00:00";
        intervalEnd = "00:00:00";
        intervalExist = false;
        continuousCellCount = 0;
        timeString = "";
        memRatioString = "";
    }

    // 리턴값
    const result = {
        members: memberCount,
        schedules: []
    };

    // 초기 구조 설정
    input.schedules.forEach((schedule) => {
        result.schedules.push({ date: dateParser(schedule.date), cases: [] });
    });

    for (let dayIdx = 0; dayIdx < dayCount; dayIdx++) {
        times = input.schedules[dayIdx].times;
        minMemberCount = memberCount;
        for (; minMemberCount > 0; minMemberCount--) {
            for (let cellIdx = 0; cellIdx < cellCount; cellIdx++) {
                // 아직 Interval이 시작하지 않았고, minMemberCount보다 많거나 같은 인원이 존재하는 경우 -> Interval 시작
                if (!intervalExist && times[cellIdx].available.length >= minMemberCount) {
                    intervalExist = true;
                    intervalStart = times[cellIdx].time;
                    continuousCellCount++;
                }
                // Interval이 시작되었고, minMemberCount보다 적은 인원이 존재하는 경우 -> Interval 종료
                else if (intervalExist && times[cellIdx].available.length < minMemberCount) {

                    // 연속된 셀 개수가 최소 셀 개수보다 크거나 같으면 저장
                    if (continuousCellCount >= minCellCount) {
                        intervalEnd = times[cellIdx].time;
                        timeString = dateParser(intervalStart, intervalEnd);
                        memRatioString = `${minMemberCount}/${memberCount} (명)`
                        result.schedules[dayIdx].cases.push({ time: timeString, availMemRatio: memRatioString });
                    }

                    initVars();
                }
                // Interval이 시작되었고, memberCount보다 많거나 같은 인원이 존재하는 경우 -> Interval 계속
                else if (intervalExist) {
                    continuousCellCount++;
                }
            }

            // 마지막 셀까지 Interval이 유지되는 경우 -> 조건(Interval 내 셀 개수가 최소 셀 개수 이상) 충족 시 저장
            if (intervalExist && continuousCellCount >= minCellCount) {
                intervalEnd = endTime;
                timeString = dateParser(intervalStart, intervalEnd);
                memRatioString = `${minMemberCount}/${memberCount} (명)`
                result.schedules[dayIdx].cases.push({ time: timeString, availMemRatio: memRatioString });
            }

            initVars();
        }
    }

    result.schedules = result.schedules.filter((schedule) => schedule.cases.length > 0);

    result.schedules.sort((a, b) => {
        const parseDate = (dateString) => {
            const [year, month, day] = dateString.match(/(\d+)/g);
            return new Date(year, month - 1, day);
        }
        return parseDate(a.date) - parseDate(b.date);
    });
    return result;
};