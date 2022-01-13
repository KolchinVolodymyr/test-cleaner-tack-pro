import React, {useState, useEffect, useCallback} from 'react';
import {useHttp} from "../../hooks/http.hook";
import {useHistory} from "react-router-dom";
import {useMessage} from "../../hooks/message.hook";
import Multiselect from "multiselect-react-dropdown";

export const JobAddPage = () => {
    const history = useHistory();
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        worksiteID: '', type: '', hazardousMaterials: '', serviceFee: '', startDate: '', endDate: '', employeesID: '', status: false
    });
    const [worksites, setWorksites] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [additionalEquipment, setAdditionalEquipment] = useState({});

    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/job`, 'GET');
            setWorksites(response.worksites);
            setEmployees(response.employees);
            console.log('response', response);
            setEquipment(response.equipment)
        } catch (e) {console.log(e)}
    }, [request]);

    useEffect(()=>{
        fetchClient()
    }, []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const handleSubmitCreate = async () => {
        try {
            const response = await request('/job', 'POST', {...data, additionalEquipment: additionalEquipment})
            message(response.message);
            history.push(`/job/list`);
        } catch (e) {console.log(e)}
    };

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = event => {
        setData({...data, [event.target.name]: event.target.checked});
    }

    function onSelect(selectedList, selectedItem) {
        setAdditionalEquipment(selectedList);
    }

    function onRemove(selectedList, removedItem) {
        setAdditionalEquipment(selectedList);
    }

    return(
        <div>
            <h1>
                Job add Page
            </h1>
            <form>
                Worksite:
                <select
                    className="browser-default"
                    value={data.worksiteID || 'Choose your option'}
                    name="worksiteID"
                    onChange={changeHandler}
                >
                    <option value='Choose your option' disabled>Choose your option</option>
                    {worksites.map(el => {
                        return (
                            <option key={el._id} value={el._id}>{el.name}</option>
                        )
                    })}
                </select>
                <label>Type:</label>
                    <select
                        className="browser-default"
                        defaultValue='Choose your option'
                        name="type"
                        onChange={changeHandler}
                    >
                        <option value='Choose your option' disabled>Choose your option</option>
                        <option value='office cleaning'>office cleaning</option>
                        <option value='home cleaning'>home cleaning</option>
                        <option value='deep cleaning'>deep cleaning</option>
                        <option value='outdoor cleaning'>outdoor cleaning</option>
                    </select>
                <label>Hazardous materials</label>
                    <select
                        className="browser-default"
                        defaultValue='Choose your option'
                        name="hazardousMaterials"
                        onChange={changeHandler}
                    >
                        <option value='Choose your option' disabled>Choose your option</option>
                        <option value='true'>true</option>
                        <option value='false'>false</option>
                    </select>

                <label>
                    Service fee:
                    <input
                        type="number"
                        name="serviceFee"
                        onChange={changeHandler}
                    />
                </label>
                <div>
                    Additional equipment
                    <Multiselect
                        options={equipment} // Options to display in the dropdown
                        selectedValues={data.additionalEquipment} // Preselected value to persist in dropdown
                        onSelect={onSelect} // Function will trigger on select event
                        onRemove={onRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                    />
                </div>
                <label>
                    Start date:
                    <input
                        type="date"
                        name="startDate"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    End date:
                    <input
                        type="date"
                        name="endDate"
                        onChange={changeHandler}
                    />
                </label>
                <label>
                    Employees:
                    <select
                        className="browser-default"
                        value={data.employeesID || "Choose your option"}
                        name="employeesID"
                        onChange={changeHandler}
                    >
                        <option value='Choose your option' disabled>Choose your option</option>
                        {employees.map(el =>{
                            return (
                                <option key={el._id} value={el._id}>{el.name}</option>
                            )
                        })}
                    </select>
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