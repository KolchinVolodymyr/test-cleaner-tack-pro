import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";

export const ClientEditPage = () => {
    let history = useHistory();
    const ID = useParams().id;
    const {request, clearError, error} = useHttp();
    const message = useMessage();
    const [data, setData] = useState({
        name: '', address: '', phone: '', contactPerson: '', client: '', status: ''
    });
    const [count, setCount] = useState(0);

    const fetchClient = useCallback(async () => {
        try {
            const response = await request(`/client/${ID}/edit`, 'GET')
            message(response.message);
            setData(response.client);

            const promises = response.clientWorksitesItem.map(async(el) => {
                if(el.status === true) {
                    setCount(count+1)
                }
            })
            await Promise.all(promises);
        } catch (e) {console.log(e)}
    }, [ID, request]);

    useEffect(()=>{
        fetchClient()
    }, [fetchClient]);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = event => {
        setData({...data, [event.target.name]: event.target.value});
    }
    const changeHandlerChecked = (event) => {
        if(event.target.checked === true) {
            setData({...data, [event.target.name] : event.target.checked });
        } else {
            if(count === 0){
                setData({...data, [event.target.name] : event.target.checked });
            } else {
                message('Client with active worksites cannot be deactivated');
            }
        }
    }

    const PressHandler = async ()  => {
        try {
            const response = await request(`/client/${ID}/edit`, 'PUT', {...data, id: ID});
            message(response.message);
            setData(response);
            history.push(`/client/list`);
        } catch (e) {console.log(e)}

    }

    return(
        <div>
            <h1>
                Client Edit Page
            </h1>
            <div className="row">
                <div>
                    <div className="input-field">
                        <input
                            placeholder="Name"
                            name="name"
                            type="text"
                            value={data.name || ""}
                            onChange={changeHandler}
                        />
                        <label className="active" htmlFor="link">Enter the name</label>
                    </div>
                    <div className="input-field">
                        <input
                            name="address"
                            type="text"
                            className="validate"
                            value={data.address || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="phone"
                            value={data.phone || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        Contact person:
                        <input
                            type="text"
                            name="contactPerson"
                            value={data.contactPerson || ""}
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <label>Corporate or personal?</label>
                        <select
                            className="browser-default"
                            defaultValue={data.client || ""}
                            name="client"
                            onChange={changeHandler}
                        >
                            <option value='Choose your option' disabled>Choose your option</option>
                            <option value='Corporate'>Corporate</option>
                            <option value='Personal'>Personal</option>
                        </select>
                    </div>
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