import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {registerUser} from "../features/auth/authActions";
import {useNavigate} from "react-router-dom";
import Error from "./Error";
import Spinner from "./Spinner";
import {Container, styled} from "@mui/system";
import {Button, Grid, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";

const useStyles = styled((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    })
)
const Register = () => {
    const [customError, setCustomError] = useState(null)
    const {loading, userInfo, error, success} = useSelector(
        (state) => state.auth
    )
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"};
    const classes = useStyles()

    useEffect(() =>{
        if (success) navigate ('/login')
        if (userInfo) navigate ('user-profile')
    },[navigate, userInfo, success])
    const submitForm = (data) => {
        if (data.password !== data.confirmPassword) {
            setCustomError('Password mismatch')
            return
        }
        data.username = data.username.toLowerCase()
        dispatch(registerUser(data))
    }

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <h1 style={{textAlign:'center'}}>Sign Up</h1>
                <form className={classes.root} noValidate autoComplete="off">
                    {error && <Error>{error}</Error>}
                    {customError && <Error>{customError}</Error>}
                    <Grid container direction={"column"} spacing={5}>
                        <Grid item>
                            <TextField id="outlined-basic" label="Username" variant="outlined" {...register('username')}
                                       required fullWidth></TextField>
                        </Grid>
                        <Grid item>
                            <TextField type="password" id="outlined-basic" label="Password"
                                       variant="outlined" {...register('password')} required fullWidth></TextField>
                        </Grid>
                        <Grid item>
                            <TextField type="password" id="outlined-basic" label="Confirm password"
                                       variant="outlined" {...register('confirmPassword')} required fullWidth></TextField>
                        </Grid>
                        <Grid item>
                            <div style={{textAlign:'center'}}>
                                <Button onClick={handleSubmit(submitForm)} variant="contained" color="success"
                                        disabled={loading} style={{}}>
                                    {loading ? <Spinner/> : 'Sign Up'}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
        // <form onSubmit={handleSubmit(submitForm)}>
        //     {error && <Error>{error}</Error>}
        //     <div className='form-group'>
        //         <label htmlFor='username'>Username</label>
        //         <input type="text" className="form-input" {...register('username')} required/>
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='password'>Password</label>
        //         <input type="password" className="form-input" {...register('password')} required/>
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='confirmPassword'>Confirm Password</label>
        //         <input type="password" className="form-input" {...register('confirmPassword')} required/>
        //     </div>
        //     <button type='submit' className='button' disabled={loading}>
        //         {loading ? <Spinner /> : 'Register'}
        //     </button>
        // </form>
    );
};

export default Register;