import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Swal from 'sweetalert2'

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isError: false,
        loading: true,
        errorMessage: '',
        userProfile: {},
        formEditProfile: {}
    },
    reducers: {
        changeIsError: (state, action) => {
            state.isError = action.payload
        },
        changeLoading: (state, action) => {
            state.loading = action.payload
        },
        changeErrorMessage: (state, action) => {
            state.errorMessage = action.payload
        },
        changeUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        changeFormEditProfile: (state, action) => {
            state.formEditProfile = action.payload
        }
    }
})

export const {
    changeIsError,
    changeLoading,
    changeErrorMessage,
    changeUserProfile,
    changeFormEditProfile
} = appSlice.actions

export const register = (input) => {
    return async (dispatch) => {
        try {
            let link = import.meta.env.VITE_BASE_URL + `/register`
            await axios({
                method: 'post',
                url: link,
                data: input,
            })
            Swal.fire({
                title: "Success!",
                text: "Your registration is successfully",
                icon: "success"
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
            dispatch(changeErrorMessage(error.response.data.message))
            dispatch(changeIsError(true))
            throw error
        }
    }
}

export const login = (input) => {
    return async (dispatch) => {
        try {
            let link = import.meta.env.VITE_BASE_URL + `/login`
            let { data } = await axios({
                method: 'post',
                url: link,
                data: input
            })
            localStorage.access_token = data.access_token
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
            throw error
        }
    }
}

export const userProfileFetch = () => {
    return async (dispatch) => {
        try {
            let link = import.meta.env.VITE_BASE_URL + `/users/profile`
            let { data } = await axios({
                method: 'get',
                url: link,
                headers: {
                    Authorization: 'Bearer ' + localStorage.access_token
                }
            })
            dispatch(changeUserProfile(data))
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
            throw error
        } finally {
            dispatch(changeLoading(false))
        }
    }
}

export const saveSubmitUpdated = (input) => {
    return async (dispatch) => {
        try {
            let link = import.meta.env.VITE_BASE_URL + `/users`
            await axios({
                method: 'put',
                url: link,
                data: input,
                headers: {
                    Authorization: 'Bearer ' + localStorage.access_token
                }
            })
            Swal.fire({
                title: "Success!",
                text: "Updated successfully",
                icon: "success"
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
            dispatch(changeErrorMessage(error.response.data.message))
            dispatch(changeIsError(true))
            throw error
        }
    }
}

export const fetchingForFormEditProfile = () => {
    return async (dispatch) => {
        try {
            let link = import.meta.env.VITE_BASE_URL + `/users/profile`
            let { data } = await axios({
                method: 'get',
                url: link,
                headers: {
                    Authorization: 'Bearer ' + localStorage.access_token
                }
            })
            dispatch(changeFormEditProfile({
                username: data.username,
                email: data.email,
                gender: data.gender,
                interest: data.interest,
                show: data.show,
                fullname: data.UserProfile.fullname,
                birthdate: data.UserProfile.birthdate,
                profilePicture: data.UserProfile.profilePicture,
                address: data.UserProfile.address,
                occupation: data.UserProfile.occupation,
                bio: data.UserProfile.bio
            }))
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
            throw error
        } finally {
            dispatch(changeLoading(false))
        }
    }
}

export default appSlice.reducer // untuk dipakai di configure store index.js