import React, {useState, useEffect, useCallback} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";

export const EquipmentEditPage = () => {
    let history = useHistory();
    const ID = useParams().id;
    const {request, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', storageLocation: '', usageFee: '', status: ''
    });
    const [count, setCount] = useState(0);

    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/equipment/${ID}/edit`, 'GET');
            setData(response.equipment);
            console.log('response', response);
            response.equipmentJob.map((el) => {
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
    }, [error, message, clearError])

    const pressHandler = async ()  => {
        try {
            const response = await request(`/equipment/${ID}/edit`, 'PUT', {...data, id: ID});
            message(response.message);
            // setData(response);
            history.push(`/equipment/list`);
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
                 message('Equipment with active job cannot be deactivated');
             }
         }
    }

    return(
        <div>
            <h1>
                Equipment Edit Page
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
                        <input
                            name="name"
                            type="text"
                            className="validate"
                            value={data.name}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            name="storageLocation"
                            type="text"
                            className="validate"
                            value={data.storageLocation}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="number"
                            name="usageFee"
                            value={data.usageFee}
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