// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
    // IMPORTING TYPES
import {UserContextReducerStateType, User, UserContextReducerActionType, AuthResponseValues} from "@/types/Types";
    // IMPORTING GUARDS
import {objIsUser} from "@/types/Guards"

// DEFINING THE INITIAL STATE OF THE USER CONTEXT
const initialState: UserContextReducerStateType = {
    user: null,
    loading: false,
    error: '',
    success: ''
}

// DEFINING ASYNC ACTIONS FOR THE USER CONTEXT REDUCER
    // FUNCTION TO DELETE USER
export const deleteUser = createAsyncThunk<AuthResponseValues["DELETE_USER"], UserContextReducerActionType["DELETE_USER"]>(
    "userContextReducer/deleteUser",
    
    async (user, thunkAPI) => {
        try{
            const response: Response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
              }
            );

            const { success, error } = await response.json();

            if (error) {
              throw new Error(error)
            }

            return success;
        }catch(error: unknown){
            return thunkAPI.rejectWithValue((error as Error).message)
        }
    }
)

    // FUNCTION TO GET USER
export const getUser = createAsyncThunk<AuthResponseValues["GET_USER"], UserContextReducerActionType["GET_USER"]>(
    "userContextReducer/getUser",

    async(voidParams, thunkAPI) => {
        try{
            const response: Response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`
            );
            const { success, error, data: user } = await response.json();

            if (error) {
              throw new Error(error)
            }

            return { success, user };
        }catch(error: unknown){
            return thunkAPI.rejectWithValue((error as Error).message);
        }
    }
)

    // FUNCTION TO SET USER
export const setUser = createAsyncThunk<AuthResponseValues["SET_USER"], UserContextReducerActionType["SET_USER"]>(
    "userContextReducer/setUser",

    async({user, route}, thunkAPI) => {
        try{
            const response: Response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/${route}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
              }
            );

            const { success, error } = await response.json();

            if (error) {
              throw new Error(error);
            }

            return success;
        }catch(error: unknown){
            return thunkAPI.rejectWithValue((error as Error).message)
        }
    }
)

// DEFINING A SLICE OF THE STORE CONTAINING THE USERCONTEXT ACTIONS AND STATE
const userContextSlice = createSlice({
    name: "userContextReducer",
    initialState,
    reducers: {},
    
    extraReducers: builder => {
        builder
          .addCase(
            deleteUser.pending,
            (state: UserContextReducerStateType) => ({
              ...state,
              loading: true,
              error: "",
              success: "",
              user: null,
            })
          )

          .addCase(
            deleteUser.rejected,

            (state: UserContextReducerStateType, { payload }) => ({
              ...state,
              loading: false,
              error: payload as string,
              success: "",
              user: null,
            })
          )

          .addCase(
            deleteUser.fulfilled,

            (state: UserContextReducerStateType, { payload: { success } }) => {
              return {
                ...state,
                loading: false,
                error: "",
                success: success as string,
                user: null,
              };
            }
          )

          .addCase(setUser.pending, (state: UserContextReducerStateType) => ({
            ...state,
            loading: true,
            error: "",
            success: "",
            user: null,
          }))

          .addCase(setUser.rejected, (state: UserContextReducerStateType, { payload }) => ({
              ...state,
              loading: false,
              error: payload as string,
              success: "",
              user: null,
            })
          )

          .addCase(setUser.fulfilled, (state: UserContextReducerStateType, { payload: {success} }) => {
              return {
                ...state,
                loading: false,
                error: "",
                success: success as string,
                user: null,
              };
            }
          )
          
          .addCase(getUser.pending, (state: UserContextReducerStateType) => ({
                ...state,
                loading: true,
                error: "",
                success: "",
                user: null,
          }))

          .addCase(getUser.fulfilled, (state: UserContextReducerStateType, { payload: { user, success}}) => {
                if (!objIsUser(user)) {
                    return {
                        ...state,
                        loading: false,
                        error: "The user data is not of the required type",
                        success: "",
                        user: null,
                    };
                }

                return {
                    ...state,
                    loading: false,
                    error: "",
                    success: success as string,
                    user: user,
                };
            }
          );
    }
})

// EXPORT THE REDUCER FROM THE SLICE
const UserContextReducer = userContextSlice.reducer
export default UserContextReducer