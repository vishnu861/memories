import React,{useState} from 'react'
import {Avatar,Button,Paper,Grid,Typography,Container} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles';
import {GoogleLogin} from 'react-google-login';
import Icon from './icon';
import { Input } from './Input';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import { AUTH } from '../../constants/actionTypes';
import {signin,signup} from '../../actions/auth';

const initialState = {firstName:'',lastName:'',email:'',password:'',confirmPassword:''}

export const Auth = () => {
    const [showPassword,setShowPassword] = useState(false);
    const [isSignUp,setIsSignUp] = useState(false);
    const [formData,setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignUp){
            dispatch(signup(formData,history));
        }
        else{
            dispatch(signin(formData,history));
        }
    }
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }
    const handleShowPassword = () => {
        setShowPassword(prev => !prev)
    }
    const switchMode = () => {
        setIsSignUp((prev) => !prev);
        setShowPassword(false)
    }
    const googleSucess= async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try{
            dispatch({type:AUTH,data:{result,token}});
            history.push('/');
        }
        catch(error){
            console.log(error);
        }
    }
    const googleFailure = () => {
        console.log("Google sign was unsuccessfull. Try again");
    }
    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation='3'>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>
                    {
                        isSignUp ? 'SignUp':'Sign In'
                    }
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignUp && (
                                <>
                                 <Input name='firstName' label='First Name' handleChange= {handleChange} autoFocus half />
                                 <Input name='lastName' label='Last Name' handleChange= {handleChange}  half />
                                </>
                            )
                        }
                        <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                        <Input name='password' label='password' handleChange={handleChange} type={showPassword?'text':'password'} handleShowPassword={handleShowPassword} />
                        {
                            isSignUp && <Input name='confirmPassword' label='Confirm Password' handleChange={handleChange} type='password' />
                        }
                    </Grid>
                    
       
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {
                            isSignUp? 'Sign Up':'Sign In'
                        }
                    </Button>
                    <GoogleLogin 
                     clientId='703266494348-4dldbq3s34ub9v9bmja641c5ht3k9gur.apps.googleusercontent.com'
                     render = {(renderProps) => (
                         <Button className={classes.googleButton} color='primary' 
                         fullWidth 
                         onClick= {renderProps.onClick} 
                         disabled={renderProps.disabled} 
                         startIcon={<Icon />} 
                         variant='contained'>Google Sign In</Button>
                     )}
                     onSuccess={googleSucess}
                     onFailure={googleFailure}
                     cookiePolicy='single_host_origin'
                    />

                    <Grid container justify='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {
                                    isSignUp ? 'Already have an account? Sign In':"Don't have an account? Sign Up"
                                }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}
