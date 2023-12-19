// 사용자의 state 확인 후 어느 페이지로 이동할지 결정
export const getNavigationUrl = (id, state) => {
    switch (state) {
        case 0: // 미팅 폼 작성 이전 -> 미팅 폼 작성 페이지
            return `/meeting/fill/${id}`;
        case 1: // 미팅 폼 작성 이후 -> 미팅 폼 작성 완료 페이지
            return `/meeting/view/${id}`;
        case 2: // 투표 참여 이전 -> 투표 폼 작성 페이지
            return `/vote/fill/${id}`;
        case 3: // 투표 참여 이전 -> 투표 폼 작성 완료 페이지
            return `/vote/view/${id}`;
        case 4: // 미팅 확정 -> 미팅 확정 페이지
            return `/meeting/confirmed/${id}`;
        default: // user_status 에러 -> 에러 페이지
            return `/error`;
    }
}