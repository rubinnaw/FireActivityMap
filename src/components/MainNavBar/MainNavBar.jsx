import React, {useContext, useEffect, useState} from "react";
import NavBarStyles from './MainNavBar.module.css';
import NavBarIcon from '../../icons/NavBarIcons/2x/twotone_miscellaneous_services_black_24dp.png';
import NavBarCloseIcon from '../../icons/closeButton/2x/twotone_close_black_24dp.png';
import 'react-calendar/dist/Calendar.css';
import {CSSTransition} from "react-transition-group";
import {Context} from "../Map/Context";
import {Checkbox, List, ListItem, Select, Switch} from "@mui/material";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import Range_days from "./MainNavBar.module.css";
import transition from "react-element-popper/animations/transition"
import DatePicker, {DateObject} from "react-multi-date-picker";
import {disableMapDragging,enableMapDragging} from '../Map/MapEvents/MapEvents'
import {useCookies} from "react-cookie";
import dayjs from "dayjs";




export function MainNavBar(props){
    const [showNavBar, setShowNavBar] = useState(false);
    const [context, setContext] = useContext(Context);
    const [dateRange, setDateRange] = useState([new DateObject()]);
    const today = [new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth() + 1,new Date(Date.now()).getDate()].join('-');
    const minDate =[new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth() + 1,new Date(Date.now()).getDate() - 6].join('-');
    const maxDate = [new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth() + 1,new Date(Date.now()).getDate()].join('-');

    const yesterday = [new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth() + 1,new Date(Date.now()).getDate() - 1].join('-');
    const [refreshTokenCookies,setRefreshTokenCookie,removeRefreshTokenCookie] = useCookies(['refreshToken','accessToken']);

    const timeNow = dayjs(Date.now()).format("HH:mm")
    const setToday = () =>{
        return [new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),new Date(Date.now()).getDate()].join('-');
    }

    const resetDaysInRangeIntoToday = () => {
        let today = [new Date(Date.now()).getFullYear(),new Date(Date.now()).getMonth(),new Date(Date.now()).getDate()].join('-');

        setDateRange([new DateObject()]);

        // console.log(today)
          setContext({
              singleDay: false,
              week: false,
              today: true,
              last_24_hours: false,
              daysInRange: false,
              currentDate: today,
              min_date: null,
              max_date: null,
              min_datetime: Date.parse(today + 'T00:00:00'),
              max_datetime: Date.parse(today + 'T23:59:59')
          })

        // console.log('resetDaysInRangeIntoToday')
    }


    const setValidDate = (dateRange) =>{
        let minDate = dateRange[0].year + '-' + dateRange[0].month.number + '-' + dateRange[0].day;
        let maxDate = dateRange[1].year + '-' + dateRange[1].month.number + '-' + dateRange[1].day;

        setDaysInRange(minDate,maxDate)
    }


    const setDaysInRange = (minDate,maxDate) =>{
         setContext({
                    singleDay: false,
                    week: false,
                    today: false,
                    last_24_hours: false,
                    daysInRange: true,
                    currentDate: '',
                    min_date: minDate,
                    max_date: maxDate,
                    min_datetime: Date.parse('2022-05-11T00:00:00'),
                    max_datetime: Date.parse('2022-05-11T23:59:59')
                })

        // console.log('firstDate: ',minDate);
        // console.log('firstDate: ',maxDate)
    }


    return(
        <>
            <button  className={NavBarStyles.show_hide_NavBar} onClick={() => {
                setShowNavBar(!showNavBar)
                // console.log('access: ',refreshTokenCookies['accessToken'])
                // console.log('refresh: ',refreshTokenCookies['refreshToken'])
            }}>
                {showNavBar ?  <img src={NavBarCloseIcon} width={32} height={35}/> : <img src={NavBarIcon} width={32} height={35}/>}
            </button>

            <CSSTransition in={showNavBar} timeout={300} classNames={{
                enterActive: NavBarStyles.transition_enter,
                enterDone: NavBarStyles.transition_enter_active,
                exitActive: NavBarStyles.transition_exit_active,
                exitDone: NavBarStyles.transition_exit
            }} unmountOnExit>

                <div className={NavBarStyles.navBar} onMouseDown={() =>disableMapDragging(props.map)} onMouseUp={() => enableMapDragging(props.map)}>
                    <div className={NavBarStyles.reportPdf}>
                        <button className={NavBarStyles.reportButton} onClick={props.modalPDF}>Отчёт в PDF</button>
                    </div>
                    <div className={NavBarStyles.reportShp}>
                        <button className={NavBarStyles.reportButton} onClick={props.modalSHP}>Отчёт в SHP</button>
                    </div>
                    <div className={NavBarStyles.navBarMainInstruments}>
                        <List className={NavBarStyles.list} >
                            <b className={NavBarStyles.list_b_name}>Варианты подстилающей карты</b><br/>
                            {props.layers.map((listItem,index)=>(listItem.type === 'baseLayer' ?
                                    <div className={NavBarStyles.style_map}>
                                        <ListItem  key={index}>
                                            {listItem.name}{
                                            <Checkbox
                                                key={index}
                                                checked={listItem.name === props.layers.find(name => name.url === props.layersValue).name}
                                                edge="end"
                                                onChange={()=>props.layersChange(listItem.url)}
                                            />
                                        }
                                        </ListItem>
                                    </div>
                                        : listItem.type === 'markersOverlay' ?
                                        <div className={NavBarStyles.divSwitch}>
                                            <b className={NavBarStyles.list_b_name}>Отображение дополнительных данных</b>
                                            <ListItem className={NavBarStyles.listItem} key={index}>
                                                {listItem.name}{
                                                <Switch
                                                    checked={props.markersValue}
                                                    edge="end"
                                                    onChange={()=>props.markersShow()}
                                                    //inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            }
                                            </ListItem>
                                            {props.markersValue && <div className={NavBarStyles.markersDiv}>
                                                <div className={NavBarStyles.markersYellow}>
                                                    <span className={NavBarStyles.spanInfo}>{'<593K'}</span>
                                                </div>
                                                <div className={NavBarStyles.markersOrange}>
                                                    <span className={NavBarStyles.spanInfo}>{'>593K<613K'}</span>
                                                </div>
                                                <div className={NavBarStyles.markersRed}>
                                                    <span className={NavBarStyles.spanInfo}>{'>613K<663K'}</span>
                                                </div>
                                                <div className={NavBarStyles.markersExtraHot}>
                                                    <span className={NavBarStyles.spanInfo}>{'>663K'}</span>
                                                </div>
                                            </div>}
                                        </div>
                                            : listItem.type === 'natureReserves' ?
                                            <div className={NavBarStyles.divSwitch}>
                                                <ListItem className={NavBarStyles.listItem} key={index}>
                                                    {listItem.name}{
                                                    <Switch
                                                        key={index}
                                                        checked={props.natureReservesValue}
                                                        edge="end"
                                                        onChange={()=>props.NatureReservesShow()}
                                                        //inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                }
                                                </ListItem>
                                            </div>
                                                : listItem.type === 'Suomi NPP' ?
                                                <div className={NavBarStyles.divSwitch}>
                                                    <br></br>
                                                    <b className={NavBarStyles.list_b_name}>Спутниковые снимки</b>
                                                    <ListItem className={NavBarStyles.listItem} key={index}>
                                                        {listItem.name}{
                                                        <Switch
                                                            key={index}
                                                            checked={props.SuomiValue}
                                                            edge="end"
                                                            onChange={()=>props.SuomiShow()}
                                                        />
                                                    }
                                                    </ListItem>
                                                </div>
                                                    : listItem.type === 'NOAA-20' ?
                                                    <div  className={NavBarStyles.divSwitch}>
                                                        <ListItem className={NavBarStyles.listItem} key={index}>
                                                            {listItem.name}{
                                                            <Switch
                                                                key={index}
                                                                checked={props.NOAAValue}
                                                                edge="end"
                                                                onChange={()=>props.NOAAShow()}
                                                            />
                                                        }
                                                        </ListItem>


                                                        {(props.SuomiValue || props.NOAAValue) &&

                                                            <div className={NavBarStyles.compositeList}>
                                                                {<div className={NavBarStyles.list_b_name}>Настройки отображения</div>}
                                                                {<div>
                                                                    <div>
                                                                        <div style={{marginLeft: "12px",borderStyle: "solid",borderWidth: "0.5px",borderRadius: "3px",padding: "1px"}}>контрастность
                                                                                <input type={"number"}
                                                                                       defaultValue={props.contrastValue}
                                                                                       onChange={(e) => props.contrastChange(e.target.value)}
                                                                                       min={"-16"} max={"16"}
                                                                                       style={{height: "20px",width: "45px",marginBottom: '1px',marginLeft: "28px"}}/>
                                                                            яркость
                                                                                <input type={"number"}
                                                                                       defaultValue={props.brightnessValue}
                                                                                       onChange={(e) => props.brightnessChange(e.target.value)}
                                                                                       min={"-16"} max={"16"}
                                                                                       style={{height: "20px",width: "45px",marginLeft: "77px"}}/>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                            {(props.SuomiValue || props.NOAAValue) && props.compositeList.map((com, index) => (
                                                                <div className={NavBarStyles.imagesComposite}>
                                                                    <ListItem key={index}
                                                                              className={NavBarStyles.imagesComposite}>
                                                                        {com.name}{
                                                                        <Checkbox
                                                                            key={index}
                                                                            checked={com.composite === props.compositeList.find(composite => composite.composite === props.ImageComposite).composite}
                                                                            edge="end"
                                                                            onChange={() => props.compositeChange(com.composite)}
                                                                        />
                                                                    }
                                                                    </ListItem>
                                                                </div>
                                                            ))
                                                            }
                                                        </div>}


                                                    </div>
                                                    : listItem.type === 'settlement' ?
                                                        <div  className={NavBarStyles.divSwitch}>
                                                            <ListItem className={NavBarStyles.listItem} key={index}>
                                                                {listItem.name}{
                                                                <Switch
                                                                    key={index}
                                                                    checked={props.settLementValue}
                                                                    edge="end"
                                                                    onChange={()=> {
                                                                        props.settLementShow()
                                                                    }}
                                                                    //inputProps={{ 'aria-labelledby': labelId }}
                                                                />
                                                            }
                                                            </ListItem>
                                                        </div>
                                                        :
                                                    <div className={NavBarStyles.divSwitch}>
                                                        <ListItem className={NavBarStyles.listItem} key={index}>
                                                            {listItem.name}{
                                                            <Switch
                                                                key={index}
                                                                checked={props.bordersValue}
                                                                edge="end"
                                                                onChange={()=>props.bordersShow()}
                                                                //inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        }
                                                        </ListItem>
                                                    </div>
                            ))
                            }
                        </List>
                    </div>




                    <div className={NavBarStyles.navBarSortDate}>
                        <b className={NavBarStyles.heading_sort}>Сортировать данные за:</b>
                        <button className={NavBarStyles.buttonSort} onClick={()=> {
                            setContext({
                                today: true,
                                singleDay: true,
                                week: false,
                                last_24_hours: false,
                                daysInRange: false,
                                min_date: '',
                                max_date: '',
                                currentDate: dayjs(today).format("YYYY-MM-DD"),
                                min_datetime: setToday() + 'T00:00:00',
                                max_datetime: setToday() + 'T23:59:59',
                            })
                            //console.log(today)
                        }} title={'Точки пожаров за сегодня'}>Сегодня</button>

                        <button className={NavBarStyles.buttonSort} onClick={()=> {
                            setContext({
                                today: false,
                                singleDay: false,
                                week: false,
                                last_24_hours: true,
                                daysInRange: false,
                                min_date: dayjs(yesterday).format("YYYY-MM-DD"),
                                max_date: dayjs(today).format("YYYY-MM-DD"),
                                min_datetime: dayjs(yesterday).format("YYYY-MM-DDT") + timeNow,
                                max_datetime: dayjs(Date.now()).format("YYYY-MM-DDT") + timeNow,
                                currentDate: '',
                            })
                        }} title={'Точки пожаров за 24 часа'}>24 часа</button>

                        <button className={NavBarStyles.buttonSort} onClick={()=>setContext({
                            today: false,
                            singleDay: false,
                            week: true,
                            last_24_hours: false,
                            daysInRange: false,
                            min_date: minDate,
                            max_date: maxDate,
                            currentDate: ''
                        })} title={'Точки пожаров за неделю'}>Неделя</button>
                    </div>


                    <div className={Range_days.navBarMainInstruments}>
                        <b>Сбор данных за несколько дней (не более 14 дней):</b>
                        <div className={Range_days.date_time_max_div}>
                            <p4>Укажите начальный и конечный день: </p4>
                            <DatePicker
                                range
                                value={dateRange}
                                minDate={new DateObject().subtract(15, "days")}
                                maxDate={new DateObject()}
                                onChange={setDateRange}
                                plugins={[<DatePanel/>]}
                                rangeHover
                                animations={[
                                    transition({
                                        from: 40,
                                        transition: "all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)",
                                    }),
                                ]}
                            />
                        </div>
                        <div className={Range_days.button_time}>
                            <button className={Range_days.save_time} onClick={()=>setValidDate(dateRange)}>Сохранить</button>
                            <button className={Range_days.reset_time} onClick={()=>resetDaysInRangeIntoToday()} >Сбросить</button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </>
    );
}