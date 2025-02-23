import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn, } from '@clerk/nextjs'



export default function SignInPage(){
    return (
        <div className = "flex gap-[50px] w-full justify-center p-[50px] items-center">
            <SignIn />
            <img className = "w-[500px] h-fit" src = "SEO Optimizer.png"></img>
        </div>
    )
}