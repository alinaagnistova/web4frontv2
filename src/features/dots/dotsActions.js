import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = 'http://172.28.17.153:2346';

const getToken = () => {
    return localStorage.getItem('userToken');
};

const createAuthorizedAsyncThunk = (type, payloadCreator) => {
    return createAsyncThunk(type, async (args, thunkAPI) => {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await payloadCreator(args, { ...thunkAPI, headers });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    });
};

export const sendDots = createAuthorizedAsyncThunk('dots/send', async ({ x, y, r }, { headers }) => {
    return axios.post(`${backendURL}/requests`, { x, y, r }, { headers });
});

export const getDots = createAuthorizedAsyncThunk('dots/get', async (_, { headers }) => {
    return axios.get(`${backendURL}/requests`, { headers });
});

export const deleteDots = createAuthorizedAsyncThunk('dots/delete', async (_, { headers }) => {
    return axios.delete(`${backendURL}/requests`, { headers });
});

