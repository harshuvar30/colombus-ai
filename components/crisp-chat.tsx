"use client";

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";


export const CrispChat = () =>{
    useEffect(()=>{
        Crisp.configure("53205b7c-7aec-4ae2-94ff-033b270491df")
    },[])
    return null;
}