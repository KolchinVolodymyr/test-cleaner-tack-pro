import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import Multiselect from 'multiselect-react-dropdown';
import {useMessage} from "../../hooks/message.hook";

export const JobEditPage = () => {
    let history = useHistory();
    const ID = useParams().id;
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        worksiteID: '', type: '', serviceFee: '', hazardousMaterials: '',additionalEquipment: '', startDate: '', endDate: '', employeesID: '', status: ''
    });
    const [worksites, setWorksites] = useState([]);
    const [currentWorksiteID, setCurrentWorksiteID] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [additionalEquipment, setAdditionalEquipment] = useState({});
    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/job/${ID}/edit`, 'GET');
            setData(response.job);
            setWorksites(response.worksitesList);
            setCurrentWorksiteID(response.job.worksiteID);
            setEmployees(response.employees);
            setEquipment(response.equipment)
            // console.log('response.equipment', response.equipment);
            // history.push(`/`);
        } catch (e) {console.log(e)}
    }, [ID, request]);

    useEffect(()=>{
        fetchClient()
    }, []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = (event) => {
//        if(event.target.checked === true) {
            setData({...data, [event.target.name] : event.target.checked });
//        } else {
//            if(count === 0){
//                setData({...data, [event.target.name] : event.target.checked });
//            } else {
//                message('Client with active worksites cannot be deactivated');
//            }
//        }
    }

    const PressHandler = async () => {
        try {
            const response = await request(`/job/${ID}/edit`, 'PUT', {...data, id: ID, currentWorksiteID: currentWorksiteID, additionalEquipment: additionalEquipment});
            message(response.message);
            setData(response);
            history.push(`/job/list`);
        } catch (e) {console.log(e)}

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
                Job Edit Page
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
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
                                <option key={el.name} value={el._id}>{el.name}</option>
                            )
                        })}
                        </select>
                    </div>
                    <div className="input-field">
                        Type:
                        <select
                            className="browser-default"
                            value={data.type || 'Choose your option'}
                            name="type"
                            onChange={changeHandler}
                        >
                            <option value='Choose your option' disabled>Choose your option</option>
                            <option value='home cleaning'>home cleaning</option>
                            <option value='office cleaning'>office cleaning</option>
                            <option value='industrial area cleaning'>industrial area cleaning</option>
                            <option value='deep cleaning'>deep cleaning</option>
                            <option value='outdoor cleaning'>outdoor cleaning</option>
                        </select>
                    </div>
                    <div className="input-field">
                        Hazardous materials:
                        <select
                            className="browser-default"
                            value={data.hazardousMaterials}
                            name="hazardousMaterials"
                            onChange={changeHandler}
                        >
                            <option value='Choose your option' disabled>Choose your option</option>
                            <option value='true'>true</option>
                            <option value='false'>false</option>
                        </select>
                    </div>
                    <div className="input-field">
                        Service fee:
                            <input
                                type="number"
                                name="serviceFee"
                                defaultValue={data.serviceFee}
                                onChange={changeHandler}
                            />
                    </div>
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
                                value={data.startDate}
                                onChange={changeHandler}
                            />
                        </label>
                        <label>
                            End date:
                            <input
                                type="date"
                                name="startDate"
                                value={data.endDate}
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
                                    checked={data.status || ''}
                                    onChange={changeHandlerChecked}
                                />
                                <span>Status</span>
                            </label>
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={PressHandler}
                        >
                            Save
                        </button>
                </div>
            </div>
        </div>
    )
}