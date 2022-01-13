import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/loader";

export const MonthlyExpenseReport = () => {
    const {request} = useHttp();
    const [data, setData] = useState([]);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [equipmentTotal, setEquipmentTotal] = useState(0);
    const [currentMonth, setCurrentMonth] = useState([]);
    const [month, setMonth] = useState([]);
    const [dataRender, setDataRender] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chooseMonth, setChooseMonth] = useState(false);
    const [dataEmployees, setDataEmployees] = useState([]);

    const loadMessage = async () => {
        try {
            const response = await request('/monthlyExpenseReport', 'GET')
                console.log('res', response);
                setData(response.job);
                setDataEmployees(response.employees);
                let arrMonth = [];
                response.job.forEach(el => {
                if (arrMonth.indexOf(el.startDate.slice(0, -3)) === -1) {
                    arrMonth.push(el.startDate.slice(0, -3));
                }
                if (arrMonth.indexOf(el.endDate.slice(0, -3)) === -1) {
                    arrMonth.push(el.endDate.slice(0, -3));
                }
            })
            setMonth(arrMonth);
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
        let EmployeeTotalTmp = 0;
        setCurrentMonth({...currentMonth, [event.target.name]: event.target.value});
        let newData = [];

        data.forEach((a) => {
            if(event.target.value === a.startDate.slice(0, -3) || event.target.value === a.endDate.slice(0, -3)) {
                dataEmployees.map((el)=>{
                    if(el._id === a.employeesID) {
                        newData.push(el);
                        EmployeeTotalTmp += Number(el.salary);
                    }
                })
                setEmployeeTotal(EmployeeTotalTmp);
                setDataRender(newData);
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
                    Monthly Expense Report Page
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
                Monthly Expense Report Page
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
                    <th>Employee name</th>
                    <th>Employee salary</th>
                </tr>
                </thead>
                <tbody>
                {dataRender.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.salary}</td>
                        </tr>
                    )
                    })
                }
                <tr>
                    <th>Total</th>
                    <td>{employeeTotal}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}