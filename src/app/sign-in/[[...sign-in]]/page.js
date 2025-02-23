import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn, } from '@clerk/nextjs'



export default function SignInPage(){
    return (
        
            <Container maxWidth='100vw' style={{margin:0, padding:0}} sx={{
                bgcolor: '#98c1d9',
                color: 'white',
                height: '100vh',
            }}>
                <AppBar position='static'>
                <Toolbar sx = {{backgroundColor: '#00796b'}}>
                    <Typography variant='h6' sx={{
                        flexGrow: 1
                    }}>AI-FlashCards</Typography>
                    <Button color="inherit" href='/'> Home </Button>
                    <Button color="inherit" href='/sign-up'> Sign Up </Button>
                </Toolbar>  
                </AppBar> 

                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                >
                    <Typography variant="h4" gutterBottom sx={{
                        mt: 4,
                        // setting the text to be a gradient color:
                        background: '#00796b',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Sign In to Begin</Typography>
                    <SignIn />
                </Box> 
            </Container>
    )
}