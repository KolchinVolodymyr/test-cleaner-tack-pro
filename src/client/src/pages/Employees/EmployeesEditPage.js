import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";

export const EmployeesEditPage = () => {
    let history = useHistory();
    const ID = useParams().id;
    const {request, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', phone: '', date_of_birth: '', salary: '', status: ''
    });
    const [count, setCount] = useState(0);

    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/employees/${ID}/edit`, 'GET');
            setData(response.employees);
            response.employeesJob.map((el) => {
                if(el.status === true) {
                    setCount(count+1)
                }
            })
        } catch (e) {console.log(e)}
    }, [ID, request]);

    useEffect(()=>{
        fetchClient()
    }, []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const pressHandler = async ()  => {
        try {
            const response = await request(`/employees/${ID}/edit`, 'PUT', {...data, id: ID});
            message(response.message);
            setData(response);
            history.push(`/employees/list`);
        } catch (e) {console.log(e)}
    }
    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = event => {
         if(event.target.checked === true) {
             setData({...data, [event.target.name] : event.target.checked });
         } else {
             if(count === 0){
                 setData({...data, [event.target.name] : event.target.checked });
             } else {
                 message('Employees with active job cannot be deactivated');
             }
         }
    }

    return(
        <div>
            <h1>
                Employees Edit Page
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
                        <input
                            placeholder="Name"
                            name="name"
                            type="text"
                            value={data.name}
                            onChange={changeHandler}
                        />
                        <label className="active" htmlFor="link">Enter the name</label>
                    </div>
                    <div className="input-field">
                        <input
                            name="address"
                            type="text"
                            className="validate"
                            value={data.address}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="number"
                            name="phone"
                            value={data.phone}
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        Date of birth:
                        <input
                            type="date"
                            name="date_of_birth"
                            value={data.date_of_birth}
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        Salary:
                        <input
                            type="number"
                            name="salary"
                            value={data.salary}
                            onChange={changeHandler}
                        />
                    </div>
                    <p>
                        <label>
                            <input
                                type="checkbox"
                                name="status"
                                className="filled-in"
                                checked={data.status}
                                onChange={changeHandlerChecked}
                            />
                            <span>Status</span>
                        </label>
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={pressHandler}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}