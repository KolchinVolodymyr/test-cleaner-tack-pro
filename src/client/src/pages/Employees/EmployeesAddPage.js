import React, {useState, useEffect} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useHistory} from "react-router-dom";
import {useMessage} from "../../hooks/message.hook";

export const EmployeesAddPage = () => {
    const history = useHistory();
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', phone: '', salary: '', date_of_birth: '', status: false
    });

    const handleSubmitCreate = async () => {
        try {
            const response = await request('/employees', 'POST', {...data})
            message(response.message);
            history.push(`/employees/list`);
        } catch (e) {console.log(e)}
    };

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = event => {
        setData({...data, [event.target.name]: event.target.checked});
    }

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    return(
        <div>
            <h1>
                Create Employee
            </h1>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Primary office address:
                    <input
                        type="text"
                        name="address"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Contact phone:
                    <input
                        type="text"
                        name="phone"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Salary:
                    <input
                        type="number"
                        name="salary"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Date of birth:
                    <input
                        type="date"
                        name="date_of_birth"
                        onChange={changeHandler}
                    />
                </label>
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
                    onClick={handleSubmitCreate}
                    disabled={loading}
                >
                    Create
                </button>
            </form>
        </div>
    )
}