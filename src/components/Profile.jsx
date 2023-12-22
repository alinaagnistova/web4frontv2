import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import Graph from "./Graph";
import {styled} from "@mui/system";
import {
    Button,
    FormControlLabel,
    FormHelperText,
    Grid,
    Paper, Radio, RadioGroup, Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow
} from "@mui/material";
import TextField from "@mui/material/TextField";
import './profile.css';
import Spinner from "./Spinner";
import Error from "./Error";
import {Controller, useForm} from "react-hook-form";
import {deleteDots, getDots, sendDots} from "../features/dots/dotsActions";


const useStyles = styled((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    })
)

const Profile = () => {
    const paperStyle = {padding: '40px 15px', width: 900, marginRight: '20px'};
    const classes = useStyles()
    const radioStyle = {display: "flex", alignItems: "center", flexDirection: "column"};
    const dispatch = useDispatch()
    const {loading, dots, error} = useSelector((state) => state.dots)
    const {register, handleSubmit, control, reset, formState: {errors}} = useForm()
    const [customError, setCustomError] = useState(null);
    const [rValue, setRValue] = useState(1);

    const validateY = (value) => {
        const y = parseFloat(value);
        if (isNaN(y)) {
            return "Must be a number";
        } else if (y < -3 || y > 3) {
            return "Y must be in the range (-3..3)";
        }
        return true;
    };

    useEffect(() => {
        (async () => {
            try {
                await dispatch(getDots());
            } catch (error) {
                console.error('Error loading points for the table', error);
            }
        })();
    }, [dispatch]);

    const submitForm = (data) => {
        dispatch(sendDots(data));
    };
    const handleDelete = (data) => {
        return dispatch(deleteDots(data));
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>

            <Paper elevation={3} style={paperStyle}>
                <Graph style={{padding: '20px'}} radius={rValue}/>
                {error && <Error>{error}</Error>}
                {customError && <Error>{customError}</Error>}
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container direction={"column"} spacing={5}>
                        <Grid item>
                            <div style={radioStyle}>
                                <p>Choose X:*</p>
                                <Controller name="x"
                                            control={control}
                                            defaultValue=""
                                            rules={{required: "Select a value"}}
                                            render={({field}) => (
                                                <div>
                                                    <RadioGroup {...field} row>
                                                        <FormControlLabel value="-5" control={<Radio/>} label="-5"/>
                                                        <FormControlLabel value="-4" control={<Radio/>} label="-4"/>
                                                        <FormControlLabel value="-3" control={<Radio/>} label="-3"/>
                                                        <FormControlLabel value="-2" control={<Radio/>} label="-2"/>
                                                        <FormControlLabel value="-1" control={<Radio/>} label="-1"/>
                                                        <FormControlLabel value="0" control={<Radio/>} label="0"/>
                                                        <FormControlLabel value="1" control={<Radio/>} label="1"/>
                                                        <FormControlLabel value="2" control={<Radio/>} label="2"/>
                                                        <FormControlLabel value="3" control={<Radio/>} label="3"/>
                                                    </RadioGroup>
                                                    {errors.x &&
                                                        <FormHelperText error>{errors.x.message}</FormHelperText>}
                                                </div>
                                            )}
                                />
                            </div>
                        </Grid>
                        <Grid item>
                            <TextField id="outlined-basic" label="Input Y" variant="outlined"
                                       required fullWidth {...register('y', {validate: validateY})}
                                       error={!!errors.y}
                                       helperText={errors.y && errors.y.message}
                            />
                        </Grid>
                        <Grid item>
                            <div style={radioStyle}>
                                <p>Choose R:*</p>
                                <Controller name="r"
                                            control={control}
                                            defaultValue=""
                                            rules={{required: "Select a value"}}
                                            render={({field}) => (
                                                <div>
                                                    <RadioGroup {...field} row
                                                                onClick={(e) => setRValue(e.target.value)}
                                                    >
                                                        <FormControlLabel value="-5" control={<Radio/>} label="-5"/>
                                                        <FormControlLabel value="-4" control={<Radio/>} label="-4"/>
                                                        <FormControlLabel value="-3" control={<Radio/>} label="-3"/>
                                                        <FormControlLabel value="-2" control={<Radio/>} label="-2"/>
                                                        <FormControlLabel value="-1" control={<Radio/>} label="-1"/>
                                                        <FormControlLabel value="0" control={<Radio/>} label="0"/>
                                                        <FormControlLabel value="1" control={<Radio/>} label="1"/>
                                                        <FormControlLabel value="2" control={<Radio/>} label="2"/>
                                                        <FormControlLabel value="3" control={<Radio/>} label="3"/>
                                                    </RadioGroup>
                                                    {errors.r && <FormHelperText error>{errors.r.message}</FormHelperText>}
                                                </div>
                                            )}
                                />
                            </div>
                        </Grid>
                        <Grid item>
                            <div>
                                <table className='formButtons'>
                                    <tr>
                                        <td><Button variant="contained" color="success"
                                                    onClick={handleSubmit(submitForm)}
                                                    disabled={loading}>
                                            {loading ? <Spinner/> : 'Send Data'}
                                        </Button>
                                        </td>
                                        <td><Button variant="contained" color="success" onClick={() => reset()}>
                                            Reset Form
                                        </Button></td>
                                    </tr>
                                </table>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <TableContainer component={Paper}>
                <div style={{textAlign:'center'}} onClick={handleDelete}>
                    <Button variant="contained" color="success">
                        Delete Data
                    </Button>
                </div>
                <Table sx={{minWidth: 550}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>X</TableCell>
                            <TableCell>Y</TableCell>
                            <TableCell>R</TableCell>
                            <TableCell>result</TableCell>
                            <TableCell>time</TableCell>
                            <TableCell>scriptTime</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dots ? (
                            dots.map((dot, index) => (
                                <TableRow key={index}>
                                    <TableCell>{dot.x}</TableCell>
                                    <TableCell>{dot.y}</TableCell>
                                    <TableCell>{dot.r}</TableCell>
                                    <TableCell
                                        style={{color: dot.areaIntersection ? "green" : "red"}}>{dot.areaIntersection ? "hit" : "miss"}</TableCell>
                                    <TableCell>{dot.time}</TableCell>
                                    <TableCell>{dot.execTime}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} style={{textAlign:"center"}}>No data available</TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
};

export default Profile;