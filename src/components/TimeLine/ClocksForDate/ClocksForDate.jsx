import react, {useCallback, useContext, useEffect, useState} from 'react'
import TimeField from "react-simple-timefield";
import Timeline from  "../TimeLine.module.css";
import Slider from "@mui/material/Slider";
import React from "react";
import {Context} from "../../Map/Context";
import {RequestForImagesData} from "../../Map/RequestsForImagesData/RequestForImagesData";
import {disableMapDragging,enableMapDragging} from "../../Map/MapEvents/MapEvents";
import axios from "axios";
import {URL_FOR_MARKS, URL_FOR_USER} from "../../../config/config";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {ScrollMenu} from "react-horizontal-scrolling-menu";

export function ClocksForDate(props){
    const [context,setContext] = useContext(Context)

    let localFormattingArray = [];

    const [timeSlider, setTimeSlider] = useState([]);

    const navigate = useNavigate()
    const [refreshTokenCookies,setRefreshTokenCookie,removeRefreshTokenCookie] = useCookies(['refreshToken','accessToken']);

    const currentSatelliteGlobal = {
        suomi: '&satellite=npp',
        noaa: '&satellite=jp1',
        empty: ''
    }
    const requestForTime = (contextCurrentDate,suomi,noaa) => {

        const currentSatellite = suomi ? currentSatelliteGlobal.suomi : noaa ? currentSatelliteGlobal.noaa : currentSatelliteGlobal.empty
        //console.log(contextCurrentDate)
        const res = axios(`${URL_FOR_MARKS.URL_GET_TIME_FROM_DATE}?date=${contextCurrentDate}${currentSatellite}`,{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${refreshTokenCookies['accessToken']}`
            }
        })
            .then((response) => {
                //console.log("Первая проверка")
                return response.data.time[context.currentDate]
            })
            .catch((error) =>{
                //console.log(error.message)
                if(error.request.status === 403 || error.request.status === 401){
                    axios(URL_FOR_USER.URL_REFRESH,
                        {
                            method : 'POST',
                            data : {
                                refresh_token: refreshTokenCookies['refreshToken']
                            }
                        })
                        .then(response => {
                            setRefreshTokenCookie('accessToken', response.data.access, 5 * 3600)

                            return axios(`${URL_FOR_MARKS.URL_GET_TIME_FROM_DATE}?date=${contextCurrentDate}${currentSatellite}`,{
                                method: 'GET',
                                headers: {
                                    Authorization: `Bearer ${response.data.access}`
                                }
                            })
                                .then((response) => {
                                    // console.log(response.data)
                                    // console.log("Вторая проверка")
                                    return response.data.time[context.currentDate]//!!!!
                                })
                                .catch((e)=>{
                                    console.log(e.message)
                                })
                        })
                        .catch((e) => {
                            console.log(e.message)
                            navigate('/')
                            removeRefreshTokenCookie('refreshToken')
                        })
                }
                else if(error.request.status >= 500){
                    console.log(error.message)
                }
            })
        //console.log(result)
        return res
    }
    const timeValue = (e, val)=>{
        //console.warn(timeRange)
        //console.log(timeSlider)
        let currentTime = timeSlider.find((element) => element.value === val).label + ':00'

        let datetime_as_date = Date.parse(context.currentDate + 'T' + currentTime);
        //console.log(currentTime)
        setContext({
            singleDay: true,
            week: false,
            today: false,
            last_24_hours: false,
            daysInRange: false,
            currentDate: context.currentDate,
            min_date:'',
            max_date:'',
            min_datetime: datetime_as_date,
            max_datetime: datetime_as_date
        })

    }



    const resetTime = () =>{
        if(context.singleDay){
            let min_datetime_as_date = Date.parse(context.currentDate + 'T00:00:00');
            let max_datetime_as_date = Date.parse(context.currentDate + 'T23:59:59');

            setContext({
                singleDay: true,
                week: false,
                today: false,
                last_24_hours: false,
                daysInRange: false,
                currentDate: context.currentDate,
                min_date:'',
                max_date:'',
                min_datetime: min_datetime_as_date,
                max_datetime: max_datetime_as_date
            })
        }
        else return null
    }
    useEffect(()=>{
            try {
                if(context.singleDay || context.today){
                    requestForTime(context.currentDate,props.satelliteSuomi,props.satelliteNoaa).then(response =>{
                            let res = response.sort()
                            for(let i = 0;i < res.length;i++){
                                localFormattingArray.push({value: i*9, label: res[i]})
                                //console.log(localFormattingArray.length)
                            }
                            if(localFormattingArray.length >=1){
                                setTimeSlider(localFormattingArray);
                            }
                            else{
                                return null
                            }
                        }
                    )
                        .catch(e=>{
                            localFormattingArray = []
                            setTimeSlider(localFormattingArray)
                        })
                    //console.log('NO ERROR')
                }
            }
            catch (e){
                //console.log(e.message)
            }

    },[context,props.satelliteSuomi,props.satelliteNoaa])


    return(<>
            <div className={Timeline.divSlider}
                 onMouseDown={() => disableMapDragging(props.map)}
                 onMouseUp={() => enableMapDragging(props.map)}
            ><div><button className={Timeline.val} onClick={resetTime}>Сбросить время</button></div>

                <Slider
                    color={'primary'}
                    sx={{
                        width: 800,
                        left: 30,
                        bottom: 1,
                        '& .MuiSlider-mark': {
                            height: 10,
                        }
                    }}
                    defaultValue={9}
                    track={false}
                    onChange={timeValue}
                    step={9}
                    marks={timeSlider}
                    //min={10}
                    max={175}
                />

            </div>
        </>
    )
}