export const handleError = (error) => {
    if (error.response) {
        // 요청이 전송되었고, 서버가 2xx 외의 상태 코드로 응답한 경우
        console.log(`Error-data : ${error.response.data}`);
        console.log(`Error-status : ${error.response.status}`);
        console.log(`Error-headers : ${error.response.headers}`);

        // TODO: status 별 에러 핸들링 필요
      } else if (error.request) {
        // 요청이 전송되었지만, 응답이 수신되지 않은 경우
        console.log(error.request);
      } else {
        // 오류가 발생한 요청을 설정하는 동안 문제가 발생한 경우
        console.log("Error", error.message);
      }
      console.log(error.config);
};
