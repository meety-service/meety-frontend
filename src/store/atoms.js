import { atom } from 'recoil'

export const snackbarMessageAtom = atom({
    key: "SnackbarMessage",
    default: ""
})

export const isSnackbarOpenAtom = atom({
    key: "IsSnackBarOpen",
    default: false
})

export const showNavbarAtom = atom({
    key:"showNavbar",
    default: false
})

export const errorTitleAtom = atom({
    key:"errorTitle",
    default: "원하시는 페이지를 찾을 수 없습니다."
})

export const errorContentAtom = atom({
    key:"errorContent",
    default: "찾으시려는 페이지의 주소가 잘못 입력되었거나, 페이지 주소의 변경 혹은 삭제로 인해 현재 사용하실 수 없습니다."
})