import { SignUp } from "@clerk/nextjs";
import { Box, Typography, AppBar, Container, Toolbar, Button } from "@mui/material";

export default function SignUpPage(){
    return (
        <div className = "flex gap-[50px] w-full justify-center p-[50px] items-center">
            <SignUp />
            <img className = "w-[500px] h-fit" src = "SEO Optimizer.png"></img>
        </div>
    )
}