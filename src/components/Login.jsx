import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {userLogin} from "../features/auth/authActions";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Spinner from "./Spinner";
import Error from "./Error";
import TextField from '@mui/material/TextField';
import {Container, styled, textAlign} from "@mui/system";
import {Button, Grid, Paper} from "@mui/material";

const useStyles = styled((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    })
)
const Login = () => {
    const dispatch = useDispatch()
    const {loading, userInfo, error} = useSelector((state) => state.auth)
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const paperStyle = {padding: '50px 20px', width: 600, margin: "20px auto"};
    const classes = useStyles()

    useEffect(() => {
        if (userInfo) {
            navigate('/user-profile')
        }
    }, [navigate, userInfo])
    const submitForm = (data) => {
        dispatch(userLogin(data))
    }
    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <h1 style={{textAlign: 'center'}}>Log In</h1>
                <form className={classes.root} noValidate autoComplete="off">
                    {error && <Error>{error}</Error>}
                    {/*<div className='form-group'>*/}
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
                            <div style={{textAlign: 'center'}}>
                                <Button onClick={handleSubmit(submitForm)} variant="contained" color="success"
                                        disabled={loading} style={{}}>
                                    {loading ? <Spinner/> : 'Log In'}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;