import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = 'http://172.28.17.153:2346'

export const registerUser = createAsyncThunk(
    'auth/register',
    async({username, password},{rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            }
            await axios.put(
                `${backendURL}/users/${username}`,
                {username, password},
                config
            )
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)
export const userLogin = createAsyncThunk(
    'auth/login',
    async({username, password},{rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            }
            const {data} = await axios.post(
                `${backendURL}/auth/login`,
                {username, password},
                config
            )
            localStorage.setItem('userToken', data.token)
            return data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)