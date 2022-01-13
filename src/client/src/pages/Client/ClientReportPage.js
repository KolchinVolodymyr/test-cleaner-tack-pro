import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";

export const ClientReportPage = () => {
    const ID = useParams().id;
    const [data, setData] = useState([]);
    const [month, setMonth] = useState([]);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesRender, setEmployeesRender] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chooseMonth, setChooseMonth] = useState(false);

    const {request} = useHttp();
    const loadMessage = async () => {
        try {
            const response = await request(`/client/${ID}/report`, 'GET')
            // console.log('response', response.employeesItem);
            response.employeesItem.forEach(el =>{
                if (month.indexOf(el.job.startDate.slice(0, -3)) == -1) {
                    month.push(el.job.startDate.slice(0, -3));
                }
            })

            setEmployees(response.employeesItem);

            response.employeesItem.forEach(el => {
                el.total = el.employees.salary;
                el.job.additionalEquipment.forEach(index => {
                    if(index.usageFee) {
                        el.total += Number(index.usageFee);
                    }
                })
            })
            setData(response.clientWorksitesItem);
            setIsLoaded(true);
            // history.push(`/`);
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
        setCurrentMonth({...currentMonth, [event.target.name]: event.target.value});
        let newEmployees = [];

        employees.forEach((a) => {
            if(event.target.value === a.job.startDate.slice(0, -3)) {
                newEmployees.push(a);
                setEmployeesRender(newEmployees);
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
                    Client Report Page
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
                Client Report Page
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
                        <th>Worksite name</th>
                        <th>Employee name</th>
                        <th>Equipment used</th>
                        <th>Employee job cost</th>
                        <th>Equipment cost</th>
                        <th>Total cost</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesRender.map((item, index) => {
                        if(item.job.additionalEquipment.length == 0) {
                            return( <tr key={index}>
                                <td>{item.worksites.name}</td>
                                <td>{item.employees.name}</td>
                                <td>--</td>
                                <td>{item.employees.salary}</td>
                                <td>0</td>
                                <td>{item.total}</td>
                            </tr> )
                        } else {
                            return( <tr key={index}>
                                <td>{item.worksites.name}</td>
                                <td>{item.employees.name}</td>
                                <td>{item.job.additionalEquipment.map((el)=>{
                                    return(<div key={el._id}>{el.name}</div>)
                                })}</td>
                                <td>{item.employees.salary}</td>
                                <td>{item.job.additionalEquipment.map((el)=>{
                                    return(<div key={el._id}>{el.usageFee}</div>)
                                })}</td>
                                <td>{item.total}</td>
                            </tr> )
                        }
                    })}
                </tbody>
            </table>

        </div>
    )
}