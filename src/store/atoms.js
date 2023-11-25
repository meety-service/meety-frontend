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