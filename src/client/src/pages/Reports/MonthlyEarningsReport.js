import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";

export const  MonthlyEarningsReport = () => {
    const {request} = useHttp();
    const [data, setData] = useState([]);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [equipmentTotal, setEquipmentTotal] = useState(0);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [month, setMonth] = useState([]);
    const [dataRender, setDataRender] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chooseMonth, setChooseMonth] = useState(false);

    const loadMessage = async () => {
        try {
            const response = await request('/monthlyEarningsReport', 'GET')
            let arrMonth = [];
            response.dataJob.forEach(el => {
                if (arrMonth.indexOf(el.job.startDate.slice(0, -3)) === -1) {
                    arrMonth.push(el.job.startDate.slice(0, -3));
                    // arrMonth.push(el.job.endDate.slice(0, -3));
                }
                if (arrMonth.indexOf(el.job.endDate.slice(0, -3)) === -1) {
                    // arrMonth.push(el.job.startDate.slice(0, -3));
                    arrMonth.push(el.job.endDate.slice(0, -3));
                }

                el.total = el.employees.salary;
                el.job.additionalEquipment.forEach(index => {
                    if (index.usageFee) {
                        el.total += Number(index.usageFee);
                    }
                })
            })
            setMonth(arrMonth);
            setData(response.dataJob);
            setIsLoaded(true);
        } catch (e) {console.log(e)}
    };

    // Note: an empty array of dependencies [] means that
    // this useEffect will run once
    // similar to componentDidMount ()
    useEffect(()=> {
        loadMessage();
    }, [])

    const changeHandler = event => {
        setChooseMonth(true);
        let EmployeeTotal = 0;
        let EquipmentTotal = 0;
        setCurrentMonth({...currentMonth, [event.target.name]: event.target.value});
        let newData = [];

        data.forEach((a) => {
            if(event.target.value === a.job.startDate.slice(0, -3) || event.target.value === a.job.endDate.slice(0, -3)) {
                newData.push(a);
                setDataRender(newData);
                EmployeeTotal += Number(a.employees.salary);
                setEmployeeTotal(EmployeeTotal);
                a.job.additionalEquipment.forEach(index => {
                    if(index.usageFee) {
                        EquipmentTotal += Number(index.usageFee);
                    }
                })
                setEquipmentTotal(EquipmentTotal);
            }
        })
    }
    if (!isLoaded) {
        return <Loader/>
    }
    if (!chooseMonth) {
        return (
            <div>
                <h1>
                    Monthly Earnings Report Page
                </h1>
                <label>Choose your date and month</label>
                <select
                    className="browser-default"
                    defaultValue={data.client || ""}
                    name="date"
                    onChange={changeHandler}
                >
                    <option value='Choose your option' disabled>Choose your option</option>
                    {month.map((el, index) => {
                        return (
                            <option key={index} value={el}>{el}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
    return(
        <div>
            <h1>
                Monthly Earnings Report Page
            </h1>
            <label>Choose your date and month</label>
            <select
                className="browser-default"
                defaultValue={data.client || ""}
                name="date"
                onChange={changeHandler}
            >
                <option value='Choose your option' disabled>Choose your option</option>
                {month.map((el, index) => {
                    return (
                        <option key={index} value={el}>{el}</option>
                    )
                })}
            </select>
            <table>
                <thead>
                <tr>
                    <th>Client name</th>
                    <th>Employee revenue</th>
                    <th>Equipment revenue</th>
                    <th>Total revenue</th>
                </tr>
                </thead>
                <tbody>
                {dataRender.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{item.client.name}</td>
                            <td>{item.employees.salary}</td>
                            <td>{item.job.additionalEquipment.map((el, index)=>{
                                if(item.job.additionalEquipment.length == 0) {
                                    return(
                                        <div key={index}>
                                            <div>0</div>
                                        </div>
                                    )
                                } else {
                                    return(
                                        <div key={index}>
                                            <div >{el.usageFee}</div>
                                        </div>
                                    )
                                }

                            })}
                            </td>
                            <td>{item.total}</td>
                        </tr> )

                })}
                <tr>
                    <th>Total</th>
                    <td>{employeeTotal}</td>
                    <td>{equipmentTotal}</td>
                    <td>{equipmentTotal+employeeTotal}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}