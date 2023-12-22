import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useGetUserDetailsQuery} from "../app/services/auth/authService";
import {NavLink} from "react-router-dom";
import {logout, setCredentials} from "../features/auth/authSlice";
import './header.css';
import {styled} from "@mui/system";
import {AppBar, Button, CssBaseline, Toolbar, Typography} from "@mui/material";
const useStyles = styled((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));
const Header = () => {
    const {userInfo} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const classes = useStyles()
    const {data, isFetching} = useGetUserDetailsQuery('userInfo',{
        pollingInterval: 900000,
    })

    useEffect(() => {
        if (data) dispatch(setCredentials(data))
    },[data, dispatch])
    return (
        <header>
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="static" style={{ background: '#2e7d32' }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" className={classes.title}>
                        {isFetching
                            ? `Fetching your profile...`
                            : userInfo !== null
                                ? `Logged in as ${userInfo.login}`
                                : "You're not logged in"}
                    </Typography>

                    <div/>
                        {userInfo ? (
                        <Button color="inherit" onClick={() => dispatch(logout())} sx={{ justifyContent: "flex-end" }}>
                            Logout
                        </Button>
                            ) : (
                            <NavLink className='button' to='/login'>
                                LOGIN
                            </NavLink>
                        )}
                </Toolbar>
            </AppBar>
            <nav className='container navigation'>
                <NavLink to='/'>About</NavLink>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/register'>Register</NavLink>
                <NavLink to='/user-profile'>Dots</NavLink>
            </nav>
        </div>
        </header>
    );
};

export default Header;