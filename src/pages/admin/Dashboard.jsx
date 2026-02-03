import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {rdetail} from '../../redux/slices/authSlice';


const Demo = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(rdetail())
    },[dispatch])
    const theData = useSelector((state) => state.AuthSlice.data.rdetail);
    console.log("the data......", theData);
    return(
        <div>hii tttttthere</div>
    )
}

export default Demo;